import { createClient } from '@supabase/supabase-js';

// Vercel's build environment can be inconsistent with Vite.
// This checks the Vite-standard `import.meta.env` first, then falls back to the more general `process.env`.
// This ensures that no matter how Vercel injects the variables during the build, we will find them.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase URL or Anon Key is missing. The application cannot connect to the backend. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in the deployment environment.");
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;