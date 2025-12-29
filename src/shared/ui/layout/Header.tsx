export function Header() {
  return (
    <header className="bg-white shadow-md p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">GreenOps Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Usuario</span>
        </div>
      </div>
    </header>
  );
}