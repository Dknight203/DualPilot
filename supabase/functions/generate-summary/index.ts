// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
// This is a global object provided by the Deno runtime in Supabase Edge Functions.
declare var Deno: any;

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// IMPORTANT: You must import the GoogleGenAI module from esm.sh for it to work in Deno
import { GoogleGenAI } from 'https://esm.sh/@google/genai'

// This function will read the GEMINI_API_KEY from your Supabase Project's Environment Variables
// Go to your Supabase Project > Settings > Functions and add GEMINI_API_KEY
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

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
    const { prompt } = await req.json()
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
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

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "You are a website analysis expert. Your sole function is to analyze a given website domain and provide a concise, factual summary of the company's business. Do not mention yourself, AI, or the tool you are a part of. Focus only on the external website provided in the prompt.",
          tools: [{googleSearch: {}}],
        },
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