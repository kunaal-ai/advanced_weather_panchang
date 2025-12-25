
import React from 'react';
import { WeatherData, HourlyForecast } from '../types.ts';

interface WeatherHeroProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
  unit: 'F' | 'C';
  onToggleUnit: () => void;
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, hourly, unit, onToggleUnit }) => {
  const icon = weather?.icon || 'cloud';
  const isSunny = icon === 'sunny';
  
  return (
    <div className="flex flex-col gap-5 h-full min-h-[550px] lg:min-h-0">
      {/* Main Weather Card */}
      <div className="flex-[3] glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden min-h-0">
        <div className={`absolute -top-24 -left-24 size-80 rounded-full blur-[100px] pointer-events-none opacity-20 ${isSunny ? 'bg-yellow-400' : 'bg-primary'}`}></div>
        
        {/* Header */}
        <div className="w-full flex justify-between items-start z-20 shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
            <h3 className="text-lg font-black text-[var(--text-color)] tracking-tight uppercase italic truncate">
              {weather.location || 'Unknown'}
            </h3>
          </div>
          <button 
            onClick={onToggleUnit}
            className="flex items-center gap-1 glass-card rounded-full p-1 border border-[var(--glass-border)] shrink-0"
          >
            <div className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${unit === 'F' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)]'}`}>F</div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${unit === 'C' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)]'}`}>C</div>
          </button>
        </div>

        {/* Center Visual */}
        <div className="relative z-10 flex flex-col items-center justify-center py-6 flex-1 min-h-0 w-full">
          <div className="relative mb-4 shrink-0">
            <div className={`absolute inset-0 rounded-full blur-3xl scale-125 opacity-30 ${isSunny ? 'bg-yellow-400' : 'bg-primary'}`}></div>
            <div className="size-32 md:size-40 glass-card rounded-full flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xl relative">
               <span className="material-symbols-outlined text-7xl md:text-8xl text-primary leading-none">
                 {icon}
               </span>
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0 w-full">
            <div className="flex items-start">
              <h1 className="text-[5rem] md:text-[6.5rem] font-light leading-none tracking-tighter text-[var(--text-color)]">
                {weather.temp ?? '--'}
              </h1>
              <span className="text-3xl text-[var(--text-muted)] mt-2">°</span>
            </div>
            <h2 className="text-sm md:text-base font-black text-[var(--text-color)] uppercase tracking-[0.2em] italic opacity-90 truncate w-full text-center px-4">
              {weather.condition || 'Atmospheric Syncing'}
            </h2>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="w-full grid grid-cols-2 gap-3 z-20 shrink-0 mt-6">
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
             <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-lg">thermostat</span>
             </div>
             <div className="min-w-0">
                <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-none mb-1">Feels Like</p>
                <p className="text-sm font-bold text-[var(--text-color)] truncate">{weather.feelsLike ?? '--'}°</p>
             </div>
          </div>
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
             <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-lg">air</span>
             </div>
             <div className="min-w-0">
                <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-none mb-1">Wind Speed</p>
                <p className="text-sm font-bold text-[var(--text-color)] truncate">{weather.wind || '--'}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Hourly Section */}
      <div className="glass-panel rounded-[2rem] p-5 shadow-2xl flex flex-col shrink-0 lg:flex-1 min-h-[160px]">
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 px-1">Hourly Forecast</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar flex-1">
          {(hourly || []).map((item, idx) => (
            <div key={idx} className={`min-w-[75px] flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all ${
              item.time === 'Now' ? 'bg-primary/20 border border-primary/40' : 'glass-card'
            }`}>
              <span className="text-[9px] font-bold uppercase tracking-tighter text-[var(--text-muted)]">
                {item.time}
              </span>
              <span className="material-symbols-outlined text-xl text-primary">
                {item.icon}
              </span>
              <span className="text-sm font-black text-[var(--text-color)]">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
