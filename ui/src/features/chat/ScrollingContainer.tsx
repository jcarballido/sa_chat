import React from 'react';
import TextInputContainer from './TextInputContainer';

type ScrollingContainerProps = {
  children?: React.ReactNode;
};

const ScrollingContainer: React.FC<ScrollingContainerProps> = ({ children}) => (
  <div className="flex flex-col h-full border-2 border-black">
    <div className="flex-1 overflow-y-auto">
      {children}
    </div>
    
    <div className="sticky bottom-0 bg-white shadow">
      <TextInputContainer />
    </div>
  </div>
);

export default ScrollingContainer;