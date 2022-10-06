# Replicache - Supabase Edge Function

This is a Supabase edge function which acts as a backend for Replicache. It is based on a combination of the various examples in the [Replicache repositories](https://github.com/rocicorp).

## Usage
The easiest way to get started is to clone this repo into a local [supabase/cli](https://supabase.com/docs/reference/cli) project.

From your Supabase project root, run:

```bash

```

### Mutators
The `index.ts` file imports a `mutators` object from `../_shared/mutators.ts`. Create this file then copy in your mutators from your Replicache client.

## Endpoints
The function exposes 4 endpoints:

- `POST /push?spaceID={spaceID}`
- `POST /pull?spaceID={spaceID}`
- `POST /create-space?spaceID={spaceID}`
- `POST /space-exists?spaceID={spaceID}`

For example, in local development a typical URL would look like `http://localhost:54321/functions/v1/push?spaceID=123`.


