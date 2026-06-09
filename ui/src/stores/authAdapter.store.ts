import { useAuthStore } from "./auth.store.ts"

export function getAccessToken(){
    return useAuthStore.getState().authStatus.session?.access_token ?? null
}