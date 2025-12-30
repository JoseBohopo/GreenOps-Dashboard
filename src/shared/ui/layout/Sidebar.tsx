import React from 'react'

export const Sidebar = () => {
  return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">GreenOps</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            Dashboard
          </li>
          <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            Métricas
          </li>
          <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
            Configuración
          </li>
        </ul>
      </nav>
    </aside>
  )
}
