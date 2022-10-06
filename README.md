# Replicache - Supabase Edge Function

This is a Supabase edge function which acts as a backend for Replicache. It is based on a combination of the various examples in the [Replicache repositories](https://github.com/rocicorp).

## Features
* Implementation of the Replicache key:value store using Supabase's Postgres database
* Endpoints for Replicache `push`, `pull`, `create-space` and `space-exists` functions
* Auth tokens are forwarded to the DB for use with [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) if required

## Setup
The easiest way to get started is to clone this repo into a local [supabase/cli](https://supabase.com/docs/reference/cli) project.

### Mutators
The `index.ts` file imports a `mutators` object from `../_shared/mutators.ts`. Create this file and copy in your mutators from your Replicache client. Recommended directory structure for Supabase functions is found in the [supabase edge function docs](https://supabase.com/docs/guides/functions#organizing-your-edge-functions).

From your Supabase project root, run:

```bash
git clone https://github.com/onsetsoftware/replicache-supabase-edge-function.git supabase/functions/replicache

supabase start

# !! make sure your mutators file has been added !!
supabase functions serve replicache
```

## Endpoints
The function exposes 4 endpoints:

- `POST /push?spaceID={spaceID}`
- `POST /pull?spaceID={spaceID}`
- `POST /create-space?spaceID={spaceID}`
- `POST /space-exists?spaceID={spaceID}`

For example, in *local development* a typical URL would look like `http://localhost:54321/functions/v1/push?spaceID=123`.


