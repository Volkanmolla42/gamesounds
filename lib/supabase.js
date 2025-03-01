import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase URL and ANON_KEY
// These values should be obtained when you create a Supabase project
// They should be read from the .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
