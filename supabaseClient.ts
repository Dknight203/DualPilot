import { createClient } from '@supabase/supabase-js';

// The VITE_ variables are injected by Vercel during the build process.
// We provide the actual keys as a fallback, which will be used in this preview environment.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jnsjcybovsgygcyflxtz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impuc2pjeWJvdnNneWdjeWZseHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg0MDk5ODgsImV4cCI6MjAxMzk4NTk4OH0.94SEd_0s524J_2-Py1fL5r_h_M-p--gQdEl3d3f_0uA';

// Always create a client. The application expects a client object to exist.
// If the keys are invalid, subsequent API calls will fail, but the app itself will not crash on load.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
