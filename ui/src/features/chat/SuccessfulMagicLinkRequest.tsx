import type { MouseEventHandler } from "react"
import SentSVG from "../../assets/sent.svg"

type SuccessfulMagicLinkRequest = {
    email: string,
    resetModal: MouseEventHandler
}

const SuccessfulMagicLinkRequest = ({email, resetModal}: SuccessfulMagicLinkRequest) => {
    return(
      <div className="absolute border-4 flex w-full h-full justify-center items-center backdrop-blur-xs backdrop-grayscale-50 z-10">
        <div className="border border-black/30 bg-white aspect-square shadow-2xl rounded-xl p-8 flex flex-col justify-center items-center gap-y-6">
            <div className="flex flex-col items-center justify-center gap-10">
            <img src={SentSVG} className="h-12 rounded-full bg-green-500/50 p-1"/>
            <div className="flex flex-col items-center">
                <div className="font-bold">Check your inbox</div>
                <div className="text-gray-500">If registered, a magic link was sent to</div>
                <div className="font-bold p-2">
                {email}
            </div>
            </div>
            <button className="border min-h-11 px-2 rounded-xl transition duration-150 ease-out bg-gray-300 hover:bg-gray-200 font-semibold w-full" onClick={resetModal}>
                Use a different email
            </button>
            </div>
            </div>
        </div>
    )
}

export default SuccessfulMagicLinkRequest