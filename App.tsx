import React, { useState, useEffect, useMemo } from 'react';
import CalendarView from './components/CalendarView';
import YearView from './components/YearView';
import FestivalListView from './components/FestivalListView';
import FestivalModal from './components/FestivalModal';
import DayModal from './components/DayModal';
import ChatBot from './components/ChatBot';
import { MONTHS_HINDI, getCurrentEnglishTime, formatToEnglish12HourTime } from './utils/dateUtils';
import { getFestivalsForYear, formatHindiDate, formatEnglishDate } from './utils/festivalDatabase';
import { getPanchangForDate } from './utils/panchangUtils';
import { Event, Festival } from './types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Grid3X3, 
  ListFilter, 
  CalendarDays, 
  Plus, 
  Clock, 
  Sun,
  Flame,
  Award,
  Share2
} from 'lucide-react';

const POPULAR_YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'sample-1',
    date: '2026-10-15',
    title: 'गृह प्रवेश पूजा व हवन',
    category: 'पूजा व धार्मिक (Puja)',
    time: '10:00 AM',
    location: 'नया आवास, मुख्य द्वार',
    description: 'पंडित जी द्वारा नवग्रह शांति व गृह प्रवेश पूजा।',
    color: '#f59e0b',
  },
  {
    id: 'sample-2',
    date: '2026-11-12',
    title: 'रोहित की शादी की सालगिरह',
    category: 'शादी व सालगिरह (Wedding)',
    time: '07:30 PM',
    location: 'रॉयल पैलेस',
    description: 'परिवार संग डिनर पार्टी।',
    color: '#8b5cf6',
  }
];

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year' | 'festivals'>('month');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  
  // Custom user events
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const saved = localStorage.getItem('vishwa-calendar-events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  // Modal states
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  
  // Year jump input
  const [jumpYear, setJumpYear] = useState(new Date().getFullYear().toString());

  // Chat trigger state
  const [aiChatPrompt, setAiChatPrompt] = useState<string | undefined>(undefined);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const isEnglish = language === 'en';

  // Live real-time clock in English (Samay)
  const [liveTime, setLiveTime] = useState<string>(() => getCurrentEnglishTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(getCurrentEnglishTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save events to local storage
  useEffect(() => {
    try {
      localStorage.setItem('vishwa-calendar-events', JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events:', e);
    }
  }, [events]);

  // Sync jumpYear with year state
  useEffect(() => {
    setJumpYear(year.toString());
  }, [year]);

  // Festivals for the currently selected year
  const festivals = useMemo(() => {
    return getFestivalsForYear(year);
  }, [year]);

  // Today's Panchang for header badge
  const todayPanchang = useMemo(() => {
    return getPanchangForDate(new Date());
  }, []);

  const changeMonth = (delta: number) => {
    const newDate = new Date(year, month + delta, 1);
    setCurrentDate(newDate);
  };

  const changeYear = (delta: number) => {
    const newDate = new Date(year + delta, month, 1);
    setCurrentDate(newDate);
  };

  const handleYearSelect = (newYear: number) => {
    setCurrentDate(new Date(newYear, month, 1));
  };

  const handleJumpYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedYear = parseInt(jumpYear, 10);
    if (!isNaN(parsedYear) && parsedYear >= 1 && parsedYear <= 9999) {
      setCurrentDate(new Date(parsedYear, month, 1));
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  const handleDateClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleAddEvent = (newEventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: Math.random().toString(36).substring(2, 9),
      ...newEventData,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleOpenDayForFestival = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, 1));
    setSelectedDay(d);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Auspicious & Time Banner - Live English Clock and Daily Muhurat */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[11px] sm:text-xs py-2 px-4 font-semibold shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Live English Time (Samay) Badge */}
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/20 shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200 text-[10px] font-extrabold uppercase tracking-wider">
              {isEnglish ? "Time (English):" : "समय (Time in English):"}
            </span>
            <span className="font-mono font-black text-white text-xs tracking-wider bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/30">
              {liveTime}
            </span>
            <span className="text-[10px] text-amber-200 font-bold hidden sm:inline">IST</span>
          </div>

          {/* Panchang & Solar timings in English format */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-amber-100 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span>{isEnglish ? "Tithi:" : "तिथि:"}</span>
              <strong className="text-white">{todayPanchang.tithi}</strong>
            </div>
            <span>&bull;</span>
            <span>Sunrise: <strong className="text-white">{todayPanchang.sunrise}</strong></span>
            <span>&bull;</span>
            <span>Sunset: <strong className="text-white">{todayPanchang.sunset}</strong></span>
            <span>&bull;</span>
            <span className="hidden sm:inline">Auspicious Time: <strong className="text-white">{todayPanchang.auspiciousTime}</strong></span>
            <span>&bull;</span>
            <span className="hidden md:inline">Rahu Kaal: <strong className="text-amber-300">{todayPanchang.rahukaal}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isEnglish ? "Vishwa Calendar AI" : "विश्व कैलेंडर AI"}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                  {isEnglish ? "Universal Calendar" : "हर साल का पंचांग"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isEnglish 
                  ? "Any Year Calendar • All Festivals (When, What & Timings) • Notes & Functions"
                  : "किसी भी साल का कैलेंडर • सभी त्यौहार (कब है, कब नहीं, और क्या है)"}
              </p>
            </div>
          </div>

          {/* Month & Year Navigation Controls + Language Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View in English"
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  language === 'hi'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिन्दी में देखें"
              >
                हिन्दी
              </button>
            </div>

            {/* Previous Month */}
            <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button 
                onClick={() => changeMonth(-1)}
                title={isEnglish ? "Previous Month" : "पिछला महीना"}
                className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-all text-slate-600 hover:text-indigo-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="px-3 py-1 text-center min-w-[130px] sm:min-w-[150px]">
                <span className="block text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  {isEnglish ? MONTHS_HINDI[month].split(' ')[1]?.replace(/[()]/g, '') : MONTHS_HINDI[month].split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block leading-tight">
                  {isEnglish ? MONTHS_HINDI[month].split(' ')[0] : MONTHS_HINDI[month].split(' ')[1]?.replace(/[()]/g, '')}
                </span>
              </div>

              <button 
                onClick={() => changeMonth(1)}
                title={isEnglish ? "Next Month" : "अगला महीना"}
                className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-all text-slate-600 hover:text-indigo-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Year Selector / Jump */}
            <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button 
                onClick={() => changeYear(-1)}
                title="-1 Year"
                className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-all text-slate-600 hover:text-indigo-600 text-xs font-bold"
              >
                -1 {isEnglish ? "Yr" : "वर्ष"}
              </button>

              <form onSubmit={handleJumpYearSubmit} className="flex items-center px-1">
                <input 
                  type="number" 
                  min="1"
                  max="9999"
                  value={jumpYear}
                  onChange={(e) => setJumpYear(e.target.value)}
                  title={isEnglish ? "Enter any year and press Enter" : "कोई भी साल लिखें और Enter दबाएं"}
                  className="w-16 sm:w-20 text-center text-sm sm:text-base font-black text-indigo-700 bg-white border border-slate-200 rounded-xl py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </form>

              <button 
                onClick={() => changeYear(1)}
                title="+1 Year"
                className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-all text-slate-600 hover:text-indigo-600 text-xs font-bold"
              >
                +1 {isEnglish ? "Yr" : "वर्ष"}
              </button>
            </div>

            {/* Today Button */}
            <button 
              onClick={handleGoToday}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold rounded-2xl transition-all border border-indigo-200"
            >
              {isEnglish ? "Today" : "आज (Today)"}
            </button>
          </div>
        </div>

        {/* View Switcher Bar & Popular Year Pills */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-slate-100 text-xs">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl self-start">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{isEnglish ? "Month View" : "महीना दृश्य"}</span>
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'year'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{isEnglish ? `Full Year (${year})` : `संपूर्ण 12 महीने (${year})`}</span>
            </button>
            <button
              onClick={() => setViewMode('festivals')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'festivals'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEnglish ? `Festivals & Holidays (${festivals.length})` : `त्यौहार व छुट्टियां (${festivals.length})`}</span>
            </button>
          </div>

          {/* Quick Year jump chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            <span className="text-slate-400 font-semibold mr-1 shrink-0">{isEnglish ? "Select Year:" : "वर्ष चुनें:"}</span>
            {POPULAR_YEARS.map(y => (
              <button
                key={y}
                onClick={() => handleYearSelect(y)}
                className={`px-2.5 py-1 rounded-xl font-bold text-xs transition-all shrink-0 ${
                  year === y
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Render Active View */}
        {viewMode === 'month' && (
          <CalendarView 
            currentMonth={month} 
            currentYear={year} 
            onDateClick={handleDateClick}
            onSelectFestival={(fest) => setSelectedFestival(fest)}
            events={events}
            festivals={festivals}
            language={language}
          />
        )}

        {viewMode === 'year' && (
          <YearView 
            year={year}
            festivals={festivals}
            events={events}
            onSelectMonth={(m) => {
              setCurrentDate(new Date(year, m, 1));
              setViewMode('month');
            }}
            onSelectDay={(d, m) => {
              setCurrentDate(new Date(year, m, 1));
              setSelectedDay(d);
            }}
          />
        )}

        {viewMode === 'festivals' && (
          <FestivalListView 
            year={year}
            festivals={festivals}
            onSelectFestival={(fest) => setSelectedFestival(fest)}
            onAskAI={(query) => setAiChatPrompt(query)}
          />
        )}

        {/* Feature Highlights bar for user benefit */}
        <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">हर साल का सटीक विवरण</h4>
                <p className="text-xs text-slate-500">दिवाली, होली, छठ, ईद, क्रिसमस सहित 45+ बड़े त्यौहार</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">कब है & कब नहीं है?</h4>
                <p className="text-xs text-slate-500">मुहूर्त, भद्रा काल, सूतक नियम और संपूर्ण पूजा विधि</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">अपने निजी कार्यक्रम जोड़ें</h4>
                <p className="text-xs text-slate-500">शादी, जन्मदिन, पूजा, मीटिंग व नोट्स हमेशा सुरक्षित</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Flame className="w-3 h-3 text-amber-300" />
            </div>
            <span className="font-bold text-slate-800">विश्व कैलेंडर AI (Vishwa Calendar)</span>
            <span>&bull; सर्व धर्म त्यौहार &bull; वैदिक पंचांग</span>
          </div>
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} विश्व कैलेंडर AI. Powered by Gemini 3.8 Flash.
          </p>
        </div>
      </footer>

      {/* Day Details Modal */}
      {selectedDay !== null && (
        <DayModal 
          day={selectedDay}
          month={month}
          year={year}
          festivals={festivals}
          events={events}
          onClose={() => setSelectedDay(null)}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          onSelectFestival={(fest) => setSelectedFestival(fest)}
        />
      )}

      {/* Festival Deep-dive Modal */}
      {selectedFestival !== null && (
        <FestivalModal 
          festival={selectedFestival}
          onClose={() => setSelectedFestival(null)}
          onAskAI={(query) => setAiChatPrompt(query)}
          onAddEventForDate={handleOpenDayForFestival}
        />
      )}

      {/* AI Floating Chatbot Assistant */}
      <ChatBot 
        currentMonthName={MONTHS_HINDI[month].split(' ')[0]}
        currentYear={year}
        initialPrompt={aiChatPrompt}
        onClearInitialPrompt={() => setAiChatPrompt(undefined)}
      />
    </div>
  );
};

export default App;
