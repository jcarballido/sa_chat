import React from 'react';

interface BottomFixedUserComponentProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const BottomFixedUserComponent: React.FC<BottomFixedUserComponentProps> = ({ children, style }) => {
  return (
    <div className="p-4 shadow-lg flex justify-start items-center gap-6" style={style}>
      <div className='aspect-square h-8 rounded-full bg-amber-400 whitespace-nowrap ' />
      <div className='whitespace-nowrap'>
        F Name L Name
      </div>
    </div>
  );
};

export default BottomFixedUserComponent;