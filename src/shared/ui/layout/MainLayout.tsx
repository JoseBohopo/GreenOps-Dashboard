'use client';
import React, { useState } from 'react'
import { Sidebar } from './Sidebar';
import { Header } from './Header';
interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => setIsSideBarOpen((prev) => !prev);
  return (
    <div className='flex flex-col overflow-hidden'>
      <Header onMenuClick={toggleSideBar} />
      <div className='flex h-screen flex-1 relative overflow-hidden'>

       <Sidebar isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />
        <main 
          className='flex-1 overflow-auto p-6 bg-gray-50'
          role="main"
          aria-label="Main content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
