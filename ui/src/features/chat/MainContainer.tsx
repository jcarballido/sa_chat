import { useAuthStore } from "../../stores/auth.store"
import ScrollingContainer from "./ScrollingContainer"

const MainContainer = () => {
  
  const { isAuthenticated } = useAuthStore()
  if(!isAuthenticated){
    return (
      <main className="flex-1 h-full min-w-0 flex justify-center ${colorMap.bgSecondary} bg-stone-100">
        {/* <ScrollingContainer/> */}
        FAKE DATA
        <ScrollingContainer />
      </main>      
    )
  }
  return (
    <main className="flex-1 h-full min-w-0 flex justify-center ${colorMap.bgSecondary} bg-stone-100">
      <ScrollingContainer/>
    </main>
  )
}
export default MainContainer