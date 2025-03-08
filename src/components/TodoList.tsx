import React, { useEffect, useState } from 'react';
import {
  Check,
  Trash2,
  Plus,
  Edit2,
  X,
  Save,
  Filter
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface TodoOption {
  id: string;
  text: string;
}

interface Todo {
  id: string;
  email: string;
  title: string;
  description?: string;
  options?: TodoOption[];
  completed: boolean;
  created_at: string;
  due_date?: string;
}

type ViewType = 'grid' | 'list' | 'timeline' | 'analytics';

interface EditingTodo {
  id: string;
  title: string;
  description: string;
  options: TodoOption[];
}

export function TodoList({ date }: { date: Date }) {
  // Get user email from localStorage (default to "guest@example.com")
  const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
  const localStorageKey = `todos_${userEmail}`;

  // Auto-updating "today"
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Main state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);

  // Filter
  const [showFilter, setShowFilter] = useState(false);
  const [visibleDays, setVisibleDays] = useState({
    yesterday: true,
    today: true,
    tomorrow: true
  });

  // Editing
  const [hoveredTodo, setHoveredTodo] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<EditingTodo | null>(null);
  const [newOption, setNewOption] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load tasks from localStorage (key includes userEmail)
  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setLoading(false);
  }, [localStorageKey]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(todos));
  }, [todos, localStorageKey]);

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.requestSubmit();
    }
  };

  // Add a new task
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const targetDate = selectedDate || date;
    const todo: Todo = {
      id: crypto.randomUUID(),
      email: userEmail,
      title: newTodo.trim(),
      description: newDescription.trim() || undefined,
      completed: false,
      created_at: new Date().toISOString(),
      due_date: targetDate.toISOString(),
      options: []
    };
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
    setNewDescription('');
    setSelectedDate(null);
    toast.success('Todo added successfully!');
  }

  // Toggle completion and trigger confetti if task becomes completed
  function toggleTodo(id: string) {
    setTodos(prev =>
      prev.map(t => {
        if (t.id === id) {
          const becomingComplete = !t.completed;
          if (becomingComplete) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          return { ...t, completed: becomingComplete };
        }
        return t;
      })
    );
  }

  // Delete a task
  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
    toast.success('Todo deleted successfully!');
  }

  // Start editing a task
  function startEditing(todo: Todo) {
    setEditingTodo({
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
      options: todo.options || []
    });
  }

  // Cancel editing
  function cancelEditing() {
    setEditingTodo(null);
    setNewOption('');
  }

  // Add an option to the editing task
  function addOption() {
    if (!editingTodo || !newOption.trim()) return;
    setEditingTodo(prev => {
      if (!prev) return null;
      return {
        ...prev,
        options: [...prev.options, { id: crypto.randomUUID(), text: newOption.trim() }]
      };
    });
    setNewOption('');
  }

  // Remove an option
  function removeOption(optionId: string) {
    if (!editingTodo) return;
    setEditingTodo(prev => {
      if (!prev) return null;
      return {
        ...prev,
        options: prev.options.filter(opt => opt.id !== optionId)
      };
    });
  }

  // Save changes after editing
  function saveTodoChanges() {
    if (!editingTodo) return;
    setTodos(prev =>
      prev.map(t =>
        t.id === editingTodo.id
          ? {
              ...t,
              title: editingTodo.title,
              description: editingTodo.description,
              options: editingTodo.options
            }
          : t
      )
    );
    setEditingTodo(null);
    setNewOption('');
    toast.success('Todo updated successfully!');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Define day cards for yesterday, today, tomorrow
  const dayCards = [
    { key: 'yesterday', date: subDays(date, 1) },
    { key: 'today', date },
    { key: 'tomorrow', date: addDays(date, 1) }
  ];

  return (
    <div className="space-y-6">
      {/* Top bar: left side empty, center form, right side filter */}
      <div className="flex justify-between items-start gap-4 text-sm">
        {/* Left side empty */}
        <div className="w-12" />

        {/* Form in the Middle */}
        <form onSubmit={addTodo} className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Task here"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2
                             focus:ring-blue-500 text-sm placeholder:text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             transition-colors duration-200 flex items-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Description (optional) here"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2
                           focus:ring-blue-500 text-sm placeholder:text-sm"
              />
            </div>
          </div>
        </form>

        {/* Filter on the Right */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`p-2 rounded-lg transition-colors text-sm ${
            showFilter
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-sm">
          <div className="flex items-center space-x-4">
            {Object.entries(visibleDays).map(([day, isVisible]) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() =>
                    setVisibleDays(prev => ({ ...prev, [day]: !prev[day] }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                  {day}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {dayCards.map(({ key, date: colDate }) => (
          visibleDays[key as keyof typeof visibleDays] && (
            <div
              key={colDate.toISOString()}
              className={`
                bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-2
                transition-all duration-200
                ${
                  selectedDate?.toDateString() === colDate.toDateString()
                    ? 'border-blue-500 dark:border-blue-400'
                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }
              `}
              onClick={() => setSelectedDate(colDate)}
              role="button"
              tabIndex={0}
            >
              {/* Header with Dynamic Underline */}
              <div className="flex items-center justify-between mb-4">
                {(() => {
                  const todayZero = new Date(now);
                  todayZero.setHours(0, 0, 0, 0);
                  const colDateZero = new Date(colDate);
                  colDateZero.setHours(0, 0, 0, 0);

                  let headerText = '';
                  let underlineColor = '';
                  if (colDateZero.getTime() < todayZero.getTime()) {
                    headerText = format(colDateZero, 'EEEE, MMM d');
                    underlineColor = 'bg-red-500';
                  } else if (colDateZero.getTime() === todayZero.getTime()) {
                    headerText = `${format(colDateZero, 'EEEE, MMM d')} (Today)`;
                    underlineColor = 'bg-green-500';
                  } else {
                    headerText = format(colDateZero, 'EEEE, MMM d');
                    underlineColor = 'bg-orange-500';
                  }

                  return (
                    <h3 className="relative inline-block text-base font-bold text-gray-900 dark:text-white capitalize">
                      {headerText}
                      <span
                        className={`absolute left-0 -bottom-1 w-full h-1 ${underlineColor} rounded-full`}
                      />
                    </h3>
                  );
                })()}
                {selectedDate?.toDateString() === colDate.toDateString() && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    Selected
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {todos
                  .filter(todo => {
                    const tDate = new Date(todo.due_date || todo.created_at);
                    return tDate.toDateString() === colDate.toDateString();
                  })
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="relative group bg-white dark:bg-gray-800
                                 rounded-lg shadow-sm transition-all duration-200 p-4
                                 hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
                      onMouseEnter={() => setHoveredTodo(todo.id)}
                      onMouseLeave={() => setHoveredTodo(null)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {editingTodo?.id === todo.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingTodo.title}
                            onChange={(e) =>
                              setEditingTodo(prev => prev ? { ...prev, title: e.target.value } : null)
                            }
                            className="w-full px-3 py-2 rounded border border-gray-300
                                       dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          <textarea
                            value={editingTodo.description}
                            onChange={(e) =>
                              setEditingTodo(prev => prev ? { ...prev, description: e.target.value } : null)
                            }
                            className="w-full px-3 py-2 rounded border border-gray-300
                                       dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            rows={2}
                          />
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                placeholder="Add option (e.g., idli, dosa)"
                                className="flex-1 px-3 py-2 rounded border border-gray-300
                                           dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                              />
                              <button
                                onClick={addOption}
                                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Add
                              </button>
                            </div>
                            {editingTodo.options.map(option => (
                              <div
                                key={option.id}
                                className="flex items-center justify-between
                                           bg-gray-50 dark:bg-gray-700 p-2 rounded"
                              >
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {option.text}
                                </span>
                                <button
                                  onClick={() => removeOption(option.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400
                                         hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveTodoChanges}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded
                                         hover:bg-blue-700 flex items-center gap-1"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start space-x-4">
                            <div className="flex-1 min-w-0">
                              <p
                                className={`
                                  text-lg transition-colors duration-200
                                  ${
                                    todo.completed
                                      ? 'text-gray-500 dark:text-gray-400'
                                      : 'text-gray-900 dark:text-white'
                                  }
                                `}
                              >
                                {todo.title}
                              </p>
                              {todo.description && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  {todo.description}
                                </p>
                              )}
                              {todo.options && todo.options.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {todo.options.map(option => (
                                    <span
                                      key={option.id}
                                      className="px-2 py-1 text-xs bg-gray-100
                                                 dark:bg-gray-700 text-gray-700
                                                 dark:text-gray-300 rounded"
                                    >
                                      {option.text}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(todo.created_at), 'h:mm a')}
                              </p>
                            </div>
                          </div>

                          {/* Edit & Trash (Top-Right) */}
                          <div
                            className={`
                              absolute right-2 top-2 flex items-center space-x-1
                              transition-opacity duration-200
                              ${hoveredTodo === todo.id ? 'opacity-100' : 'opacity-0'}
                            `}
                          >
                            <button
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              onClick={() => startEditing(todo)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                              onClick={() => deleteTodo(todo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Check Button (Bottom-Right) */}
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`
                              absolute right-2 bottom-2 p-1 rounded-full border-2
                              flex items-center justify-center transition-colors duration-200
                              ${
                                todo.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }
                            `}
                          >
                            {todo.completed && <Check className="h-4 w-4 text-white" />}
                          </button>
                        </>
                      )}
                    </div>
                  ))}

                {/* If no tasks => bigger plus icon */}
                {todos.filter(t => {
                  const tDate = new Date(t.due_date || t.created_at);
                  return tDate.toDateString() === colDate.toDateString();
                }).length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400 text-2xl font-bold">+</p>
                  </div>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default TodoList;
