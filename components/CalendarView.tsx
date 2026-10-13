import React, { useState, useMemo } from 'react';
import { DAYS_HINDI, getDaysInMonth, getFirstDayOfMonth, isToday } from '../utils/dateUtils';
import { Event, Festival } from '../types';
import { getPanchangForDate } from '../utils/panchangUtils';
import { Sparkles, Calendar as CalendarIcon, Flag } from 'lucide-react';

interface CalendarViewProps {
  currentMonth: number;
  currentYear: number;
  onDateClick: (day: number) => void;
  onSelectFestival: (festival: Festival) => void;
  events: Event[];
  festivals: Festival[];
  language?: 'hi' | 'en';
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  currentMonth, 
  currentYear, 
  onDateClick, 
  onSelectFestival,
  events,
  festivals,
  language = 'hi'
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'festivals' | 'events' | 'holidays'>('all');

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonthDays = useMemo(() => {
    const days: number[] = [];
    const prevMonthDaysCount = getDaysInMonth(currentMonth - 1, currentYear);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(prevMonthDaysCount - i);
    }
    return days;
  }, [currentMonth, currentYear, firstDay]);

  const currentMonthDays = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const nextMonthDays = useMemo(() => {
    const totalSlots = 42; // 6 rows * 7 days
    const filledSlots = prevMonthDays.length + currentMonthDays.length;
    return Array.from({ length: totalSlots - filledSlots }, (_, i) => i + 1);
  }, [prevMonthDays, currentMonthDays]);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const getFestivalsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return festivals.filter(f => f.date === dateStr);
  };

  const isEnglish = language === 'en';

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
      {/* Calendar Header Sub-bar with quick filters */}
      <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <span>{isEnglish ? 'Daily Panchang & Timings:' : 'दैनिक पंचांग व पर्व समय:'}</span>
          <span className="text-indigo-600 font-extrabold">
            {isEnglish ? `Vikram Samvat ${currentYear + (currentMonth >= 3 ? 57 : 56)}` : `विक्रम संवत ${currentYear + (currentMonth >= 3 ? 57 : 56)}`}
          </span>
          <span className="text-[11px] text-slate-400 font-normal ml-1">
            (Standard English Time: AM / PM)
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              filterMode === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isEnglish ? 'All' : 'सभी (All)'}
          </button>
          <button
            onClick={() => setFilterMode('festivals')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              filterMode === 'festivals' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {isEnglish ? 'Festivals' : 'त्यौहार'}
          </button>
          <button
            onClick={() => setFilterMode('events')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              filterMode === 'events' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CalendarIcon className="w-3 h-3" />
            {isEnglish ? 'Personal' : 'निजी'}
          </button>
          <button
            onClick={() => setFilterMode('holidays')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              filterMode === 'holidays' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Flag className="w-3 h-3" />
            {isEnglish ? 'Holidays' : 'अवकाश'}
          </button>
        </div>
      </div>

      {/* Weekday columns */}
      <div className="grid grid-cols-7 bg-slate-100/70 border-b border-slate-200 text-center">
        {DAYS_HINDI.map((day, idx) => (
          <div 
            key={day.en} 
            className={`py-3 text-xs font-bold uppercase tracking-wider ${
              idx === 0 ? 'text-rose-600 bg-rose-50/30' : 'text-slate-600'
            }`}
          >
            {isEnglish ? (
              <span className="font-extrabold">{day.en}</span>
            ) : (
              <>
                <span className="block sm:inline">{day.short}</span>
                <span className="hidden sm:inline text-[10px] text-slate-400 font-medium ml-1">({day.en})</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Grid of days */}
      <div className="calendar-grid">
        {/* Previous Month Days */}
        {prevMonthDays.map(day => (
          <div 
            key={`prev-${day}`} 
            className="h-28 md:h-36 p-1.5 sm:p-2 border-b border-r border-slate-100 bg-slate-50/50 text-slate-300"
          >
            <span className="text-xs font-medium">{day}</span>
          </div>
        ))}

        {/* Current Month Days */}
        {currentMonthDays.map(day => {
          const dayDate = new Date(currentYear, currentMonth, day);
          const panchang = getPanchangForDate(dayDate);
          const dayFestivals = getFestivalsForDay(day);
          const dayEvents = getEventsForDay(day);
          const active = isToday(day, currentMonth, currentYear);
          const isSunday = dayDate.getDay() === 0;

          // Short Tithi tag
          const tithiShort = panchang.tithi.split(' ')[0];
          const isSpecialTithi = panchang.tithi.includes('एकादशी') || panchang.tithi.includes('पूर्णिमा') || panchang.tithi.includes('अमावस्या');

          // Filter checks
          const showFestivals = filterMode === 'all' || filterMode === 'festivals' || (filterMode === 'holidays' && dayFestivals.some(f => f.isOfficialHoliday));
          const showEvents = filterMode === 'all' || filterMode === 'events';

          return (
            <div 
              key={`curr-${day}`} 
              onClick={() => onDateClick(day)}
              className={`h-28 md:h-36 p-1.5 sm:p-2 border-b border-r border-slate-100 hover:bg-indigo-50/60 transition-colors cursor-pointer group relative flex flex-col justify-between ${
                active ? 'bg-indigo-50/40 ring-2 ring-inset ring-indigo-500' : ''
              } ${isSunday ? 'bg-rose-50/10' : ''}`}
            >
              {/* Day Header: Date & Tithi */}
              <div>
                <div className="flex items-center justify-between">
                  <span 
                    className={`text-xs sm:text-sm font-extrabold inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-xl transition-all ${
                      active 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : isSunday
                        ? 'text-rose-600 group-hover:bg-rose-100'
                        : 'text-slate-800 group-hover:text-indigo-600'
                    }`}
                  >
                    {day}
                  </span>

                  <span 
                    title={panchang.tithi}
                    className={`text-[9px] sm:text-[10px] font-semibold truncate max-w-[65px] px-1 rounded ${
                      isSpecialTithi 
                        ? 'bg-amber-100 text-amber-900 font-bold' 
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {tithiShort}
                  </span>
                </div>

                {/* Festival Badges & Events */}
                <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                  {showFestivals && dayFestivals.map(fest => (
                    <div 
                      key={fest.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFestival(fest);
                      }}
                      className="text-[10px] sm:text-[11px] truncate px-1.5 py-0.5 rounded-lg font-bold text-white shadow-xs flex items-center gap-1 hover:brightness-110 transition-all cursor-pointer"
                      style={{ backgroundColor: fest.color }}
                      title={`${isEnglish ? fest.englishName : fest.name} • Time: ${fest.shubhMuhurat}`}
                    >
                      <Sparkles className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">
                        {isEnglish ? fest.englishName.split('(')[0] : fest.name.split('(')[0]}
                      </span>
                    </div>
                  ))}

                  {showEvents && dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className="text-[10px] sm:text-[11px] truncate px-1.5 py-0.5 rounded-lg font-semibold text-white shadow-xs flex items-center gap-1"
                      style={{ backgroundColor: event.color }}
                      title={`${event.title}${event.time ? ` • Time: ${event.time}` : ''}`}
                    >
                      {event.time && (
                        <span className="font-mono text-[9px] bg-black/25 px-1 py-0.2 rounded shrink-0 font-bold">
                          {event.time}
                        </span>
                      )}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom footer indicators */}
              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                {dayFestivals.some(f => f.isOfficialHoliday) && (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                    {isEnglish ? "Holiday" : "अवकाश"}
                  </span>
                )}
                {dayEvents.length > 0 && !dayFestivals.some(f => f.isOfficialHoliday) && (
                  <span className="text-indigo-600 font-semibold">
                    {dayEvents.length} {isEnglish ? (dayEvents.length === 1 ? "note" : "notes") : "नोट"}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Next Month Days */}
        {nextMonthDays.map(day => (
          <div 
            key={`next-${day}`} 
            className="h-28 md:h-36 p-1.5 sm:p-2 border-b border-r border-slate-100 bg-slate-50/50 text-slate-300"
          >
            <span className="text-xs font-medium">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
