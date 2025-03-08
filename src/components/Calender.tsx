import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Plus,
  ListTodo,
  Star,
  Calendar as CalendarIcon,
  Edit2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface Task {
  id: number;
  email: string;
  title: string;
  description: string;
  date: string;
  color: string; // Options: "blue", "red", "green", "yellow", "pink", "violet"
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    color: 'blue',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
  const navigate = useNavigate();

  // Fetch tasks on mount and whenever currentDate changes
  useEffect(() => {
    fetchTasks();
  }, [currentDate]);

  function fetchTasks() {
    const stored = localStorage.getItem('tasks');
    if (!stored) {
      setTasks([]);
      setIsLoaded(true);
      return;
    }
    const allTasks: Task[] = JSON.parse(stored);
    const userTasks = allTasks.filter(task => task.email === userEmail);
    setTasks(userTasks);
    setIsLoaded(true);
  }

  // Write tasks to localStorage after tasks are loaded
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !newTask.title.trim()) return;

    const task: Task = {
      id: Date.now(),
      email: userEmail,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      date: selectedDate.toISOString(),
      color: newTask.color,
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setShowTaskForm(false);
    setNewTask({ title: '', description: '', color: 'blue' });
  }

  function deleteTask(id: number) {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
  }

  function startEditing(task: Task) {
    setEditingTask(task);
    setShowEditForm(true);
  }

  function handleEditTask(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    const updated = tasks.map(t =>
      t.id === editingTask.id
        ? { ...t, ...editingTask, title: editingTask.title.trim() }
        : t
    );
    setTasks(updated);
    setShowEditForm(false);
    setEditingTask(null);
  }

  // Generate days in the current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Mapping from color to Tailwind classes
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-200 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    red: 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    green: 'bg-green-200 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    yellow: 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    pink: 'bg-pink-200 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    violet: 'bg-violet-200 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <div className="pt-10 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Top Bar: Title, Month Navigation, and Fixed Action Buttons */}
          <div className="flex items-center justify-between mb-8">
            {/* Month Navigation */}
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">Calendar</h2>
              <button
                onClick={() =>
                  setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
                }
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() =>
                  setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
                }
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
              >
                <ChevronRight className="h-5 w-5" />
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
                <ListTodo className="h-5 w-5 text-green-600 dark:text-green-400" />
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

          {/* Calendar Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className="text-center text-sm font-medium py-2 text-gray-600 dark:text-gray-300"
                >
                  {day}
                </div>
              ))}

              {days.map(day => {
                const isToday = isSameDay(day, new Date());
                const isInCurrentMonth = isSameMonth(day, currentDate);
                const dayTasks = tasks.filter(task => isSameDay(parseISO(task.date), day));

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => {
                      setSelectedDate(day);
                      setShowTaskForm(true);
                    }}
                    className={`
                      min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 
                      ${isInCurrentMonth
                        ? isToday
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-white dark:bg-gray-800'
                        : 'bg-gray-50 dark:bg-gray-900'
                      }
                      hover:bg-gray-200 dark:hover:bg-gray-700
                      cursor-pointer relative
                    `}
                  >
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      {format(day, 'd')}
                      {isToday && (
                        <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">(Today)</span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {dayTasks.map(task => {
                        const colorClass = colorClasses[task.color] || colorClasses['blue'];
                        return (
                          <div
                            key={task.id}
                            onClick={e => e.stopPropagation()}
                            className={`text-xs p-1 mt-1 rounded ${colorClass} flex items-center justify-between`}
                          >
                            <span className="truncate">{task.title}</span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => startEditing(task)}
                                className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Task Modal */}
          {showTaskForm && selectedDate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add Task for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Title"
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <textarea
                    value={newTask.description}
                    onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description"
                    rows={3}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <select
                      value={newTask.color}
                      onChange={e => setNewTask(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="pink">Pink</option>
                      <option value="violet">Violet</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Task Modal */}
          {showEditForm && editingTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Edit Task
                </h3>
                <form onSubmit={handleEditTask} className="space-y-4">
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={e =>
                      setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)
                    }
                    placeholder="Title"
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={e =>
                      setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)
                    }
                    placeholder="Description"
                    rows={3}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <select
                      value={editingTask.color}
                      onChange={e =>
                        setEditingTask(prev => prev ? { ...prev, color: e.target.value } : null)
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="pink">Pink</option>
                      <option value="violet">Violet</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingTask(null);
                      }}
                      className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Calendar;
