import React from 'react';

interface BottomFixedUserComponentProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const BottomFixedUserComponent: React.FC<BottomFixedUserComponentProps> = ({ children, style }) => {
  return (
    <div className="shadow-lg flex justify-start  gap-2" style={style}>
      <div className='aspect-square h-8 rounded-full bg-amber-400  ' />
      <div className='whitespace-nowrap flex items-center justify-start'>
        F. LName
      </div>
    </div>
  );
};

export default BottomFixedUserComponent;