import { useEffect } from "react"
import InvalidLinkSVG from "../../assets/InvalidLink.svg"
import { useAuthStore } from "../../stores/auth.store"

const InvalidLinkMessage = () => {
    const {authError, setAuthError} = useAuthStore()
      useEffect(()=> {
        if (!authError) return
        const t = setTimeout(()=> {
          setAuthError(null)
        },5000)
        return ()=>{
          clearTimeout(t)
        } 
      },[authError])
          return(<div  className={`border-2 gap-4 rounded-xl bg-white -z-10 absolute top-0 p-4 flex transition duration-150 ease-in ${!authError ? "translate-y-0 bg-transparent text-transparent":"-translate-y-[150%]"}`}>
            <img src={InvalidLinkSVG} className={`${!authError ? "scale-0":" scale-100 bg-red-500/60 rounded-full"}`} />
            <div className="grow">
              {authError ?? null}
            </div>
          </div>
          )
}

export default InvalidLinkMessage