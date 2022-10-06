// Low-level config and utilities for Postgres.

import { Pool, QueryObjectResult, type Payload } from "../deps.ts";

import { createDatabase } from "./schema.ts";
import { getDBConfig } from "./config.ts";

async function getPool(reset = false) {
  const global = globalThis as unknown as {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _pool: Pool;
  };
  if (!global._pool || reset) {
    global._pool = await initPool();
  }
  return global._pool;
}

async function initPool() {
  console.log("creating global pool");

  const dbConfig = getDBConfig();
  const pool = dbConfig.initPool();

  await withExecutorAndPool(async (executor) => {
    await transactWithExecutor(executor, async (executor) => {
      await createDatabase(executor, dbConfig);
    });
  }, pool);

  return pool;
}

export async function withExecutor<R>(f: (executor: Executor) => R) {
  const p = await getPool();
  return withExecutorAndPool(f, p);
}

async function withExecutorAndPool<R>(
  f: (executor: Executor) => R,
  p: Pool
): Promise<R> {
  try {
    const client = await p.connect();

    await client.queryObject(
      "SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE"
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const executor: Executor = async (sql: string, params?: any[]) => {
      try {
        return await client.queryObject(sql, params);
      } catch (e) {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `Error executing SQL: ${sql}: ${(e as unknown as any).toString()}`
        );
      }
    };

    try {
      return await f(executor);
    } finally {
      client.release();
    }
  } catch (e) {
    if (e.toString().includes("Broken pipe")) {
      console.log("Broken pipe, resetting pool");
      await p.end();
      await getPool(true);
      throw e;
    }
    console.log("error connecting to pool", e);
  }
  return undefined as unknown as R;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Executor = <T>(
  sql: string,
  params?: any[]
) => Promise<QueryObjectResult<T>>;
export type TransactionBodyFn<R> = (executor: Executor) => Promise<R>;

export type Auth = {
  sub?: string;
  role: string;
};

/**
 * Invokes a supplied function within a transaction.
 * @param body Function to invoke. If this throws, the transaction will be rolled
 * back. The thrown error will be re-thrown.
 * @param auth
 */
export async function transact<R>(body: TransactionBodyFn<R>, auth?: Payload) {
  return await withExecutor(async (executor) => {
    return await transactWithExecutor(executor, body, auth);
  });
}

async function transactWithExecutor<R>(
  executor: Executor,
  body: TransactionBodyFn<R>,
  auth?: Payload
) {
  for (let i = 0; i < 10; i++) {
    try {
      await executor("begin");
      try {
        if (auth) {
          await executor(`set local role = ${auth.role}`);
          await executor(
            `set local request.jwt.claims = '${JSON.stringify(auth)}'`
          );
        }
        const r = await body(executor);
        await executor("commit");
        return r;
      } catch (e) {
        await executor("rollback");
        if (e.toString().includes("violates row-level security policy")) {
          console.log("row-level security policy violation - rolling back");
        } else {
          console.log("caught error", e, "rolling back");
        }
        throw e;
      }
    } catch (e) {
      if (shouldRetryTransaction(e)) {
        console.log(
          `Retrying transaction due to error ${e} - attempt number ${i}`
        );
        continue;
      }
      throw e;
    }
  }
  throw new Error("Tried to execute transaction too many times. Giving up.");
}

//stackoverflow.com/questions/60339223/node-js-transaction-coflicts-in-postgresql-optimistic-concurrency-control-and
function shouldRetryTransaction(err: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const code = typeof err === "object" ? String((err as any).code) : null;
  return code === "40001" || code === "40P01";
}
