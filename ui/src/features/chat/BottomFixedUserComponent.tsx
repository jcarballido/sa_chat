import React from 'react';

interface BottomFixedUserComponentProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const BottomFixedUserComponent: React.FC<BottomFixedUserComponentProps> = ({ children, style }) => {
  return (
    <div className=" border-2 border-blue-500 max-w-full bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-start items-center gap-6" style={style}>
      <div className='w-8 h-8 rounded-full bg-amber-400' />
      <div>
        F Name L Name
      </div>
    </div>
  );
};

export default BottomFixedUserComponent;