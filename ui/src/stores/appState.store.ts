import { create } from "zustand";

type AppState = {
  status: "loading" | "authenticated" | "unauthenticated",
  setStatus: (status: AppState["status"]) => void
}

export const useAppStateStore = create<AppState>()((set) => ({
  status: "loading",
  setStatus: (status: AppState["status"]) => set({status})
}))