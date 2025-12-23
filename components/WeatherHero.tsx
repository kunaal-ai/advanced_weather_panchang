
import React from 'react';
import { WeatherData, HourlyForecast } from '../types.ts';

interface WeatherHeroProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
  unit: 'F' | 'C';
  onToggleUnit: () => void;
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, hourly, unit, onToggleUnit }) => {
  const isSunny = weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear');
  const isRainy = weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('storm');
  
  return (
    <div className="flex flex-col gap-5 h-full overflow-hidden">
      {/* Main Weather Card */}
      <div className="flex-[3] glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden group min-h-0">
        <div className={`absolute -top-24 -left-24 size-80 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-1000 ${isSunny ? 'bg-yellow-400' : isRainy ? 'bg-blue-600' : 'bg-primary'}`}></div>
        <div className={`absolute -bottom-24 -right-24 size-80 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-1000 ${isSunny ? 'bg-orange-400' : 'bg-primary'}`}></div>
        
        {/* Header */}
        <div className="w-full flex justify-between items-start z-20 shrink-0">
          <div className="flex flex-col min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">location_on</span>
              <h3 className="text-lg md:text-xl font-black text-[var(--text-color)] tracking-tight uppercase italic truncate">
                {weather.location}
              </h3>
            </div>
            <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] ml-7">Atmospheric Hub</p>
          </div>
          
          <button 
            onClick={onToggleUnit}
            className="flex items-center gap-1 glass-card rounded-full p-1 border border-[var(--glass-border)] hover:border-primary/50 transition-colors shrink-0"
          >
            <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] font-black transition-all ${unit === 'F' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)]'}`}>F</div>
            <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] font-black transition-all ${unit === 'C' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)]'}`}>C</div>
          </button>
        </div>

        {/* Center Visual */}
        <div className="relative z-10 flex flex-col items-center justify-center py-2 flex-1 min-h-0 w-full overflow-hidden">
          <div className="relative group/icon mb-2 shrink-0">
            <div className={`absolute inset-0 rounded-full blur-3xl scale-125 transition-all duration-1000 opacity-40 animate-pulse ${isSunny ? 'bg-yellow-400/30' : 'bg-primary/20'}`}></div>
            <div className="size-24 md:size-40 lg:size-44 glass-card rounded-full flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
               <div className="absolute inset-2 border border-white/5 rounded-full border-dashed animate-[spin_30s_linear_infinite]"></div>
               <span className={`material-symbols-outlined text-5xl md:text-7xl lg:text-8xl transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${isSunny ? 'text-yellow-400' : 'text-primary'}`}>
                 {weather.icon || 'cloud'}
               </span>
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0 w-full">
            <div className="flex items-start">
              <h1 className="text-[4rem] md:text-[6rem] lg:text-[8rem] font-light leading-none tracking-tighter text-[var(--text-color)] text-glow">
                {weather.temp}
              </h1>
              <span className="text-xl md:text-3xl lg:text-4xl text-[var(--text-muted)] mt-1 md:mt-3">°</span>
            </div>
            <div className="w-full px-4 text-center mt-1">
              <h2 className="text-sm md:text-lg lg:text-xl font-black text-[var(--text-color)] uppercase tracking-[0.2em] italic opacity-90 truncate leading-tight">
                {weather.condition}
              </h2>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="w-full grid grid-cols-2 gap-3 z-20 shrink-0 mt-4">
          <div className="glass-card rounded-2xl p-3 md:p-4 flex items-center gap-3">
             <div className="size-8 md:size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-base md:text-lg">thermostat</span>
             </div>
             <div className="min-w-0">
                <p className="text-[7px] md:text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-none mb-1 truncate">Feels Like</p>
                <p className="text-xs md:text-sm font-bold text-[var(--text-color)] truncate">{weather.feelsLike}° {unit}</p>
             </div>
          </div>
          <div className="glass-card rounded-2xl p-3 md:p-4 flex items-center gap-3">
             <div className="size-8 md:size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-base md:text-lg">air</span>
             </div>
             <div className="min-w-0">
                <p className="text-[7px] md:text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-none mb-1 truncate">Wind Speed</p>
                <p className="text-xs md:text-sm font-bold text-[var(--text-color)] truncate">{weather.wind || '8 mph'}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Hourly Section */}
      <div className="glass-panel rounded-[2rem] p-4 lg:p-5 shadow-2xl flex flex-col shrink-0 lg:flex-1 min-h-0">
        <div className="flex items-center justify-between mb-3 shrink-0 px-1">
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Hourly Forecast</h3>
          <span className="text-[9px] text-primary/60 font-bold uppercase tracking-widest">Temporal Flow</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar flex-1 min-h-0">
          {hourly.map((item, idx) => (
            <div key={idx} className={`min-w-[65px] md:min-w-[70px] flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all ${
              item.time === 'Now' ? 'bg-primary/20 border border-primary/40' : 'glass-card'
            }`}>
              <span className={`text-[9px] font-bold uppercase tracking-tighter ${item.time === 'Now' ? 'text-[var(--text-color)]' : 'text-[var(--text-muted)]'}`}>
                {item.time}
              </span>
              <span className={`material-symbols-outlined text-xl ${item.icon.includes('sun') ? 'text-yellow-400' : 'text-[var(--text-muted)]'}`}>
                {item.icon}
              </span>
              <span className="text-xs md:text-sm font-black text-[var(--text-color)]">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
