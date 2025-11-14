// FIX: Removed failing reference to "vite/client" and manually defined ImportMetaEnv to resolve type errors.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}