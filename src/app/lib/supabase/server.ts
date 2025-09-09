import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || (!anonKey && !serviceRoleKey)) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL and Supabase key (anon or service role)'
    );
  }

  const apiKey = serviceRoleKey || (anonKey as string);

  cachedClient = createClient(url, apiKey, {
    auth: { persistSession: false },
  });

  return cachedClient;
}
