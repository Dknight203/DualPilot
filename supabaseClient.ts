import { createClient } from '@supabase/supabase-js';

// FIX: Cast `import.meta` to `any` to resolve TypeScript error when accessing `env`.
// This is a workaround for environments where Vite's client types for `import.meta.env` are not configured.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing from environment variables. The application will not be able to connect to the backend.");
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;