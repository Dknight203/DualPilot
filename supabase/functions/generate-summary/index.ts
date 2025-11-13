// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
// This is a global object provided by the Deno runtime in Supabase Edge Functions.
declare var Deno: any;

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
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
  
  let siteId = '';
  try {
    const { site_id } = await req.json();
    siteId = site_id;

    if (!siteId) {
      throw new Error('site_id is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Server configuration is missing required environment variables.');
    }
    
    // Create a Supabase client with the service role key to perform admin actions
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Get the domain from the sites table
    const { data: siteData, error: fetchError } = await supabaseAdmin
      .from('sites')
      .select('domain')
      .eq('id', siteId)
      .single();

    if (fetchError || !siteData) {
        throw new Error(`Could not find site with ID ${siteId}.`);
    }
    const domain = siteData.domain;

    // 2. Fetch website content
    const response = await fetch(`https://${domain}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${domain}. Status: ${response.status}`);
    }
    const html = await response.text();
    const websiteText = stripHtml(html).substring(0, 8000);

    // 3. Generate summary with Gemini
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = `Based on the following text content from the website '${domain}', provide a concise, one-paragraph summary of what the company does... Here is the content: "${websiteText}"`;
    
    const genAIResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
    });
    
    const summary = genAIResponse.text;

    // 4. Update the site record with the summary and status
    const { error: updateError } = await supabaseAdmin
      .from('sites')
      .update({ site_profile: summary, site_profile_status: 'completed' })
      .eq('id', siteId);
    
    if (updateError) {
      throw new Error(`Failed to update site record: ${updateError.message}`);
    }

    // Return a success response (the client is not waiting for this, but it's good practice)
    return new Response(JSON.stringify({ success: true, siteId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`Error in function for siteId ${siteId}:`, error.message);

    // If something fails, update the status to 'failed' so the UI can stop polling
    if (siteId) {
        try {
            const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
            const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
            if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
                 const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
                 await supabaseAdmin
                    .from('sites')
                    .update({ site_profile_status: 'failed', site_profile: error.message })
                    .eq('id', siteId);
            }
        } catch (updateErr) {
            console.error('Failed to even update status to failed:', updateErr);
        }
    }

    // Return an error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});