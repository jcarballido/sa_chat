import { colorMap } from "../../constants/colorTheme.constants"
import ScrollingContainer from "./ScrollingContainer"
import InputForm from './InputForm';


const MainContainer = () => {

  return (
    <main className={`flex-1  h-full w-full min-w-0 flex justify-center ${colorMap.bgSecondary2}`}>
      <div className="h-full w-[70%] overflow-hidden flex flex-col items-center gap-6">
        <ScrollingContainer/>
        <div className='flex flex-col justify-center items-center w-full'>
          <InputForm />    
        </div>
      </div>
    </main>
  )
}
export default MainContainer