"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string | 'present') => void;
  initialDate?: string;
  isEndDate?: boolean;
}

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const toYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const DatePicker: React.FC<DatePickerProps> = ({ isOpen, onClose, onSelect, initialDate, isEndDate = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate ? new Date(initialDate + 'T00:00:00') : new Date());
  const [viewDate, setViewDate] = useState<Date>(initialDate ? new Date(initialDate + 'T00:00:00') : new Date());

  useEffect(() => {
    if (isOpen) {
      const date = initialDate && initialDate !== '' ? new Date(initialDate + 'T00:00:00') : new Date();
      setSelectedDate(date);
      setViewDate(date);
    }
  }, [initialDate, isOpen]);

  const calendarGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`pad-start-${i}`} className="p-2"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div key={day} className="flex justify-center items-center">
          <button
            onClick={() => setSelectedDate(new Date(year, month, day))}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors
              ${isSelected ? 'bg-orange-500 text-white font-bold' : isToday ? 'text-orange-500 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-slate-700'}
            `}
          >
            {day}
          </button>
        </div>
      );
    }
    return days;
  }, [viewDate, selectedDate]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSave = () => {
    onSelect(toYYYYMMDD(selectedDate));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-xs overflow-hidden transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
        <header className="bg-orange-500 text-white p-4">
          <div className="text-sm uppercase font-medium tracking-wider text-orange-100">Select date</div>
          <div className="text-3xl font-bold mt-1">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </header>
        <main className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300" aria-label="Previous month">&lt;</button>
              <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300" aria-label="Next month">&gt;</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            {WEEK_DAYS.map((day, i) => <div key={`${day}-${i}`}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {calendarGrid}
          </div>
        </main>
        <footer className="flex justify-end gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
          {isEndDate && (
            <button onClick={() => onSelect('present')} className="font-bold text-orange-500 px-4 py-2 rounded hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors mr-auto">PRESENT</button>
          )}
          <button onClick={onClose} className="font-bold text-orange-500 px-4 py-2 rounded hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors">CANCEL</button>
          <button onClick={handleSave} className="font-bold text-orange-500 px-4 py-2 rounded hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors">OK</button>
        </footer>
      </div>
    </div>
  );
};
