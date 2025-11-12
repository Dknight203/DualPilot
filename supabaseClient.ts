import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cuuzvvgrriyhvilfcyaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1dXp2dmdycml5aHZpbGZjeWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjU2NTgsImV4cCI6MjA3ODU0MTY1OH0.M5Rax7QZJqiiKhNthdEEYqwbitgu-ST1BbGSmzZyCps';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. The application will not be able to connect to the backend.");
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;