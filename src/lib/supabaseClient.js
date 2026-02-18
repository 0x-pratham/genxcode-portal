import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file.\n" +
    "Required variables:\n" +
    "  - VITE_SUPABASE_URL\n" +
    "  - VITE_SUPABASE_ANON_KEY\n\n" +
    "Create a .env file in the root directory with these variables."
  );
}

// Create Supabase client with error handling
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => supabase !== null;

export const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
    );
  }
};
