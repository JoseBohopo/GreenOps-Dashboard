'use client';
import Link from "next/link";
import { useSidebar } from "../../store/useSidebar";

export const Sidebar: React.FC = () => {
  const { isOpen, toggleSideBar } = useSidebar();
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        bg-gray-800 text-white w-full lg:w-64 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col h-screen
      `}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">GreenOps</h2>
        <button
          onClick={toggleSideBar}
          className="lg:hidden p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto" aria-label="Menú principal">
        <ul className="space-y-2">
          <li>
            <Link href="/import"
              className="w-full text-left p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-current="page"
            >
              Import
            </Link>
          </li>
          <li>
            <Link href="#"
              className="w-full text-left p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-current="page"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="#"
              className="w-full text-left p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Metrics
            </Link>
          </li>
          <li>
            <Link href="#"
              className="w-full text-left p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
