// in utils/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// Import the 'Database' type from your generated file
import { Database } from '../types_db' // We use '../' to go up one directory from 'utils' to the root

// It's crucial that these environment variables are set.
// In a Next.js app, they should be in a file named .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Supabase Anon Key is not defined in .env.local");
}

// Create and export the Supabase client, passing in the 'Database' type
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)