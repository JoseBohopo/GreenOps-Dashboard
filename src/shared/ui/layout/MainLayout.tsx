'use client';
import React, { useState } from 'react'
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  return (
    <div className='flex flex-col overflow-hidden'>
      <Header />
      <div className='flex h-screen flex-1 relative overflow-hidden'>

       <Sidebar />
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
