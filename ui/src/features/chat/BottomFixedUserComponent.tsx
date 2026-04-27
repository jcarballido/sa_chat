import { useState, type MouseEventHandler } from 'react';
import LogoutSVG from '../../assets/logout.svg'
import { supabase } from '../../supabase/client';
import { useAuthStore } from '../../stores/auth.store';

interface BottomFixedUserComponentProps {
  style?: React.CSSProperties;
}

const BottomFixedUserComponent = ({ style }: BottomFixedUserComponentProps) => {
  const [ showSlide, setShowSlide ] = useState(false)
  const { user } = useAuthStore()

  const handleSignOut: MouseEventHandler = async (e) => {
    e.preventDefault()
    const {error} = await supabase.auth.signOut()
    if(error){
      console.log("ERROR DURING SIGN OUT")
      console.log(error)
    }
  }

  const id = user?.email!.replace(/(@gmail.com)/,"")
  const firstLetter = id?.charAt(0).toUpperCase()

  return (
    <div className="shadow-lg flex justify-start items-center gap-2 relative" style={style}>
      <button className={`w-full p-2 bg-gray-400 rounded-xl absolute flex gap-2 -translate-y-[120%] origin-bottom transition duration-150 ease-in ${showSlide ? "scale-y-100":"scale-y-0"} `} onClick={handleSignOut}>
        <img src={LogoutSVG} className={`transition delay-150 ease-in ${showSlide ? "text-white":"text-transparent"}`}/>
        <div className={`transition delay-150 ease-in ${showSlide ? "text-white":"text-transparent"} font-semibold`}>Sign Out</div>
      </button>
      <div className='aspect-square h-8 rounded-full bg-blue-500 flex justify-center items-center font-extrabold text-xl  '>
        {firstLetter}
      </div>
      <div className={`whitespace-nowrap flex items-center justify-start p-2`} onClick={()=>setShowSlide(!showSlide)}>
        {id}
      </div>
    </div>
  );
};

export default BottomFixedUserComponent;