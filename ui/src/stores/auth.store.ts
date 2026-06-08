import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthState = {
  loading: boolean,
  setLoading: (authenticated: boolean) => void,
  session: Session | null,
  setSession: (session: Session | null) => void
  user: User | null,
  setUser: ( user: User ) => void,
  initialized: boolean,
  setInitialized: (inited: boolean) => void,
  authError:string | null,
  setAuthError: (description: string | null) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  loading: true,
  setLoading: (isAuthenticated: boolean) => set({loading: !isAuthenticated}),
  session: null,
  user:null,
  setSession:(session)=> set({session, user: session?.user ?? null}),
  setUser: (user) => set({user}),
  initialized:false,
  setInitialized: (inited) => set({initialized:inited}),
  authError:null,
  setAuthError:(description)=> set({authError: description})
}))

