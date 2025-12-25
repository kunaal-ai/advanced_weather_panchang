
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
    const trimmed = val.trim();
    if (trimmed.length > 2) {
      if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current);
      suggestionTimeout.current = window.setTimeout(async () => {
        setIsSuggesting(true);
        try {
          const results = await getCitySuggestions(trimmed);
          setSuggestions(Array.isArray(results) ? results : []);
        } catch (e) {
          setSuggestions([]);
        } finally {
          setIsSuggesting(false);
        }
      }, 400);
    } else {
      setSuggestions([]);
      setIsSuggesting(false);
    }
  }, [val]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim() && !isSearching) {
      onSearch(val.trim());
      setVal('');
      setSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full overflow-hidden">
      {/* Search Header */}
      <div className="relative shrink-0">
        <div className="flex gap-2">
          <form onSubmit={submit} className="flex-1 glass-panel rounded-2xl p-1 flex items-center group relative h-11 border border-white/5 focus-within:border-primary/50 transition-all">
            <span className={`material-symbols-outlined text-primary ml-2 text-xl ${isSearching ? 'animate-spin' : ''}`}>
              {isSearching ? 'progress_activity' : 'search'}
            </span>
            <input 
              type="text" 
              value={val} 
              onChange={(e) => setVal(e.target.value)} 
              placeholder="Search city..." 
              className="bg-transparent border-none focus:ring-0 text-xs text-[var(--text-color)] placeholder:text-[var(--text-muted)] w-full font-bold ml-1"
            />
            {isSuggesting && <span className="material-symbols-outlined text-xs animate-spin text-primary mr-2">sync</span>}
          </form>
          <button onClick={onGeolocation} className="size-11 glass-panel rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">
            <span className="material-symbols-outlined text-xl">my_location</span>
          </button>
          <button onClick={onOpenSettings} className="size-11 glass-panel rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-primary transition-all">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>

        {suggestions.length > 0 && !isSearching && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl overflow-hidden shadow-2xl z-[100] border border-[var(--glass-border)] animate-in slide-in-from-top-1 duration-200">
            {suggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => { onSearch(city); setVal(''); setSuggestions([]); }}
                className="w-full text-left px-4 py-3 text-[10px] font-black text-[var(--text-color)] hover:bg-primary/10 hover:text-primary flex items-center gap-3 border-b border-white/5 last:border-0 uppercase tracking-widest transition-colors"
              >
                <span className="material-symbols-outlined text-xs opacity-50">location_on</span>
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time Card */}
      <div className="glass-panel rounded-[2rem] p-6 shrink-0 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
             <p className="text-primary font-black text-[9px] tracking-[0.3em] uppercase mb-1 opacity-70">
               {weather?.date || 'Syncing...'}
             </p>
             <div className="flex items-baseline gap-1.5">
               <h1 className="text-4xl font-light tracking-tighter text-[var(--text-color)] leading-none">
                 {weather?.time?.split(' ')[0] ?? '--:--'}
               </h1>
               <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-tighter">{weather?.time?.split(' ')[1] ?? ''}</span>
             </div>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl opacity-30">schedule</span>
        </div>
      </div>

      {/* Simplified Spiritual Essence Card */}
      <div className="flex-grow glass-panel rounded-[3rem] p-8 relative overflow-hidden flex flex-col border-l-4 border-l-panchang-accent/40 shadow-xl min-h-[120px]">
        <div className="flex items-center gap-2 mb-4 opacity-50 shrink-0">
          <span className="material-symbols-outlined text-panchang-accent text-sm">auto_awesome</span>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Bhagavad Gita</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0">
          <p className="text-panchang-accent font-serif italic text-base md:text-lg leading-relaxed text-center line-clamp-5 px-2">
            "{insight?.quote?.replace(/"/g, '') || 'Live your life without attachment to results.'}"
          </p>
          <div className="w-10 h-[1px] bg-panchang-accent/20 my-6 shrink-0"></div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[var(--text-muted)] opacity-50">VEDA</p>
        </div>
      </div>

      {/* Cleaned Weekly Outlook */}
      <div className="glass-panel rounded-[2rem] p-6 flex flex-col shrink-0 min-h-[180px] shadow-lg">
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] mb-5 px-1">Weekly Outlook</h3>
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
          {(forecast || []).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 glass-card rounded-xl border border-white/5 hover:bg-white/5 transition-all group">
              <span className="text-[11px] text-[var(--text-muted)] font-black w-10 uppercase tracking-tighter group-hover:text-primary transition-colors">
                {(item.day || '').substring(0, 3).toUpperCase()}
              </span>
              <span className="material-symbols-outlined text-2xl text-primary opacity-80">
                {item.icon}
              </span>
              <div className="flex gap-3 text-[11px] w-14 justify-end font-black">
                <span className="text-[var(--text-color)]">{item.high}°</span>
                <span className="text-[var(--text-muted)] opacity-30">{item.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
