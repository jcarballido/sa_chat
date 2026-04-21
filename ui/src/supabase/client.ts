import { createClient } from "@supabase/supabase-js";
import { useAuthStore } from "../stores/auth.store";

console.log("Running sb client")
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'implicit',
      detectSessionInUrl: true,
    }
  }
)

console.log("URL at client init:", window.location.href)
console.log("Hash at client init:", window.location.hash)

const hash = window.location.hash
if (hash && hash.includes('access_token')) {
  const params = new URLSearchParams(hash.substring(1))
  const { data, error } = await supabase.auth.setSession({
    access_token: params.get('access_token')!,
    refresh_token: params.get('refresh_token')!,
  })
  console.log('manual session set:', data)
  console.log('error:', error)
}

supabase.auth.onAuthStateChange((event, session) => {
  console.log("---")
  console.log("Session receieved from supabase listener.")
  console.log(session)
  console.log("Event receieved from supabase listener.")
  console.log(event)
  console.log("---")
  useAuthStore.getState().setSession(session)
})