import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_API_KEYS || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_API_KEYS.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storageKey: 'smartbus-auth',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
