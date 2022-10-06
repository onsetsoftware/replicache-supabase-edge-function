// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

// This enables autocomplete, go to definition, etc.
import { decode, serve } from "./deps.ts";
import { pull } from "./endpoints/pull.ts";
import { createSpace } from "./endpoints/create-space.ts";
import { push } from "./endpoints/push.ts";

import { mutators } from "../_shared/mutators.ts";
import { spaceExists } from "./endpoints/space-exists.ts";

serve(async (req: Request) => {
  const { searchParams: query, pathname: action } = new URL(req.url);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, x-replicache-requestid, content-type",
  };
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const spaceId = query.get("spaceID");

  if (spaceId === null) {
    return new Response("Missing 'spaceID' parameter", {
      headers: corsHeaders,
      status: 400,
    });
  }

  const authorization = req.headers.get("authorization")?.split(" ")[1]!;
  const { payload: claims } = decode(authorization);

  try {
    switch (action.split("/").at(-1)) {
      case "pull": {
        const json = await req.json();
        return new Response(JSON.stringify(await pull(spaceId, json, claims)), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "push": {
        const json = await req.json();
        await push(spaceId, json, mutators, claims);

        return new Response(JSON.stringify({}), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      case "create-space": {
        await createSpace(spaceId, claims);
        return new Response(`Space '${spaceId}' created`, {
          headers: { ...corsHeaders },
        });
      }
      case "space-exists": {
        return new Response(
          String({ spaceExists: await spaceExists(spaceId, claims) }),
          {
            headers: { ...corsHeaders },
          }
        );
      }
      default: {
        return new Response("Invalid Action - " + String(action), {
          headers: corsHeaders,
          status: 400,
        });
      }
    }
  } catch (e) {
    console.error(e.toString());
    if (e.toString().includes("Broken pipe")) {
      return new Response("Connection Error - Please try again", {
        headers: corsHeaders,
        status: 400,
      });
    }
    return new Response(e.toString(), {
      headers: { ...corsHeaders },
      status: 500,
    });
  }
});
