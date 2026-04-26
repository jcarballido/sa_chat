import { createClient } from "@supabase/supabase-js";
import { useAuthStore } from "../stores/auth.store";

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

supabase.auth.onAuthStateChange((event, session) => {
  if(session) useAuthStore.getState().setSession(session)
})

const hash = window.location.hash
if (hash && hash.includes('error')) {
  const params = new URLSearchParams(hash.substring(1))
  const description = params.get('error_description') ?? "unknown"
  if(description == "Email link is invalid or has expired") useAuthStore.getState().setAuthError("The link is invalid or expired. Try again.")

  useAuthStore.getState().setAuthError("Something went wrong. Try again.")

  window.history.replaceState(null,"",window.location.pathname)
}

