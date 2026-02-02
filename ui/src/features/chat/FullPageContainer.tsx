import React from 'react';

export interface FullPageContainerProps {
  children?: React.ReactNode;
}

const FullPageContainer: React.FC<FullPageContainerProps> = ({ children }) => (
  <div className="flex h-screen w-screen">
    <aside className="w-1/4 max-w-sm bg-gray-200 p-4">{children}</aside>
    <main className="flex-1 max-h-full bg-white">{children}</main>
  </div>
);

export default FullPageContainer;