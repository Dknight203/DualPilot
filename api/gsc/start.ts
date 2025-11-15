import type { VercelRequest, VercelResponse } from "@vercel/node";

// FIX: Add type declaration for Buffer to resolve missing type definition in a Vercel/non-Node.js TS environment.
declare var Buffer: {
  from(data: string, encoding?: string): {
    toString(encoding?: string): string;
  };
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing userId" });
  }

  const state = Buffer.from(JSON.stringify({ userId })).toString("base64url");

  const params = new URLSearchParams({
    client_id: process.env.GSC_CLIENT_ID!,
    redirect_uri: process.env.GSC_REDIRECT_URI!,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/webmasters",
    access_type: "offline",
    include_granted_scopes: "true",
    state,
  });

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  res.writeHead(302, { Location: googleUrl });
  res.end();
}
