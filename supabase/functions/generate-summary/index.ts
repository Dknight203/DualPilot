// supabase/functions/generate-summary/index.ts

// Type declaration for the Deno global object
declare var Deno: any;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Strip HTML and clean text
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s\s+/g, " ")
    .trim();
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();
    if (!domain) {
      throw new Error("domain is required");
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("Server configuration is missing the GEMINI_API_KEY.");
    }

    // Fetch website content with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    let websiteText = "";

    try {
      const response = await fetch(`https://${domain}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Could not access ${domain}. The site returned a status of ${response.status}.`
        );
      }

      const html = await response.text();
      websiteText = stripHtml(html).substring(0, 8000);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === "AbortError") {
        throw new Error(`The website at ${domain} was too slow to respond.`);
      }
      throw new Error(
        `Could not fetch content from ${domain}. Please ensure it is a live, public website.`
      );
    }

    // Call Gemini HTTP API directly
    const prompt = `Based on the following text content from the website '${domain}', provide a concise, factual, one paragraph summary of what the company does. Content: "${websiteText}"`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorJson = await geminiResponse.json().catch(() => null);
      const message =
        errorJson?.error?.message ||
        `Gemini API returned status ${geminiResponse.status}.`;
      throw new Error(message);
    }

    const geminiJson = await geminiResponse.json();

    const summary =
      geminiJson?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join(" ")
        .trim() || "";

    if (!summary) {
      throw new Error(
        "The AI could not generate a summary based on the website content."
      );
    }

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in generate-summary function:", error);
    return new Response(
      JSON.stringify({
        error: error?.message || "Unknown error while generating summary.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
