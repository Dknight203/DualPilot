// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
// Supabase Functions run in a Deno environment where 'Deno' is a predefined global.
declare var Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { siteId, token } = await req.json();
    if (!siteId || !token) {
      return new Response(JSON.stringify({ ok: false, error: "Missing siteId or token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "";
    const hostname = origin ? new URL(origin).hostname : null;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing service role credentials");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("cms_connections")
      .select("*")
      .eq("site_id", siteId)
      .eq("verification_token", token)
      .maybeSingle();

    if (error) {
      console.error("Error fetching cms_connections row:", error);
      throw error;
    }

    if (!data) {
      return new Response(
        JSON.stringify({ ok: false, error: "No matching cms connection for site/token" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await supabase
      .from("cms_connections")
      .update({
        verified: true,
        status: "connected",
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (updateError) {
      console.error("Error updating cms_connections row:", updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ ok: true, hostname }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in verify-snippet function:", err);
    return new Response(JSON.stringify({ ok: false, error: err.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
