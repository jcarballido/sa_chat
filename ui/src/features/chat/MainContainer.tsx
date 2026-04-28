import ScrollingContainer from "./ScrollingContainer"

const MainContainer = () => {
  
  // const { session } = useAuthStore()
  // if(!session){
  //   return (
  //     <main className="flex-1 h-full min-w-0 flex justify-center ${colorMap.bgSecondary} bg-[#eaeaea]">
  //       {/* <ScrollingContainer/> */}
  //       FAKE DATA
  //       <ScrollingContainer />
  //     </main>      
  //   )
  // }
  return (
    <main className="flex-1 h-full min-w-0 flex justify-center ${colorMap.bgSecondary} bg-[#eaeaea] ">
      <ScrollingContainer/>
    </main>
  )
}
export default MainContainer