
import React, { useState } from 'react';
import { WeatherData, ForecastDay, WeatherInsight } from '../types.ts';

interface SidebarLeftProps {
  weather: WeatherData;
  forecast: ForecastDay[];
  insight: WeatherInsight;
  onSearch: (city: string) => void;
  onGeolocation: () => void;
  isSearching: boolean;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ 
  weather, 
  forecast, 
  insight, 
  onSearch, 
  onGeolocation, 
  isSearching 
}) => {
  const [val, setVal] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim() && !isSearching) {
      onSearch(val.trim());
      setVal('');
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex gap-2">
        <form onSubmit={submit} className="flex-1 glass-panel rounded-2xl p-1.5 flex items-center group">
          <span className="material-symbols-outlined text-primary ml-2 text-xl">
            {isSearching ? 'progress_activity' : 'search'}
          </span>
          <input 
            type="text" 
            value={val} 
            onChange={(e) => setVal(e.target.value)} 
            placeholder="Search..." 
            className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 w-full font-medium"
          />
        </form>
        <button onClick={onGeolocation} className="size-11 glass-panel rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      <div className="glass-panel rounded-[2rem] p-6 relative overflow-hidden flex flex-col shrink-0">
        <p className="text-primary font-bold text-[10px] tracking-widest uppercase mb-1 opacity-70">{weather.date}</p>
        <div className="flex items-baseline gap-2">
          <h1 className="text-5xl font-light tracking-tighter text-white text-glow">
            {weather.time.split(' ')[0]}
          </h1>
          <span className="text-sm font-bold text-white/20 uppercase">{weather.time.split(' ')[1]}</span>
        </div>
        
        <div className="mt-5 pt-5 border-t border-white/5">
          <p className="text-panchang-accent font-serif italic text-[15px] leading-relaxed mb-1.5 line-clamp-2">
            "{insight.quote}"
          </p>
          <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">
            {insight.meaning}
          </p>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-[2rem] p-5 flex flex-col overflow-hidden">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 px-1">Weekly Outlook</h3>
        <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
          {forecast.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 glass-card rounded-xl hover:bg-white/5 transition-all">
              <span className="text-[11px] text-white/40 font-bold w-10 uppercase">{item.day}</span>
              <span className={`material-symbols-outlined text-xl ${item.icon.includes('sun') ? 'text-yellow-400' : 'text-blue-400'}`}>
                {item.icon}
              </span>
              <div className="flex gap-3 text-[11px] w-14 justify-end tabular-nums font-bold">
                <span className="text-white">{item.high}°</span>
                <span className="text-white/20">{item.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
