import React from 'react';
import { Settings, User, LogOut, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    // Navigate to login page on logout
    navigate('/login');
  };

  return (
    <div
      className="
        fixed top-0 left-0 right-0 z-50
        h-6 flex items-center
        bg-white/80 dark:bg-gray-800/80
        backdrop-blur-md border-b border-gray-200 dark:border-gray-700
        transition-colors duration-200
      "
    >
      {/* 
        Container: 
        Removed 'max-w-7xl mx-auto' so it spans full width. 
        Using 'w-full px-4' for some horizontal padding.
      */}
      <div className="w-full px-4 flex justify-between items-center">
        {/* Left: Jivatodo brand */}
        <span className="text-xs font-light text-gray-900 dark:text-white">
          Jivatodo
        </span>

        {/* Right: date/time, dark mode, profile, settings, logout */}
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {format(currentTime, 'EEE, MMM d')}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {format(currentTime, 'h:mm:ss a')}
          </span>
          <button
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <User className="h-4 w-4" />
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
