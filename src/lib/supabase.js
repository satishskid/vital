import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.REACT_APP_SUPABASE_URL || 'https://ynkopftbulnofawqnffo.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlua29wZnRidWxub2Zhd3FuZmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODQ4ODcsImV4cCI6MjA2ODE2MDg4N30.ujePSUTmqFDRuTwPF8zlW0HI4MF21_SrJqFrc15b3vs'

// Check if we have valid Supabase credentials
const isValidConfig = SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('<PROJECT-ID>');

if (!isValidConfig) {
  console.warn('Missing Supabase variables. Please check your environment configuration.');
} else {
  console.log('✅ Supabase configured successfully');
}

// Create a mock client for development when Supabase isn't configured
const mockSupabaseClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null })
  })
};

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export default for backward compatibility
export default supabase;