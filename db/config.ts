import { Pool } from "../deps.ts";
import type { Executor } from "./pg.ts";
import { Meta } from "../helpers/data.ts";

export interface PGConfig {
  initPool(): Pool;
  getSchemaVersion(executor: Executor): Promise<number>;
}

export function getDBConfig(): PGConfig {
  const supabaseServerConfig = getSupabaseServerConfig();

  return supabaseDBConfig(supabaseServerConfig);
}

const serverEnvVars = {
  url: (Deno.env.get("SUPABASE_DB_URL") ?? "").replace(
    "localhost",
    "host.docker.internal"
  ),
};

export type SupabaseServerConfig = typeof serverEnvVars;

export function getSupabaseServerConfig() {
  return validate(serverEnvVars);
}

function validate<T extends Record<string, string>>(vars: T) {
  for (const [, v] of Object.entries(vars)) {
    if (!v) {
      throw new Error(`Invalid Supabase config: SUPABASE_DB_URL must be set`);
    }
  }
  return vars;
}

export function supabaseDBConfig(config: SupabaseServerConfig) {
  const { url } = config;
  return new PostgresDBConfig(url);
}

export class PostgresDBConfig implements PGConfig {
  private _url: string;

  constructor(url: string) {
    console.log("Creating PostgresDBConfig with url", url);
    this._url = url;
  }

  initPool(): Pool {
    return new Pool(this._url, 20, true);
  }

  async getSchemaVersion(executor: Executor): Promise<number> {
    const metaExists = await executor<{ exists: boolean }>(`select exists(
        select from pg_tables where schemaname = 'public' and tablename = 'meta')`);
    if (!metaExists.rows[0].exists) {
      return 0;
    }
    const qr = await executor<Meta>(
      `select value from meta where key = 'schemaVersion'`
    );
    return qr.rows[0].value as number;
  }
}
