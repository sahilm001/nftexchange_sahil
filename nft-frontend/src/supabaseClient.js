import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.");
}

// If variables are missing, provide a dummy object so the app doesn't crash on load
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: (callback) => {
                return { data: { subscription: { unsubscribe: () => {} } } };
            },
            signInWithPassword: async () => ({ data: null, error: new Error("Supabase is not configured. Please check environment variables (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY).") }),
            signUp: async () => ({ data: null, error: new Error("Supabase is not configured. Please check environment variables.") }),
            resetPasswordForEmail: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
            signInWithOAuth: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
            signOut: async () => ({ error: null })
        }
    };
