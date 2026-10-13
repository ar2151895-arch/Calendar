import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Sparkles, X, Send, Bot, User, Trash2 } from 'lucide-react';

interface ChatBotProps {
  currentMonthName: string;
  currentYear: number;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const QUICK_PROMPTS = [
  'दिवाली कब है और शुभ मुहूर्त क्या है?',
  'होली क्यों मनाते हैं?',
  'छठ पूजा के चार नियम क्या हैं?',
  '2027 में प्रमुख त्यौहार कब हैं?',
  'करवा चौथ की पूजा विधि बताएं'
];

const ChatBot: React.FC<ChatBotProps> = ({ 
  currentMonthName, 
  currentYear,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: `नमस्ते! मैं आपका विश्व कैलेंडर एआई सहायक हूँ। आप मुझसे किसी भी वर्ष (जैसे ${currentYear}, 2025, 2027 या किसी भी साल) के त्यौहार जैसे दिवाली, होली, छठ, ईद आदि के बारे में पूछ सकते हैं - "कब है, कब नहीं है, और क्या है!"`, 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle external trigger (e.g. from FestivalModal)
  useEffect(() => {
    if (initialPrompt) {
      setIsOpen(true);
      handleSendWithText(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSendWithText = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = `User is viewing calendar for ${currentMonthName} ${currentYear}. Target year is ${currentYear}.`;
    const responseText = await geminiService.sendMessage(textToSend, context, currentYear);

    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleSend = () => {
    handleSendWithText(input);
  };

  const handleClear = () => {
    setMessages([
      { 
        role: 'model', 
        text: `नमस्ते! बातचीत रीसेट हो गई है। वर्ष ${currentYear} या किसी भी वर्ष के त्यौहार के बारे में पूछें।`, 
        timestamp: new Date() 
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[420px] h-[550px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">त्यौहार व कैलेंडर AI</h3>
                <p className="text-[11px] text-indigo-200">सटीक तिथियां &bull; महत्व &bull; मुहूर्त</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleClear} 
                title="चैट साफ करें"
                className="hover:bg-white/10 p-2 rounded-xl transition-colors text-indigo-200 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-2 rounded-xl transition-colors text-indigo-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendWithText(prompt)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-[11px] font-semibold whitespace-nowrap shadow-xs transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 font-normal'
                }`}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">गणना कर रहे हैं...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 flex gap-2 bg-white">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="पूछें: 2026 में दिवाली कब है, क्यों मनाते हैं..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-slate-50 focus:bg-white"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 shadow-md flex items-center justify-center"
              title="भेजें"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-2xl shadow-xl flex items-center justify-center text-white hover:brightness-110 transition-all hover:scale-105 active:scale-95 ring-4 ring-indigo-100"
        title="AI पंचांग व त्यौहार सहायक खोलें"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="relative">
            <Sparkles className="w-7 h-7 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-600 animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
