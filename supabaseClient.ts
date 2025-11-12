import { createClient } from '@supabase/supabase-js';

// FIX: Switched from 'import.meta.env' to 'process.env' to resolve TypeScript errors. This is a more standard way to access environment variables in many frontend build tools.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing from environment variables. The application will not be able to connect to the backend.");
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
