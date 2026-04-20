import { createClient } from '@supabase/supabase-js'

export const supabaseBase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)