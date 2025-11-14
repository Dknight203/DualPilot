// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
// Supabase Functions run in a Deno environment where 'Deno' is a predefined global.
declare var Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const errorHtml = `
  <!DOCTYPE html><html><head><title>Error</title></head>
  <body><p>Authentication failed. You can close this window.</p></body></html>
`;

const successHtml = `
  <!DOCTYPE html><html><head><title>Success</title></head>
  <body><p>Authentication successful! You can close this window.</p>
  <script>
    if (window.opener) {
      window.opener.postMessage('gsc-connected', '*');
    }
    window.close();
  </script>
  </body></html>
`;

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
      return new Response(errorHtml, { status: 400, headers: { 'Content-Type': 'text/html' } });
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? '',
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
    );

    // Find the pending connection using the state token
    const { data: connection, error: selectError } = await supabaseAdmin
      .from('gsc_connections')
      .select('*')
      .eq('state_token', state)
      .single();

    if (selectError || !connection) {
      console.error("No matching state token found:", selectError);
      return new Response(errorHtml, { status: 404, headers: { 'Content-Type': 'text/html' } });
    }

    // Exchange the code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: Deno.env.get('GSC_CLIENT_ID')!,
        client_secret: Deno.env.get('GSC_CLIENT_SECRET')!,
        redirect_uri: Deno.env.get('GSC_REDIRECT_URI')!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error("Google token exchange failed:", errorBody);
      throw new Error('Token exchange failed');
    }

    const tokens = await tokenResponse.json();
    
    const tokenUpdate = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || connection.refresh_token, // Keep old refresh token if new one isn't provided
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      gsc_status: 'connected',
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseAdmin
      .from('gsc_connections')
      .update(tokenUpdate)
      .eq('id', connection.id);

    if (updateError) {
      console.error("Error updating GSC connection:", updateError);
      throw updateError;
    }

    return new Response(successHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error("Error in GSC callback function:", error);
    return new Response(errorHtml, { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
});