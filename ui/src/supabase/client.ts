import { createClient } from "@supabase/supabase-js";
import { useAuthStore } from "../stores/auth.store";

console.log("Running sb client")
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.getState().setSession(session)
})