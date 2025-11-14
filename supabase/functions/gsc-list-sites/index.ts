// supabase/functions/gsc-list-sites/index.ts

// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
// Supabase Functions run in a Deno environment where 'Deno' is a predefined global.
declare var Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decodeJwt } from "https://deno.land/x/djwt@v2.8/mod.ts";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get logged-in user from the Auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const jwt = authHeader.replace("Bearer ", "");
    const payload = decodeJwt(jwt);
    const userId = payload.sub;

    if (!userId) return new Response("Unauthorized", { status: 401 });

    // 2. Pull this user's GSC connection row
    const { data: conn, error: connErr } = await supabase
      .from("gsc_connections")
      .select("*")
      .eq("owner_id", userId)
      .limit(1)
      .single();

    if (connErr || !conn) {
      return new Response(
        JSON.stringify({ error: "No GSC connection found" }),
        { status: 400 }
      );
    }

    let accessToken = conn.access_token;

    // 3. Refresh the token if needed
    if (conn.token_expires_at && new Date(conn.token_expires_at) < new Date()) {
      const refresh = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: Deno.env.get("GSC_CLIENT_ID")!,
          client_secret: Deno.env.get("GSC_CLIENT_SECRET")!,
          refresh_token: conn.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      const refreshJson = await refresh.json();
      if (refreshJson.access_token) {
        accessToken = refreshJson.access_token;

        // Save new token
        await supabase
          .from("gsc_connections")
          .update({
            access_token: accessToken,
            token_expires_at: new Date(Date.now() + refreshJson.expires_in * 1000).toISOString()
          })
          .eq("id", conn.id);
      }
    }

    // 4. Call Google Search Console API
    const gscRes = await fetch(
      "https://www.googleapis.com/webmasters/v3/sites",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!gscRes.ok) {
      const t = await gscRes.text();
      return new Response(
        JSON.stringify({ error: "GSC API error", details: t }),
        { status: 500 }
      );
    }

    const sites = await gscRes.json();

    return new Response(JSON.stringify({ sites }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
