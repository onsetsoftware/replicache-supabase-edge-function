import { transact } from "../db/pg.ts";
import { createSpace as createSpaceImpl } from "../helpers/data.ts";
import { Payload } from "https://deno.land/x/djwt@v2.0/mod.ts";

export async function createSpace(spaceID: string, claims: Payload) {
  await transact(async (executor) => {
    await createSpaceImpl(executor, spaceID);
  }, claims);
}
