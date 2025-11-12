import { createClient } from '@supabase/supabase-js';

// In a Vite project, environment variables are exposed on the `import.meta.env` object.
// This is the correct way to access them in client-side code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase URL or Anon Key is missing. The application cannot connect to the backend. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in the deployment environment.");
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;