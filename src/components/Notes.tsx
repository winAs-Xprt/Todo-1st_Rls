import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home as HomeIcon, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * A simple multi-day notes page with "yesterday," "today," and "tomorrow."
 * Instead of a Filter dropdown, we have left/right arrows to switch days,
 * horizontally fixed buttons (Home, Notes, Calendar) on the top bar,
 * plus a "Cloud Notebook" label near the day arrows.
 */
const Notes: React.FC = () => {
  // We have 3 possible "days" for notes
  const dayKeys = ['yesterday', 'today', 'tomorrow'] as const;
  const [dayIndex, setDayIndex] = useState<number>(1); // 0 => yesterday, 1 => today, 2 => tomorrow
  const selectedDay = dayKeys[dayIndex];

  // Local storage key (simplified to 'multiDayNotes')
  const localStorageKey = 'multiDayNotes';

  // Our notes object: keys "yesterday", "today", "tomorrow"
  const [notes, setNotes] = useState<Record<typeof dayKeys[number], string>>({
    yesterday: '',
    today: '',
    tomorrow: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Error parsing local notes:', err);
      }
    }
  }, []);

  // Save to localStorage whenever notes changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
  }, [notes]);

  // The note text for the currently selected day
  const currentNote = notes[selectedDay];

  // Update the note text for the selected day
  function handleNoteChange(newText: string) {
    setNotes(prev => ({
      ...prev,
      [selectedDay]: newText
    }));
  }

  // Left/Right arrow handlers to cycle dayIndex
  function handlePrevDay() {
    if (dayIndex > 0) setDayIndex(dayIndex - 1);
  }
  function handleNextDay() {
    if (dayIndex < dayKeys.length - 1) setDayIndex(dayIndex + 1);
  }

  // For heading
  const currentDateStr = format(new Date(), 'EEE, MMM d, yyyy');
  const navigate = useNavigate();

  // Lined-paper CSS
  const linedPaperStyles = `
    /* Container with horizontal lines + two margin lines */
    .lined-paper {
      position: relative;
    }
    /* Horizontal lines in light mode */
    .lined-paper::before {
      content: "";
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      background-image: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.2) 0px,
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent 31px
      );
    }
    /* Two margin lines in light mode (red) */
    .lined-paper::after {
      content: "";
      position: absolute;
      z-index: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      left: 1.5rem;
      width: 1px;
      background-color: rgba(255, 0, 0, 0.4);
      box-shadow: 4px 0 0 0 rgba(255, 0, 0, 0.4);
    }
    /* Dark mode lines => lighter lines + margin lines */
    .dark .lined-paper::before {
      background-image: repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.3) 0px,
        rgba(255, 255, 255, 0.3) 1px,
        transparent 1px,
        transparent 31px
      );
    }
    .dark .lined-paper::after {
      background-color: rgba(255, 0, 0, 0.6);
      box-shadow: 4px 0 0 0 rgba(255, 0, 0, 0.6);
    }
  `;

  return (
    <>
      <style>{linedPaperStyles}</style>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />

        <div className="pt-16 pb-8 w-full">
          {/* Top bar with day navigation & fixed action buttons */}
          <div className="flex items-center justify-between px-4 mb-4">
            {/* Left: Day Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevDay}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                disabled={dayIndex === 0} // can't go before "yesterday"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h2 className="text-xl font-light text-gray-900 dark:text-white capitalize">
                {selectedDay}
              </h2>
              <button
                onClick={handleNextDay}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                disabled={dayIndex === dayKeys.length - 1} // can't go after "tomorrow"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              {/* "Cloud Notebook" text */}
              <span className="ml-4 text-xl font-light text-gray-900 dark:text-white">
                Cloud Notebook
              </span>
            </div>

            {/* Right: horizontally fixed action buttons (Home, Notes, Calendar) */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-light text-gray-600 dark:text-gray-300">Home</span>
              </button>
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-light text-gray-600 dark:text-gray-300">Notes</span>
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <CalendarIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-light text-gray-600 dark:text-gray-300">Calendar</span>
              </button>
            </div>
          </div>

          {/* Subheading with current real date (optional) */}
          <div className="px-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {currentDateStr}
            </p>
          </div>

          {/* Lined Paper => single scrollbar => wide */}
          <div className="lined-paper w-full px-8 pb-8 text-gray-900 dark:text-white">
            <textarea
              className="
                w-full
                min-h-[500px]
                bg-transparent
                border-none
                outline-none
                resize-none
                text-lg
                leading-[2rem]
                font-handwritten
                pl-[2rem]
                text-gray-900 dark:text-white
                block
              "
              placeholder={`Write your ${selectedDay} note here...`}
              value={currentNote}
              onChange={(e) => handleNoteChange(e.target.value)}
            />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Notes;
