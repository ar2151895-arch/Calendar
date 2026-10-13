import React, { useState } from 'react';
import { Event, Festival } from '../types';
import { getPanchangForDate } from '../utils/panchangUtils';
import { formatHindiDate, formatEnglishDate, HINDI_DAYS_FULL } from '../utils/festivalDatabase';
import { formatToEnglish12HourTime } from '../utils/dateUtils';
import { 
  X, 
  Plus, 
  Trash2, 
  Sun, 
  Moon, 
  Clock, 
  MapPin, 
  Sparkles, 
  Calendar as CalendarIcon, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface DayModalProps {
  day: number;
  month: number;
  year: number;
  festivals: Festival[];
  events: Event[];
  onClose: () => void;
  onAddEvent: (eventData: Omit<Event, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
  onSelectFestival: (festival: Festival) => void;
}

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316'  // Orange
];

const DayModal: React.FC<DayModalProps> = ({
  day,
  month,
  year,
  festivals,
  events,
  onClose,
  onAddEvent,
  onDeleteEvent,
  onSelectFestival
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('फंक्शन (Function)');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const dateObj = new Date(year, month, day);
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dayOfWeekIndex = dateObj.getDay();
  const panchang = getPanchangForDate(dateObj);

  const dayFestivals = festivals.filter(f => f.date === dateStr);
  const dayEvents = events.filter(e => e.date === dateStr);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const englishTime = time ? formatToEnglish12HourTime(time) : undefined;

    onAddEvent({
      date: dateStr,
      title: title.trim(),
      description: description.trim() || undefined,
      color,
      category,
      time: englishTime,
      location: location || undefined
    });

    setTitle('');
    setDescription('');
    setTime('');
    setLocation('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1 flex items-center gap-2">
              <span>{HINDI_DAYS_FULL[dayOfWeekIndex]}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {formatEnglishDate(dateStr)}
            </h2>
            <div className="text-xs text-indigo-200 font-medium">
              {formatHindiDate(dateStr)}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-300">
              <span className="bg-indigo-900/60 border border-indigo-700/50 px-2 py-0.5 rounded-md">
                {panchang.hinduMonth} &bull; {panchang.paksha}
              </span>
              <span className="bg-indigo-900/60 border border-indigo-700/50 px-2 py-0.5 rounded-md">
                Vikram Samvat {panchang.vikramSamvat}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Panchang Quick Summary Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between text-amber-900 font-bold text-sm mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Daily Panchang & Times (दैनिक पंचांग व समय)</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                English Standard Time (IST)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-slate-500 block text-[11px] font-semibold">Tithi (पंचांग तिथि):</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{panchang.tithi}</span>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-slate-500 block text-[11px] font-semibold">Sunrise / Sunset (सूर्योदय / सूर्यास्त):</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{panchang.sunrise} / {panchang.sunset}</span>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-slate-500 block text-[11px] font-semibold">Auspicious Time (अभिजित मुहूर्त):</span>
                <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{panchang.auspiciousTime}</span>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-slate-500 block text-[11px] font-semibold">Inauspicious Time (राहुकाल):</span>
                <span className="font-extrabold text-rose-700 text-sm mt-0.5 block">{panchang.rahukaal}</span>
              </div>
            </div>
          </div>

          {/* Festivals occurring on this date */}
          {dayFestivals.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                इस दिन के मुख्य त्यौहार व पर्व ({dayFestivals.length})
              </h3>
              <div className="space-y-2.5">
                {dayFestivals.map(fest => (
                  <div
                    key={fest.id}
                    onClick={() => {
                      onClose();
                      onSelectFestival(fest);
                    }}
                    className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3.5 h-3.5 rounded-full ring-4 ring-slate-100"
                        style={{ backgroundColor: fest.color }}
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {fest.name} <span className="text-xs text-slate-500 font-normal">({fest.englishName})</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-500">{fest.badge}</span>
                          <span>&bull;</span>
                          <span className="text-indigo-700 font-extrabold">Time: {fest.shubhMuhurat}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
                      <span>कब & क्या है देखें</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User's custom events for this day */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                निजी कार्यक्रम व नोट्स ({dayEvents.length})
              </h3>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  कार्यक्रम जोड़ें
                </button>
              )}
            </div>

            {dayEvents.length === 0 && !showAddForm ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <p className="text-slate-500 text-sm">इस दिन कोई निजी कार्यक्रम या नोट नहीं है।</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  + नया फंक्शन, जन्मदिन या पूजा जोड़ें
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl group"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{event.title}</div>
                        {event.category && (
                          <span className="inline-block text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1">
                            {event.category}
                          </span>
                        )}
                        {event.time && (
                          <div className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1.5 mt-1.5 w-fit">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Time: {formatToEnglish12HourTime(event.time)}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-xs text-slate-600 mt-1.5 whitespace-pre-line bg-white p-2 rounded-lg border border-slate-100">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Event Form */}
          {showAddForm && (
            <form onSubmit={handleSave} className="bg-slate-50 border border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  नया कार्यक्रम या तिवारी जोड़ें (Add Function / Event)
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कार्यक्रम / फंक्शन का नाम <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. गृह प्रवेश, विवाह, जन्मदिन, सत्यनारायण पूजा, मीटिंग..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="पूजा व धार्मिक (Puja)">पूजा व धार्मिक (Puja / Tiwari)</option>
                    <option value="शादी व सालगिरह (Wedding)">शादी व सालगिरह (Wedding / Anniversary)</option>
                    <option value="जन्मदिन (Birthday)">जन्मदिन (Birthday)</option>
                    <option value="फंक्शन व पार्टी (Function)">फंक्शन व पार्टी (Party / Function)</option>
                    <option value="मीटिंग व कार्य (Meeting)">मीटिंग व कार्य (Meeting / Work)</option>
                    <option value="अन्य (Other)">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      समय (Time in English) - AM / PM
                    </label>
                    {time && (
                      <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {formatToEnglish12HourTime(time)}
                      </span>
                    )}
                  </div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  {/* Quick English Time Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold">Quick:</span>
                    {['09:00', '11:30', '14:00', '17:30', '19:30', '21:00'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTime(preset)}
                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition-all ${
                          time === preset 
                            ? 'bg-indigo-600 text-white shadow-2xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                        }`}
                      >
                        {formatToEnglish12HourTime(preset)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  स्थान (Location) - वैकल्पिक
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="उदा. घर, होटल, मंदिर, ऑफिस..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विवरण / नोट्स (Notes & Details) - वैकल्पिक
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="कार्यक्रम से जुड़ी विशेष बातें, मेहमानों की सूची, आदि..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  रंग चुनें (Color Theme)
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-all ${
                        color === c ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  सुरक्षित करें (Save Event)
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayModal;
