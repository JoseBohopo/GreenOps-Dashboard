'use client';
import React from 'react'
import { useSidebar } from '../../store/useSidebar';

export const Header: React.FC = () => {
  const { toggleSideBar } = useSidebar();
  return (
        <header 
          className="shrink-0 bg-white shadow-md px-4 py-3 sm:py-4 border-b border-gray-200"
          role="banner"
        >
          <div className="flex items-center justify-between">
          <button
            onClick={toggleSideBar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
           🌱 GreenOps Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600" aria-label="Current user">
            User
            </span>
          </div>
          </div>
        </header>
  )
}
