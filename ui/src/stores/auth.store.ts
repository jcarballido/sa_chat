import { create } from "zustand";

type State = {
  isAuthenticated: boolean
}

type Action = {
  setAuthentication: (authenticated: boolean) => void,
  logOut: () => void
}

export const useAuthStore = create<State & Action>()((set) => ({
  isAuthenticated:false,
  setAuthentication:(authenticated)=> set(() => ({isAuthenticated: authenticated})),
  logOut: ()=>set({isAuthenticated: false})
}))

