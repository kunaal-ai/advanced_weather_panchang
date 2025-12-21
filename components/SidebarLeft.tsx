
import React, { useState } from 'react';
import { WeatherData, ForecastDay, WeatherInsight } from '../types';

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
        <form onSubmit={handleSubmit} className="flex items-center glass-panel rounded-2xl p-2 flex-1 shadow-lg group focus-within:border-primary/50 transition-all">
          <div className="flex items-center flex-1 px-2">
            <span className={`material-symbols-outlined text-primary mr-2 transition-transform ${isSearching ? 'animate-spin' : ''}`}>
              {isSearching ? 'progress_activity' : 'search'}
            </span>
            <input 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={isSearching ? "Searching..." : "Search City..."}
              disabled={isSearching}
              className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/30 w-full py-1 font-medium"
            />
          </div>
          <button 
            type="submit"
            className="p-2 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
            disabled={isSearching}
          >
            <span className="material-symbols-outlined text-white/60 text-sm">arrow_forward</span>
          </button>
        </form>
        
        <button 
          onClick={onGeolocation}
          disabled={isSearching}
          title="Use my location"
          className="flex items-center justify-center aspect-square glass-panel rounded-2xl p-3 shadow-lg hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 group border border-white/5"
        >
          <span className={`material-symbols-outlined text-primary group-hover:text-white transition-colors ${isSearching ? 'animate-pulse' : ''}`}>
            my_location
          </span>
        </button>
      </div>

      {/* Play Store Readiness Install Button */}
      {canInstall && (
        <button 
          onClick={onInstall}
          className="w-full bg-gradient-to-r from-primary to-blue-600 p-4 rounded-2xl flex items-center justify-between shadow-xl animate-bounce-subtle hover:brightness-110 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white">download_for_offline</span>
            <div className="text-left">
              <p className="text-white font-bold text-xs uppercase tracking-tighter">Install Native App</p>
              <p className="text-white/70 text-[10px]">Faster access & offline support</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-white/40 group-hover:text-white">chevron_right</span>
        </button>
      )}

      {/* Location Badge */}
      <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl self-start">
        <span className="material-symbols-outlined text-primary text-xs fill-current">location_on</span>
        <h2 className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">{weather.location}</h2>
      </div>

      {/* Time & Quote Card */}
      <div className="flex flex-col justify-center glass-panel rounded-2xl p-8 relative overflow-hidden group shrink-0 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/30 transition-colors duration-700"></div>
        <div className="relative z-10">
          <p className="text-primary font-semibold text-xs tracking-[0.25em] uppercase mb-3">{weather.date}</p>
          <h1 className="text-6xl font-light text-white mb-2 tracking-tighter">
            {weather.time.split(' ')[0]} 
            <span className="text-xl font-medium text-white/50 align-top mt-1 ml-1 inline-block">
              {weather.time.split(' ')[1]}
            </span>
          </h1>
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-panchang-accent font-serif italic text-lg leading-relaxed mb-2 opacity-90">
              "{insight.quote}"
            </p>
            <p className="text-white/50 text-xs font-light leading-relaxed">
              {insight.meaning}
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="flex-1 glass-panel rounded-2xl p-5 flex flex-col overflow-hidden min-h-0 shadow-lg">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-sm font-bold text-white tracking-wide">7-Day Forecast</h3>
          <span className="material-symbols-outlined text-white/40 text-sm">calendar_month</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
          <div className="flex flex-col gap-1">
            {forecast.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors group cursor-default">
                <span className="text-xs text-white/90 font-medium w-12">{item.day}</span>
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <span className={`material-symbols-outlined text-lg ${
                    item.icon.includes('sunny') ? 'text-yellow-400' : 
                    item.icon.includes('rain') ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider hidden sm:block">
                    {item.condition}
                  </span>
                </div>
                <div className="flex gap-3 text-xs w-16 justify-end">
                  <span className="text-white font-bold">{item.high}°</span>
                  <span className="text-white/40">{item.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources Section (Mandatory for Grounding) */}
        {weather.sources && weather.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
            <p className="text-[9px] uppercase font-bold text-white/40 tracking-[0.2em] mb-2">Sources</p>
            <div className="flex flex-wrap gap-2">
              {weather.sources.slice(0, 3).map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:text-white transition-colors underline truncate max-w-[120px]"
                >
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
