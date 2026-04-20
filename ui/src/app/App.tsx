import Aside from "../features/chat/Aside";
import LoginModal from "../features/chat/LoginModal";
import MainContainer from "../features/chat/MainContainer";
import { useAuthStore } from "../stores/auth.store";

const App = () => {

  const { isAuthenticated } = useAuthStore()

  return (
    <div className="flex h-screen w-screen relative">
      {
        !isAuthenticated
        ? <LoginModal />
        : null
      }
      <Aside />
      <MainContainer />
    </div>
  );
}

export default App
