import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type State = {
  authStatus: {status: "authenticated", session: Session, user: User } | {status: "unauthenticated" | "loading" ,session: null, user: null },
  // loading: boolean,
  // session: Session | null,
  // user: User | null,
  // initialized: boolean,
  authError:string | null,
}

type Action = {
  setAuthStatus: (authStatus: State["authStatus"]) => void
  // setLoading: (authenticated: boolean) => void,
  // setSession: (session: Session | null) => void
  // setUser: ( user: User ) => void,
  // setInitialized: (inited: boolean) => void,
  setAuthError: (description: string | null) => void  
}

export const useAuthStore = create<State & Action>()((set) => ({
  authStatus: {status: "loading", session: null, user: null},
  setAuthStatus: (authStatus) => set({authStatus}),
  // loading: true,
  // setLoading: (isAuthenticated: boolean) => set({loading: !isAuthenticated}),
  // session: null,
  // user:null,
  // setSession:(session)=> set({session, user: session?.user ?? null}),
  // setUser: (user) => set({user}),
  // initialized:false,
  // setInitialized: (inited) => set({initialized:inited}),
  authError:null,
  setAuthError:(description)=> set({authError: description})
}))

