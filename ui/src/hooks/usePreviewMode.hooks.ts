import { useAuthStore } from "../stores/auth.store"

const usePreviewMode = () => {

    const session = useAuthStore(s => s.session)

    return !session
}

export default usePreviewMode