import ScrollingContainer from "../features/chat/ScrollingContainer";

export interface FullPageContainerProps {
  children: React.ReactNode;
}
const App: React.FC<FullPageContainerProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen">
      <aside className="w-1/4 max-w-sm bg-gray-200 p-4">{children}</aside>
      <main className="flex-1 max-h-full bg-white p-4">
        <ScrollingContainer/>
      </main>
    </div>
  );
}

export default App
