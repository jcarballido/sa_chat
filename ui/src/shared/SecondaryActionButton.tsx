import type { MouseEventHandler, ReactNode } from "react"

const SecondaryActionButton = ({action,clickHandler, icon }:{action: string, clickHandler: MouseEventHandler<HTMLButtonElement>,icon?: ReactNode}) => {
  return(
    <button className={`transition duration-100 ease-linear rounded-xl hover:bg-gray-700 flex justify-start gap-4 min-h-11 py-2 px-2 w-full`} onClick={clickHandler}>
        {icon && <div className="flex items-center ">{ icon }</div>}
        <div className=" flex items-center">{ action }</div>
    </button>
  )
}

export default SecondaryActionButton
