import usePreviewMode from "./usePreviewMode.hooks"

const useInteraction = () => {
    const preview = usePreviewMode()

    return {
        disabled: preview
    }
}

export default useInteraction