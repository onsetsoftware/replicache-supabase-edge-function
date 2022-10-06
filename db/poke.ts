import type { Executor } from "./pg.ts";

export interface PokeBackend {
  initSchema(executor: Executor): Promise<void>;
  poke(spaceID: string): void;
}

export function getPokeBackend() {
  const global = globalThis as unknown as {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _pokeBackend: PokeBackend | undefined;
  };
  if (!global._pokeBackend) {
    global._pokeBackend = new SupabasePokeBackend();
  }
  return global._pokeBackend;
}

// Implements the poke backend using Supabase's realtime features.
export class SupabasePokeBackend implements PokeBackend {
  async initSchema(executor: Executor): Promise<void> {
    await executor(`alter publication supabase_realtime add table space`);
    await executor(`alter publication supabase_realtime set
        (publish = 'insert, update, delete');`);
  }

  poke() {
    // No need to poke, this is handled internally by the supabase realtime stuff.
  }
}
