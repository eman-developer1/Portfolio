import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-public-key')
);

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (cachedClient) return cachedClient;

  // Use configured credentials or fallback mock URL so client doesn't crash during build/prerender
  const url = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
  const key = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return cachedClient;
};

export const supabase = getSupabaseClient();
