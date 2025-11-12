import { createClient } from '@supabase/supabase-js';

// FIX: Use `process.env` to access environment variables, resolving a TypeScript error
// with `import.meta.env` and aligning with project conventions.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing from environment variables. The application will not be able to connect to the backend.");
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;