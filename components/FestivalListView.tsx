import React, { useState, useMemo } from 'react';
import { Festival } from '../types';
import { MONTHS_HINDI } from '../utils/dateUtils';
import { getDaysRemainingText } from '../utils/panchangUtils';
import { formatHindiDate, formatEnglishDate } from '../utils/festivalDatabase';
import { 
  Search, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Filter, 
  HelpCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface FestivalListViewProps {
  year: number;
  festivals: Festival[];
  onSelectFestival: (festival: Festival) => void;
  onAskAI: (query: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'सभी त्यौहार (All)' },
  { id: 'hindu', label: 'हिन्दू पर्व (Hindu)' },
  { id: 'national', label: 'राष्ट्रीय पर्व (National)' },
  { id: 'islamic', label: 'इस्लामी पर्व (Islamic)' },
  { id: 'sikh_christian', label: 'सिख व ईसाई (Sikh/Christian)' },
  { id: 'vrat_ekadashi', label: 'व्रत व एकादशी (Fasting)' },
];

const FestivalListView: React.FC<FestivalListViewProps> = ({
  year,
  festivals,
  onSelectFestival,
  onAskAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const filteredFestivals = useMemo(() => {
    return festivals.filter(f => {
      // Category filter
      if (selectedCategory !== 'all' && f.category !== selectedCategory) {
        return false;
      }

      // Month filter
      if (selectedMonth !== 'all') {
        const m = parseInt(f.date.split('-')[1], 10) - 1;
        if (m !== selectedMonth) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = f.name.toLowerCase().includes(query);
        const matchesEn = f.englishName.toLowerCase().includes(query);
        const matchesTithi = f.tithi.toLowerCase().includes(query);
        const matchesKya = f.kyaHai.toLowerCase().includes(query);
        if (!matchesName && !matchesEn && !matchesTithi && !matchesKya) {
          return false;
        }
      }

      return true;
    });
  }, [festivals, selectedCategory, selectedMonth, searchQuery]);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 animate-in fade-in duration-200 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            वर्ष {year} के प्रमुख त्यौहार व पर्व सूची
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            कुल {festivals.length} त्यौहार उपलब्ध हैं &bull; कब है, कब नहीं है, और क्या है का संपूर्ण विवरण
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="त्यौहार खोजें (उदा. दिवाली, होली, छठ)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Month selector */}
        <div className="sm:w-48 shrink-0">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">सभी महीने (All Months)</option>
            {MONTHS_HINDI.map((m, idx) => (
              <option key={idx} value={idx}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Festival Cards List */}
      {filteredFestivals.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-slate-700 font-bold text-sm">कोई त्यौहार नहीं मिला।</p>
          <p className="text-slate-500 text-xs mt-1">कृपया सर्च शब्द या फ़िल्टर बदल कर देखें।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFestivals.map(fest => {
            const countdown = getDaysRemainingText(fest.date);
            return (
              <div
                key={fest.id}
                onClick={() => onSelectFestival(fest)}
                className="group p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer bg-white flex flex-col justify-between relative overflow-hidden"
              >
                {/* Accent stripe */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: fest.color }}
                />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {fest.badge}
                        </span>
                        {fest.isOfficialHoliday && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            अवकाश
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {countdown}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {fest.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {fest.englishName}
                      </p>
                    </div>

                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: fest.color }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Date & Muhurat box */}
                  <div className="bg-slate-50 rounded-xl p-3 my-3 text-xs space-y-1.5 border border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Date:</span>
                      <span className="text-indigo-950 font-extrabold">{formatEnglishDate(fest.date)}</span>
                      <span className="text-slate-400 font-normal">({formatHindiDate(fest.date)})</span>
                    </div>
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-500">Tithi:</span> {fest.tithi}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-semibold text-slate-500">Time (समय):</span>
                      <span className="font-extrabold text-blue-900">{fest.shubhMuhurat}</span>
                    </div>
                  </div>

                  {/* Summary preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {fest.kyaHai}
                  </p>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <span className="font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
                    संपूर्ण विवरण देखें
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAI(`${fest.name} वर्ष ${year} में कब है, क्यों मनाते हैं और पूजा विधि क्या है?`);
                    }}
                    className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>AI से पूछें</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FestivalListView;
