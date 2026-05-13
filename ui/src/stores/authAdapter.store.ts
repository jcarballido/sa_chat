import { useAuthStore } from "./auth.store.ts"

export function getAccessToken(){
    return useAuthStore.getState().session?.access_token ?? null
}