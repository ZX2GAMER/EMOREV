interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_PRODUCT_BUCKET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}