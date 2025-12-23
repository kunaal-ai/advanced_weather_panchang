
import React, { useState, useEffect, useRef } from 'react';
import { WeatherData, ForecastDay, WeatherInsight } from '../types.ts';
import { getCitySuggestions } from '../services/geminiService.ts';

interface SidebarLeftProps {
  weather: WeatherData;
  forecast: ForecastDay[];
  insight: WeatherInsight;
  onSearch: (city: string) => void;
  onGeolocation: () => void;
  isSearching: boolean;
  unit: 'F' | 'C';
  onOpenSettings: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  weather, 
  forecast, 
  insight, 
  onSearch, 
  onGeolocation, 
  isSearching,
  onOpenSettings
}) => {
  const [val, setVal] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const suggestionTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (val.trim().length > 2) {
      if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current);
      suggestionTimeout.current = window.setTimeout(async () => {
        setIsSuggesting(true);
        const results = await getCitySuggestions(val.trim());
        setSuggestions(results);
        setIsSuggesting(false);
      }, 600);
    } else {
      setSuggestions([]);
    }
    return () => { if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current); };
  }, [val]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim() && !isSearching) {
      onSearch(val.trim());
      setVal('');
      setSuggestions([]);
    }
  };

  const selectSuggestion = (city: string) => {
    onSearch(city);
    setVal('');
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col gap-5 h-full overflow-hidden">
      {/* Search Header */}
      <div className="relative shrink-0">
        <div className="flex gap-2">
          <form onSubmit={submit} className="flex-1 glass-panel rounded-2xl p-1.5 flex items-center group relative overflow-hidden">
            {isSearching && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/20 overflow-hidden">
                <div className="h-full bg-primary animate-[shimmer_1.5s_infinite] w-1/3"></div>
              </div>
            )}
            <span className={`material-symbols-outlined text-primary ml-2 text-xl ${isSearching ? 'animate-spin' : ''}`}>
              {isSearching ? 'progress_activity' : 'search'}
            </span>
            <input 
              type="text" 
              value={val} 
              onChange={(e) => setVal(e.target.value)} 
              placeholder="Search city..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-[var(--text-color)] placeholder:text-[var(--text-muted)] w-full font-medium"
            />
            {isSuggesting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            )}
          </form>
          <button onClick={onGeolocation} className="size-11 glass-panel rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
            <span className="material-symbols-outlined">my_location</span>
          </button>
          <button onClick={onOpenSettings} className="size-11 glass-panel rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-primary transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        {suggestions.length > 0 && !isSearching && (
          <div className="absolute top-full left-0 right-14 mt-2 glass-panel rounded-2xl overflow-hidden shadow-2xl z-[100] border border-[var(--glass-border)] animate-in slide-in-from-top-2 duration-200">
            {suggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => selectSuggestion(city)}
                className="w-full text-left px-5 py-3 text-xs font-bold text-[var(--text-color)] hover:bg-primary/10 hover:text-primary flex items-center gap-3 border-b border-[var(--glass-border)] last:border-0 transition-colors"
              >
                <span className="material-symbols-outlined text-sm opacity-50">location_on</span>
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time Card - Compact */}
      <div className="glass-panel rounded-[2rem] p-5 relative overflow-hidden flex flex-col shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
             <p className="text-primary font-black text-[9px] tracking-[0.2em] uppercase mb-1 opacity-70 leading-none">
               {weather.date}
             </p>
             <div className="flex items-baseline gap-2">
               <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-[var(--text-color)] text-glow leading-none">
                 {weather.time.split(' ')[0]}
               </h1>
               <span className="text-xs font-black text-[var(--text-muted)] uppercase">{weather.time.split(' ')[1]}</span>
             </div>
          </div>
          <div className="p-2 glass-card rounded-xl border-primary/10">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
          </div>
        </div>
      </div>

      {/* Gita Insight Card - Expanded (Reclaimed Space) */}
      <div className="flex-1 glass-panel rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col justify-center min-h-[160px] border-l-4 border-l-panchang-accent/40 shadow-xl group">
        <div className="absolute -top-10 -right-10 size-32 bg-panchang-accent/5 rounded-full blur-3xl group-hover:bg-panchang-accent/10 transition-all duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-60">
            <span className="material-symbols-outlined text-panchang-accent text-sm">auto_awesome</span>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Spiritual Insight</p>
          </div>
          
          <p className="text-panchang-accent font-serif italic text-[18px] md:text-[20px] lg:text-[22px] leading-snug mb-4 drop-shadow-sm">
            "{insight.quote}"
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
            <p className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest">
              {insight.meaning}
            </p>
            <span className="material-symbols-outlined text-panchang-accent/20 text-xl">menu_book</span>
          </div>
        </div>
      </div>

      {/* Weekly Outlook - Compact */}
      <div className="shrink-0 h-[280px] glass-panel rounded-[2rem] p-5 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Weekly Outlook</h3>
          <span className="text-[8px] text-primary/40 font-bold uppercase tracking-widest">7 Day Cycle</span>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
          {forecast.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 glass-card rounded-xl hover:bg-primary/5 transition-all group">
              <span className="text-[10px] text-[var(--text-muted)] font-bold w-10 uppercase group-hover:text-primary transition-colors">{item.day}</span>
              <span className={`material-symbols-outlined text-lg ${item.icon.includes('sun') ? 'text-yellow-400' : 'text-blue-400'}`}>
                {item.icon}
              </span>
              <div className="flex gap-3 text-[11px] w-14 justify-end tabular-nums font-bold">
                <span className="text-[var(--text-color)]">{item.high}°</span>
                <span className="text-[var(--text-muted)] opacity-40">{item.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grounding Sources - MUST display as per Gemini SDK guidelines */}
      {weather.sources && weather.sources.length > 0 && (
        <div className="shrink-0 glass-panel rounded-2xl p-4 flex flex-col gap-2 border-t border-primary/20 bg-primary/5 overflow-hidden">
          <h4 className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">travel_explore</span> Sources
          </h4>
          <div className="flex flex-col gap-1.5">
            {weather.sources.slice(0, 3).map((s, i) => (
              <a 
                key={i} 
                href={s.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[9px] text-primary hover:underline truncate max-w-full font-bold flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-[10px]">link</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
