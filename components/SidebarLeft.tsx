
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
          console.error("Suggestion Error", e);
          setSuggestions([]);
        } finally {
          setIsSuggesting(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setIsSuggesting(false);
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

  const formatCitation = (meaning: string) => {
    if (!meaning) return "BHAGWAD GITA";
    const parts = meaning.match(/(\d+)\D+(\d+)/);
    if (parts) {
      return `BHAGWAD GITA C${parts[1]}-V${parts[2]}`;
    }
    const singleNumber = meaning.match(/(\d+)/);
    if (singleNumber && !meaning.includes('C')) {
       return `BHAGWAD GITA ${meaning.toUpperCase()}`;
    }
    return meaning.toUpperCase().includes('GITA') ? meaning.toUpperCase() : `BHAGWAD GITA ${meaning.toUpperCase()}`;
  };

  return (
    <div className="flex flex-col gap-5 h-full overflow-hidden">
      {/* Search Header */}
      <div className="relative shrink-0">
        <div className="flex gap-2">
          <form onSubmit={submit} className="flex-1 glass-panel rounded-2xl p-1.5 flex items-center group relative overflow-hidden">
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

        {(suggestions?.length ?? 0) > 0 && !isSearching && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl overflow-hidden shadow-2xl z-[100] border border-[var(--glass-border)] animate-in slide-in-from-top-2 duration-200">
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
                 {weather.time?.split(' ')[0] ?? '--:--'}
               </h1>
               <span className="text-xs font-black text-[var(--text-muted)] uppercase">{weather.time?.split(' ')[1] ?? ''}</span>
             </div>
          </div>
          <div className="p-2 glass-card rounded-xl border-primary/10">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
          </div>
        </div>
      </div>

      {/* Spiritual Essence Card - Optimized to fit text without scroll */}
      <div className="flex-[2] glass-panel rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden flex flex-col border-l-4 border-l-panchang-accent/40 shadow-xl transition-all duration-500">
        <div className="relative z-10 flex flex-col h-full items-center">
          <div className="w-full flex items-center gap-2 mb-4 opacity-60 shrink-0">
            <span className="material-symbols-outlined text-panchang-accent text-sm">auto_awesome</span>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Spiritual Essence</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center w-full px-2">
            <p className="text-panchang-accent font-serif italic text-[15px] sm:text-[16px] md:text-[18px] lg:text-[19px] leading-relaxed text-center">
              "{insight?.quote?.replace(/"/g, '') ?? 'Perform your prescribed duties, for action is better than inaction.'}"
            </p>
            
            {/* Simple Line Divider */}
            <div className="w-full flex items-center justify-center my-6 shrink-0">
              <div className="h-[1px] w-1/4 bg-panchang-accent/10"></div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center pt-2 shrink-0">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
              {formatCitation(insight?.meaning)}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Outlook - Shrinked */}
      <div className="shrink-0 h-[190px] glass-panel rounded-[2rem] p-5 flex flex-col overflow-hidden">
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 px-1 shrink-0">Weekly Outlook</h3>
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
          {(forecast || []).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 glass-card rounded-xl hover:bg-primary/5 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-bold w-10 uppercase">{item.day}</span>
              <span className={`material-symbols-outlined text-lg ${(item.icon || '').includes('sun') ? 'text-yellow-400' : 'text-blue-400'}`}>
                {item.icon || 'cloud'}
              </span>
              <div className="flex gap-3 text-[11px] w-14 justify-end tabular-nums font-bold">
                <span className="text-[var(--text-color)]">{item.high}°</span>
                <span className="text-[var(--text-muted)] opacity-40">{item.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
