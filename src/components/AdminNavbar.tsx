import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Database, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/students', label: 'Data Siswa', icon: <Users size={18} /> },
    { path: '/admin/settings', label: 'Pengaturan', icon: <Settings size={18} /> },
    { path: '/admin/backup', label: 'Backup & Restore', icon: <Database size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/admin" className="font-bold text-xl text-blue-700">
          Admin Panel
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md flex items-center space-x-1 ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={logout}
            className="flex items-center text-red-600 hover:text-red-800 px-3 py-2"
          >
            <LogOut size={18} className="mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="container mx-auto flex justify-between">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 text-center py-2 ${
                isActive(item.path)
                  ? 'border-b-2 border-blue-700 text-blue-700'
                  : 'text-gray-600'
              }`}
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
