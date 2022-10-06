import { transact } from "../db/pg.ts";
import { getCookie } from "../helpers/data.ts";
import type { Payload } from "../deps.ts";

export async function spaceExists(spaceID: string, claims: Payload) {
  const cookie = await transact(async (executor) => {
    return await getCookie(executor, spaceID);
  }, claims);
  return cookie !== undefined;
}
