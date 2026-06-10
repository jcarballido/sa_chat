import { colorMap } from "../constants/colorTheme.constants"

const SplashScreen = ({isLeaving}: {isLeaving: boolean}) => {
  // const [isLeaving, setIsLeaving] = useState(false)

  return (
    <div  className={`w-screen h-screen flex flex-col justify-center items-center absolute z-10 transition duration-300 ease-in  ${isLeaving && "opacity-0 scale-95"} bg-[#F7F4EF] `}>
      <div className={`absolute w-[60%] h-1/2 z-10 flex flex-col justify-center items-center gap-6`}>
        <div className={`flex flex-col justify-center items-center gap-6`}>
          <div className="relative w-1/2 aspect-square">
            <div className={`absolute w-full aspect-square ${colorMap.accent} z-10`}/>
            <div className={`absolute w-full aspect-square ${colorMap.accent} animate-ping z-0`}/>
          </div>
          <div className="text-4xl">
            sa_chat
          </div>
        </div>
        <div className="text-gray-600 italic flex justify-center items-center max-w-sm text-pretty text-center border-pink-300">
          Your own assistant — instantly locate answers across the company knowledge base.
        </div>
      </div>
    </div>
  )
}

export default SplashScreen