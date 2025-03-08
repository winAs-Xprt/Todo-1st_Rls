import React from 'react';
import { Home, Plus, ListTodo, Calendar, Star } from 'lucide-react';

export function Dock() {
  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-200">
        <div className="flex items-center space-x-8">
          <button className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-125 transition-all duration-300">
            <Home className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span className="absolute -top-8 scale-0 transition-all rounded bg-gray-900 dark:bg-gray-700 p-2 text-xs text-white group-hover:scale-100">
              Home
            </span>
          </button>
          <button className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-125 transition-all duration-300">
            <Plus className="h-7 w-7 text-green-600 dark:text-green-400" />
            <span className="absolute -top-8 scale-0 transition-all rounded bg-gray-900 dark:bg-gray-700 p-2 text-xs text-white group-hover:scale-100">
              New Task
            </span>
          </button>
          <button className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-125 transition-all duration-300">
            <ListTodo className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            <span className="absolute -top-8 scale-0 transition-all rounded bg-gray-900 dark:bg-gray-700 p-2 text-xs text-white group-hover:scale-100">
              All Tasks
            </span>
          </button>
          <button className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-125 transition-all duration-300">
            <Star className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
            <span className="absolute -top-8 scale-0 transition-all rounded bg-gray-900 dark:bg-gray-700 p-2 text-xs text-white group-hover:scale-100">
              Important
            </span>
          </button>
          <button className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-125 transition-all duration-300">
            <Calendar className="h-7 w-7 text-red-600 dark:text-red-400" />
            <span className="absolute -top-8 scale-0 transition-all rounded bg-gray-900 dark:bg-gray-700 p-2 text-xs text-white group-hover:scale-100">
              Calendar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}