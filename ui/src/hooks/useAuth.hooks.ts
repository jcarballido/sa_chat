import { useEffect } from "react"
import { supabase } from "../supabase/client"
import { useAuthStore } from "../stores/auth.store"

export const useAuth = () => {
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
   supabase.auth.getSession().then(({data})=>{
    setSession(data.session)
   }) 
  },[setSession])
}