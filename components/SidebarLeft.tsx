
import React, { useState } from 'react';
import { WeatherData, ForecastDay, WeatherInsight } from '../types.ts';

interface SidebarLeftProps {
  weather: WeatherData;
  forecast: ForecastDay[];
  insight: WeatherInsight;
  onSearch: (city: string) => void;
  onGeolocation: () => void;
  isSearching: boolean;
  canInstall?: boolean;
  onInstall?: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  weather, 
  forecast, 
  insight, 
  onSearch, 
  onGeolocation, 
  isSearching,
  canInstall,
  onInstall
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && !isSearching) {
      onSearch(searchValue.trim());
      setSearchValue('');
    }
  };

  return (
    <section className="flex flex-col w-full lg:w-[28%] h-full gap-5">
      {/* Search Header Area */}
      <div className="flex gap-2 items-stretch shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center glass-panel rounded-3xl p-2 flex-1 shadow-lg group focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
          <div className="flex items-center flex-1 px-3">
            <span className={`material-symbols-outlined text-primary mr-2 transition-all ${isSearching ? 'animate-spin scale-110' : 'group-hover:scale-110'}`}>
              {isSearching ? 'progress_activity' : 'search'}
            </span>
            <input 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={isSearching ? "Seeking..." : "Search City..."}
              disabled={isSearching}
              className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 w-full py-1.5 font-medium"
            />
          </div>
          <button 
            type="submit"
            className="p-2.5 hover:bg-white/10 rounded-2xl transition-all disabled:opacity-30 group/btn"
            disabled={isSearching}
          >
            <span className="material-symbols-outlined text-white/40 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all text-sm">arrow_forward</span>
          </button>
        </form>
        
        <button 
          onClick={onGeolocation}
          disabled={isSearching}
          title="Use my location"
          className="flex items-center justify-center aspect-square glass-panel rounded-3xl p-3 shadow-lg hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 group border border-white/10"
        >
          <span className={`material-symbols-outlined text-primary group-hover:text-white group-hover:scale-110 transition-all ${isSearching ? 'animate-pulse' : ''}`}>
            my_location
          </span>
        </button>
      </div>

      {/* Play Store Readiness Install Button */}
      {canInstall && (
        <button 
          onClick={onInstall}
          className="w-full bg-gradient-to-r from-primary to-blue-600 p-4 rounded-3xl flex items-center justify-between shadow-2xl animate-bounce-subtle hover:brightness-110 hover:scale-[1.02] transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-xl">download_for_offline</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Install Aether App</p>
              <p className="text-white/70 text-[10px]">Optimized for performance</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all relative z-10">chevron_right</span>
        </button>
      )}

      {/* Location Badge */}
      <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-2xl self-start hover:border-primary/30 transition-colors cursor-default">
        <span className="material-symbols-outlined text-primary text-[14px] fill-current animate-pulse">location_on</span>
        <h2 className="text-white text-[11px] font-bold tracking-[0.25em] uppercase text-glow">{weather.location}</h2>
      </div>

      {/* Time & Quote Card */}
      <div className="flex flex-col justify-center glass-panel rounded-[2rem] p-8 relative overflow-hidden group shrink-0 shadow-2xl border-t border-l border-white/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/30 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <p className="text-primary font-bold text-[11px] tracking-[0.3em] uppercase mb-4 opacity-80">{weather.date}</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h1 className="text-6xl font-extralight text-white tracking-tighter text-glow">
              {weather.time.split(' ')[0]}
            </h1>
            <span className="text-xl font-medium text-white/40 tracking-tight uppercase">
              {weather.time.split(' ')[1]}
            </span>
          </div>
          
          <div className="mt-8 pt-7 border-t border-white/10 relative">
             <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background-dark/80 px-4 py-0.5 rounded-full border border-white/5 text-[9px] uppercase font-black tracking-[0.2em] text-white/30">Vedic Insight</span>
            <p className="text-panchang-accent font-serif italic text-xl leading-relaxed mb-3 opacity-95 group-hover:text-white transition-colors duration-500">
              "{insight.quote}"
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-white/20"></div>
              <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase">
                {insight.meaning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="flex-1 glass-panel rounded-[2rem] p-6 flex flex-col overflow-hidden min-h-0 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-5 shrink-0 px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Weekly Outlook</h3>
          </div>
          <span className="size-1.5 rounded-full bg-primary/40 animate-pulse"></span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 -mr-3">
          <div className="flex flex-col gap-2">
            {forecast.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 glass-card rounded-2xl hover:bg-white/10 hover:scale-[1.01] hover:border-white/20 transition-all duration-300 group cursor-default">
                <span className="text-xs text-white/60 font-bold w-12 group-hover:text-white transition-colors">{item.day}</span>
                <div className="flex items-center gap-3 flex-1 justify-center">
                  <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-125 duration-500 ${
                    item.icon.includes('sunny') ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 
                    item.icon.includes('rain') ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest hidden sm:block">
                    {item.condition}
                  </span>
                </div>
                <div className="flex gap-4 text-xs w-20 justify-end">
                  <span className="text-white font-bold tabular-nums text-glow">{item.high}°</span>
                  <span className="text-white/30 tabular-nums">{item.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources Section */}
        {weather.sources && weather.sources.length > 0 && (
          <div className="mt-5 pt-5 border-t border-white/5 shrink-0 px-1">
            <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.25em] mb-3">Verified Grounding</p>
            <div className="flex flex-wrap gap-2">
              {weather.sources.slice(0, 3).map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-button px-3 py-1.5 rounded-full text-[10px] text-primary/80 hover:text-white font-bold flex items-center gap-1.5 transition-all truncate max-w-[130px]"
                >
                  <span className="material-symbols-outlined text-[12px]">link</span>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
