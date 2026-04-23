import type { MouseEventHandler } from "react"
import FailedSendSVG from "../../assets/errorSending.svg"

type FailedMagicLinkRequests = {
    email: string,
    resetModal: MouseEventHandler
}

const FailedMagicLinkRequests = ({email, resetModal}: FailedMagicLinkRequests) => {
    return (
        <div className="absolute border-4 flex w-full h-full justify-center items-center backdrop-blur-xs backdrop-grayscale-50 z-10">
        <div className="border bg-white border-black/30 aspect-square shadow-2xl rounded-xl p-8 flex flex-col justify-center items-center gap-y-6">
            <div className="flex flex-col items-center justify-center gap-10">
            <img src={FailedSendSVG} className="h-12 rounded-full bg-red-500/50 p-1"/>
            <div className="flex flex-col items-center">
                <div className="font-bold">Error attempting to submit your request for a magic link</div>
                <div className="font-bold p-2">
                {email}
            </div>
            </div>
            <button className="border min-h-11 px-2 rounded-xl hover:bg-gray-300 font-semibold w-full" onClick={resetModal}>
                Use a different email
            </button>
            </div>
        </div>
        </div>
    )
}

export default FailedMagicLinkRequests