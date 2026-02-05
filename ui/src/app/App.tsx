import BottomFixedUserComponent from "../features/chat/BottomFixedUserComponent";
import ScrollingContainer from "../features/chat/ScrollingContainer";

export interface FullPageContainerProps {
  children?: React.ReactNode;
}
const App: React.FC<FullPageContainerProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen">
      <aside className="w-1/4 max-w-sm bg-gray-200 p-4 flex flex-col gap-4">
        <div className="bg-fuchsia-700">
          LOGO
        </div>
        <div className="border-2 flex-col ">
          <div>new chat</div>
          <div>search chats</div>
        </div>
        <div className="grow border-4 border-green-400">
          Saved Chats
        </div>
        <BottomFixedUserComponent />
      </aside>
      <main className="flex-1 max-h-full bg-white p-4">
        <ScrollingContainer/>
      </main>
    </div>
  );
}

export default App
