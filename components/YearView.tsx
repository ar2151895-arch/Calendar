import React from 'react';
import { Festival, Event } from '../types';
import { MONTHS_HINDI, getDaysInMonth, getFirstDayOfMonth, isToday } from '../utils/dateUtils';
import { ChevronRight, Sparkles } from 'lucide-react';

interface YearViewProps {
  year: number;
  festivals: Festival[];
  events: Event[];
  onSelectMonth: (monthIndex: number) => void;
  onSelectDay: (day: number, monthIndex: number) => void;
}

const MINI_DAYS = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];

const YearView: React.FC<YearViewProps> = ({
  year,
  festivals,
  events,
  onSelectMonth,
  onSelectDay
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            वर्ष {year} का संपूर्ण कैलेंडर व त्यौहार
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            किसी भी महीने पर क्लिक करके विस्तृत विवरण, तिथियां और पंचांग देखें
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>प्रमुख त्यौहार</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>निजी कार्यक्रम</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>आज का दिन</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-6">
        {Array.from({ length: 12 }, (_, monthIdx) => {
          const daysInMonth = getDaysInMonth(monthIdx, year);
          const firstDay = getFirstDayOfMonth(monthIdx, year);
          
          const monthEvents = events.filter(e => {
            const [eY, eM] = e.date.split('-').map(Number);
            return eY === year && eM === monthIdx + 1;
          });

          const monthFestivals = festivals.filter(f => {
            const [fY, fM] = f.date.split('-').map(Number);
            return fY === year && fM === monthIdx + 1;
          });

          return (
            <div 
              key={monthIdx}
              className="group border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-4 transition-all hover:shadow-md bg-slate-50/40 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div 
                  onClick={() => onSelectMonth(monthIdx)}
                  className="flex items-center justify-between pb-2 border-b border-slate-200 cursor-pointer"
                >
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {MONTHS_HINDI[monthIdx]}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600">
                    {monthFestivals.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        {monthFestivals.length}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-bold text-slate-400 border-b border-slate-100">
                  {MINI_DAYS.map((d, i) => (
                    <div key={i} className={i === 0 ? 'text-rose-500' : ''}>{d}</div>
                  ))}
                </div>

                {/* Day cells grid */}
                <div className="grid grid-cols-7 gap-1 pt-1.5 text-center text-xs">
                  {/* Empty slots before day 1 */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6" />
                  ))}

                  {/* Days */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const hasFest = monthFestivals.some(f => f.date === dateStr);
                    const hasEv = monthEvents.some(e => e.date === dateStr);
                    const activeToday = isToday(dayNum, monthIdx, year);

                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => onSelectDay(dayNum, monthIdx)}
                        className={`h-6 rounded-lg flex flex-col items-center justify-center relative font-medium transition-all ${
                          activeToday
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : hasFest
                            ? 'bg-amber-100 text-amber-900 font-bold hover:bg-amber-200'
                            : hasEv
                            ? 'bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100'
                            : 'text-slate-700 hover:bg-slate-200/60'
                        }`}
                      >
                        <span className="text-[11px] leading-none">{dayNum}</span>
                        {hasFest && !activeToday && (
                          <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-0.5"></span>
                        )}
                        {hasEv && !hasFest && !activeToday && (
                          <span className="w-1 h-1 rounded-full bg-indigo-600 absolute bottom-0.5"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month Festival highlight footer */}
              {monthFestivals.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  {monthFestivals.slice(0, 2).map(f => (
                    <div 
                      key={f.id} 
                      onClick={() => onSelectMonth(monthIdx)}
                      className="truncate text-amber-900 font-semibold cursor-pointer hover:underline flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="text-slate-500 font-normal">
                        {parseInt(f.date.split('-')[2], 10)}:
                      </span>
                      {f.name.split('(')[0]}
                    </div>
                  ))}
                  {monthFestivals.length > 2 && (
                    <div 
                      onClick={() => onSelectMonth(monthIdx)}
                      className="text-[10px] text-indigo-600 font-bold cursor-pointer hover:underline"
                    >
                      +{monthFestivals.length - 2} और त्यौहार देखें...
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;
