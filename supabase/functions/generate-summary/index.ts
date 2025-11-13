// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
// This is a global object provided by the Deno runtime in Supabase Edge Functions.
declare var Deno: any;

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// IMPORTANT: You must import the GoogleGenAI module from esm.sh for it to work in Deno
import { GoogleGenAI } from 'https://esm.sh/@google/genai'

// This function will read the GEMINI_API_KEY from your Supabase Project's Environment Variables
// Go to your Supabase Project > Settings > Functions and add GEMINI_API_KEY
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

// Helper to strip HTML and clean up text
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s\s+/g, ' ')
    .trim();
}

// This is the main function that will be executed when the edge function is invoked
serve(async (req) => {
  // This is needed to handle CORS requests from the browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*', // Or your specific Vercel domain for better security
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }
  
  try {
    const { domain } = await req.json()
    if (!domain) {
      return new Response(JSON.stringify({ error: 'Domain is required' }), {
        status: 400,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }
    
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY environment variable not set in Supabase project settings.")
      return new Response(JSON.stringify({ error: 'The server is not configured correctly.' }), {
        status: 500,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }
    
    // --- Step 1: Fetch website content directly ---
    let websiteText = '';
    try {
        const response = await fetch(`https://${domain}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch domain with status: ${response.status}`);
        }
        const html = await response.text();
        const bodyText = stripHtml(html);
        // Limit to first 8000 characters to be safe with token limits
        websiteText = bodyText.substring(0, 8000); 
    } catch (fetchError) {
        console.error(`Error fetching content for ${domain}:`, fetchError);
        return new Response(JSON.stringify({ error: `Could not retrieve content from ${domain}. Please ensure the domain is correct and accessible.` }), { 
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        });
    }

    // --- Step 2: Generate summary with Gemini using the fetched content ---
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const prompt = `Based on the following text content from the website '${domain}', provide a concise, one-paragraph summary of what the company does. The summary should be suitable for use as an AI profile for SEO purposes. Focus on the company's main products, services, and target audience. Do not mention that you are summarizing provided text. Just provide the summary directly. For example, for 'nike.com', a good summary would be: 'Nike is a global leader in athletic footwear, apparel, equipment, and accessories...'. Here is the website content: "${websiteText}"`;
        
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
    });
    
    const summary = response.text;

    return new Response(JSON.stringify({ summary }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  } catch (error) {
    console.error('Error in Supabase function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }
})