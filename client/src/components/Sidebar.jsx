import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, Repeat, BarChart3, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Budget', path: '/budget', icon: Wallet },
  { name: 'Recurring', path: '/recurring', icon: Repeat },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { darkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="h-screen w-64 hidden md:flex flex-col justify-between fixed left-0 top-0
        bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800 p-4 z-40">
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-blue flex items-center justify-center font-bold text-white">
                E
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Expensso</span>
            </div>
            <NotificationBell align="left" />
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-orange/10 text-orange-dark dark:text-orange'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`
                }
              >
                <Icon size={18} />
                {name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4
        bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange to-blue flex items-center justify-center font-bold text-white text-sm">
            E
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Expensso</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around
        bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 pt-2 pb-2">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors
              ${isActive
                ? 'text-orange'
                : 'text-gray-400 dark:text-gray-500'}`
            }
          >
            <Icon size={20} />
            {name}
          </NavLink>
        ))}
      </nav>
    </>
  );
}