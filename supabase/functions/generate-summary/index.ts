// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
// This is a global object provided by the Deno runtime in Supabase Edge Functions.
declare var Deno: any;

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// IMPORTANT: You must import the GoogleGenAI module from esm.sh for it to work in Deno
import { GoogleGenAI } from 'https://esm.sh/@google/genai'

// --- CORS HEADERS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Helper to strip HTML and clean up text
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s\s+/g, ' ')
    .trim();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const { domain } = await req.json();
    if (!domain) {
      throw new Error('domain is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Server configuration is missing the GEMINI_API_KEY.');
    }
    
    // Fail-fast timeout for fetching the user's website to avoid hitting platform limits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5 second timeout

    let websiteText = '';
    try {
      const response = await fetch(`https://${domain}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Could not access ${domain}. The site returned a status of ${response.status}.`);
      }
      const html = await response.text();
      websiteText = stripHtml(html).substring(0, 8000); // Truncate to a reasonable size for the AI
    } catch (fetchError) {
      clearTimeout(timeoutId); // Ensure timeout is cleared on other errors too
      if (fetchError.name === 'AbortError') {
        throw new Error(`The website at ${domain} was too slow to respond.`);
      }
      throw new Error(`Could not fetch content from ${domain}. Please ensure it's a live, public website.`);
    }

    // Generate summary with Gemini
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = `Based on the following text content from the website '${domain}', provide a concise, factual, one-paragraph summary of what the company does. Content: "${websiteText}"`;
    
    const genAIResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a website analysis expert. Your sole function is to analyze the provided text from a website and provide a concise, factual summary of that company's business. It is critical that you do not mention or describe the tool you are part of. Your summary must be strictly about the external website content provided."
      }
    });
    
    const summary = genAIResponse.text;

    if (!summary) {
      throw new Error("The AI could not generate a summary based on the website's content.");
    }

    // Return a success response with the summary
    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`Error in generate-summary function:`, error.message);
    // Return an error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});