import React, { useState, type MouseEventHandler } from 'react';
import LogoutSVG from '../../assets/logout.svg'
import { supabase } from '../../supabase/client';

interface BottomFixedUserComponentProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const BottomFixedUserComponent: React.FC<BottomFixedUserComponentProps> = ({ children, style }) => {
  const [ showSlide, setShowSlide ] = useState(false)

  const handleSignOut: MouseEventHandler = async (e) => {
    e.preventDefault()
    const {error} = await supabase.auth.signOut()
    if(error){
      console.log("ERROR DURING SIGN OUT")
      console.log(error)
    }
  }

  return (
    <div className="shadow-lg flex justify-start gap-2 relative" style={style}>
      <button className={`w-full p-2 bg-gray-400 rounded-xl absolute flex gap-2 -translate-y-[120%] origin-bottom transition duration-150 ease-in ${showSlide ? "scale-y-100":"scale-y-0"} `} onClick={handleSignOut}>
        <img src={LogoutSVG} className={`transition delay-150 ease-in ${showSlide ? "text-white":"text-transparent"}`}/>
        <div className={`transition delay-150 ease-in ${showSlide ? "text-white":"text-transparent"} font-semibold`}>Sign Out</div>
      </button>
      <div className='aspect-square h-8 rounded-full bg-amber-400  ' />
      <div className={`whitespace-nowrap flex items-center justify-start `} onClick={()=>setShowSlide(!showSlide)}>
        F. LName
      </div>
    </div>
  );
};

export default BottomFixedUserComponent;