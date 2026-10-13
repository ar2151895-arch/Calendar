import React, { useState } from 'react';
import { Festival } from '../types';
import { getDaysRemainingText } from '../utils/panchangUtils';
import { formatEnglishDate, formatHindiDate } from '../utils/festivalDatabase';
import { 
  X, 
  Calendar, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Share2, 
  Clock, 
  BookOpen, 
  Flame,
  HelpCircle
} from 'lucide-react';

interface FestivalModalProps {
  festival: Festival | null;
  onClose: () => void;
  onAskAI: (query: string) => void;
  onAddEventForDate: (dateStr: string) => void;
}

const FestivalModal: React.FC<FestivalModalProps> = ({ 
  festival, 
  onClose, 
  onAskAI,
  onAddEventForDate 
}) => {
  const [activeTab, setActiveTab] = useState<'kyaHai' | 'kabHai' | 'kabNahin' | 'vidhi'>('kyaHai');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!festival) return null;

  const countdownText = getDaysRemainingText(festival.date);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();
      const textToRead = `${festival.name}. कब है: ${festival.kabHai}. क्या है: ${festival.kyaHai}. क्यों मनाते हैं: ${festival.kyunManateHain}. कब नहीं है: ${festival.kabNahin}. शुभ मुहूर्त: ${festival.shubhMuhurat}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    const summary = `${festival.name} (${festival.englishName})\nतारीख: ${festival.kabHai}\nतिथि: ${festival.tithi}\nशुभ मुहूर्त: ${festival.shubhMuhurat}\n\nक्या है:\n${festival.kyaHai}\n\nकब नहीं है:\n${festival.kabNahin}\n\n(Vishwa Calendar AI)`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with festive banner */}
        <div 
          className="relative px-6 py-5 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${festival.color} 0%, #1e1b4b 100%)` 
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm tracking-wide">
                  {festival.badge}
                </span>
                {festival.isOfficialHoliday && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/80 backdrop-blur-sm">
                    सरकारी अवकाश (Gazetted Holiday)
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950">
                  {countdownText}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                {festival.name}
              </h2>
              <p className="text-sm text-white/80 font-medium">
                {festival.englishName} &bull; {festival.tithi}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                title={isPlayingAudio ? "आवाज बंद करें" : "विवरण सुनें (Listen in Hindi)"}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm"
              >
                {isPlayingAudio ? <VolumeX className="w-5 h-5 text-amber-300 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handleCopy}
                title="विवरण कॉपी करें"
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose} 
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {copied && (
            <div className="absolute bottom-2 right-6 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-md animate-in fade-in">
              कॉपी हो गया! (Copied)
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('kyaHai')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'kyaHai'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            क्या है & क्यों मनाते हैं?
          </button>
          <button
            onClick={() => setActiveTab('kabHai')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'kabHai'
                ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            कब है & शुभ मुहूर्त
          </button>
          <button
            onClick={() => setActiveTab('kabNahin')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'kabNahin'
                ? 'bg-white text-rose-700 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            कब नहीं है & सावधानियां
          </button>
          <button
            onClick={() => setActiveTab('vidhi')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vidhi'
                ? 'bg-white text-amber-700 border-t-2 border-amber-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            पूजा विधि व नियम
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'kyaHai' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-base mb-1.5">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  यह त्यौहार क्या है? (What is this festival?)
                </div>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  {festival.kyaHai}
                </p>
              </div>

              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-base mb-1.5">
                  <Flame className="w-5 h-5 text-amber-600" />
                  यह क्यों मनाया जाता है? (Significance & Mythological Story)
                </div>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  {festival.kyunManateHain}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'kabHai' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Date & Day (तारीख व दिन)
                  </div>
                  <div className="text-lg font-extrabold text-emerald-950 mt-1">
                    {formatEnglishDate(festival.date)}
                  </div>
                  <div className="text-xs font-semibold text-emerald-800">
                    {formatHindiDate(festival.date)}
                  </div>
                  <div className="text-xs font-medium text-emerald-700 mt-1">
                    Tithi: {festival.tithi}
                  </div>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Time & Shubh Muhurat (शुभ समय व मुहूर्त)
                  </div>
                  <div className="text-base font-extrabold text-blue-950 mt-1">
                    {festival.shubhMuhurat}
                  </div>
                  <div className="text-xs font-medium text-blue-700 mt-1">
                    English 12-Hour Time Format (IST)
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="text-sm font-bold text-slate-800 mb-2">
                  तारीख की गणना (Calendar Calculation)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  विश्व कैलेंडर के अनुसार यह गणना सूर्य सिद्धांत एवं दृश्य पंचांग के आधार पर की गई है। स्थानीय सूर्योदय के अनुसार मुहूर्त में कुछ मिनटों का अंतर हो सकता है।
                </p>
              </div>
            </div>
          )}

          {activeTab === 'kabNahin' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-base mb-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  कब नहीं है? (When is it NOT / Misconceptions & Prohibitions)
                </div>
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  {festival.kabNahin}
                </p>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  मुख्य सावधानियां:
                </div>
                <p>&bull; भद्रा काल अथवा राहुकाल में कोई भी मांगलिक पूजन आरंभ न करें।</p>
                <p>&bull; सूतक या पातक के दिनों में केवल मानसिक नाम जप करें, मूर्तियों का स्पर्श न करें।</p>
                <p>&bull; यदि तिथि दो दिनों में बंट रही हो, तो उदयातिथि अथवा प्रदोष काल की प्रधानता के शास्त्र सम्मत नियमों का पालन करें।</p>
              </div>
            </div>
          )}

          {activeTab === 'vidhi' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-base mb-2">
                  <Flame className="w-5 h-5 text-amber-600" />
                  पूजा विधि, क्या करें और क्या न करें
                </div>
                <div className="text-slate-800 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {festival.vidhiAndDoDont}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAddEventForDate(festival.date);
              }}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              + इस दिन अपना कार्यक्रम जोड़ें
            </button>
            <button
              onClick={() => {
                onClose();
                onAskAI(`${festival.name} के बारे में और बताएं - शुभ मुहूर्त, पूजा विधि और कथा क्या है?`);
              }}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              AI से पूछें
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all ml-auto"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

export default FestivalModal;
