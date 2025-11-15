import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseServer } from "../../supabaseServerClient";

// FIX: Add type declaration for Buffer to resolve missing type definition in a Vercel/non-Node.js TS environment.
declare var Buffer: {
  from(data: string, encoding?: string): {
    toString(encoding?: string): string;
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, state } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing code");
  }
  if (!state || typeof state !== "string") {
    return res.status(400).send("Missing state");
  }

  const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
  const userId = decoded.userId;

  const body = new URLSearchParams({
    code,
    client_id: process.env.GSC_CLIENT_ID!,
    client_secret: process.env.GSC_CLIENT_SECRET!,
    redirect_uri: process.env.GSC_REDIRECT_URI!,
    grant_type: "authorization_code",
  });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenJson = await tokenRes.json();

  if (!tokenJson.access_token) {
    return res.status(500).send("Token exchange failed");
  }

  const expiresAt =
    tokenJson.expires_in
      ? new Date(Date.now() + tokenJson.expires_in * 1000).toISOString()
      : null;

  const { error } = await supabaseServer
    .from("gsc_connections")
    .upsert({
      owner_id: userId,
      access_token: tokenJson.access_token,
      refresh_token: tokenJson.refresh_token || null,
      token_expires: expiresAt,
      gsc_status: "connected",
      state_token: state,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error(error);
    return res.redirect("/?gsc_error=true");
  }

  return res.redirect("/?gsc=connected");
}
