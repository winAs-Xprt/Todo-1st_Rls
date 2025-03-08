import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { TodoList } from './TodoList';
import {
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

export function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const navigate = useNavigate();

  const handlePrevDay = () => {
    setSlideDirection('right');
    setCurrentDate(prev => subDays(prev, 1));
    setTimeout(() => setSlideDirection(null), 300);
  };

  const handleNextDay = () => {
    setSlideDirection('left');
    setCurrentDate(prev => addDays(prev, 1));
    setTimeout(() => setSlideDirection(null), 300);
  };

  // (Optional) If you no longer need the optionsRef and dropdown logic, we remove them.
  // Instead, we display the Home, Notes, and Calendar buttons directly in the top bar.

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <div className="pt-10 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Top bar with Date Navigation and fixed action buttons */}
          <div className="flex items-center justify-between mb-8">
            {/* Date Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevDay}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                {format(currentDate, 'MMMM d, yyyy')}
              </h2>
              <button
                onClick={handleNextDay}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Fixed Action Buttons: Home, Notes, Calendar */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-light text-gray-600 dark:text-gray-300">Home</span>
              </button>
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-light text-gray-600 dark:text-gray-300">Notes</span>
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <CalendarIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-light text-gray-600 dark:text-gray-300">Calendar</span>
              </button>
            </div>
          </div>

          {/* TodoList Component */}
          <TodoList date={currentDate} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
