// supabase/functions/gsc-list-sites/index.ts

// Type declaration for the Deno global object
declare var Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleAuth } from "https://esm.sh/google-auth-library@9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clientEmail = Deno.env.get("GSC_CLIENT_EMAIL");
    const privateKey = Deno.env.get("GSC_PRIVATE_KEY");
    if (!clientEmail || !privateKey) {
      throw new Error("Missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY");
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    const client = await auth.getClient();
    const url = "https://searchconsole.googleapis.com/webmasters/v3/sites";

    const res = await client.request({ url });
    const sites = (res.data.siteEntry || []).map((s: any) => s.siteUrl);

    return new Response(JSON.stringify({ sites }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in gsc-list-sites:", err);
    return new Response(JSON.stringify({ error: err.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
