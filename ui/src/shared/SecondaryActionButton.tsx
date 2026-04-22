import type { MouseEventHandler, ReactNode } from "react"

const SecondaryActionButton = ({action,clickHandler, disabled,icon }:{action: string, clickHandler: MouseEventHandler<HTMLButtonElement>,disabled:boolean,icon?: ReactNode}) => {
  return(
    <button className={`transition duration-100 ease-linear rounded-xl hover:bg-gray-700 flex justify-start min-h-11 py-2 px-2 w-full whitespace-nowrap`} onClick={clickHandler} disabled={disabled}>
        {icon && <div className="flex items-center min-w-11 ">{ icon }</div>}
        <div className="flex items-center ">{ action }</div>
    </button>
  )
}

export default SecondaryActionButton
