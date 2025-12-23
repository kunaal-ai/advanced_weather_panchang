
import React from 'react';
import { WeatherData, HourlyForecast } from '../types.ts';

interface WeatherHeroProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
  unit: 'F' | 'C';
  onToggleUnit: () => void;
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, hourly, unit, onToggleUnit }) => {
  const condition = weather?.condition?.toLowerCase() || '';
  const isSunny = condition.includes('sun') || condition.includes('clear');
  const isRainy = condition.includes('rain') || condition.includes('storm');
  
  return (
    <div className="flex flex-col gap-5 h-full min-h-[500px] lg:min-h-0">
      {/* Main Weather Card */}
      <div className="flex-[3] glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden group min-h-0">
        <div className={`absolute -top-24 -left-24 size-80 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-1000 ${isSunny ? 'bg-yellow-400' : isRainy ? 'bg-blue-600' : 'bg-primary'}`}></div>
        <div className={`absolute -bottom-24 -right-24 size-80 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-1000 ${isSunny ? 'bg-orange-400' : 'bg-primary'}`}></div>
        
        {/* Header */}
        <div className="w-full flex justify-between items-start z-20 shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
            <h3 className="text-lg md:text-xl font-black text-[var(--text-color)] tracking-tight uppercase italic truncate">
              {weather.location || 'Unknown Location'}
            </h3>
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
        <div className="relative z-10 flex flex-col items-center justify-center py-4 flex-1 min-h-0 w-full overflow-hidden">
          <div className="relative group/icon mb-2 shrink-0">
            <div className={`absolute inset-0 rounded-full blur-3xl scale-125 transition-all duration-1000 opacity-40 animate-pulse ${isSunny ? 'bg-yellow-400/30' : 'bg-primary/20'}`}></div>
            <div className="size-28 md:size-40 lg:size-44 glass-card rounded-full flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
               <div className="absolute inset-2 border border-white/5 rounded-full border-dashed animate-[spin_30s_linear_infinite]"></div>
               <span className={`material-symbols-outlined text-6xl md:text-7xl lg:text-8xl transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${isSunny ? 'text-yellow-400' : 'text-primary'}`}>
                 {weather.icon || 'cloud'}
               </span>
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0 w-full mt-2">
            <div className="flex items-start">
              <h1 className="text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] font-light leading-none tracking-tighter text-[var(--text-color)] text-glow">
                {weather.temp ?? '--'}
              </h1>
              <span className="text-2xl md:text-4xl text-[var(--text-muted)] mt-2 md:mt-4">°</span>
            </div>
            <div className="w-full px-4 text-center mt-1">
              <h2 className="text-base md:text-lg lg:text-xl font-black text-[var(--text-color)] uppercase tracking-[0.2em] italic opacity-90 truncate leading-tight">
                {weather.condition || 'Determining Atmosphere'}
              </h2>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="w-full grid grid-cols-2 gap-3 z-20 shrink-0 mt-6">
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
             <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-lg">thermostat</span>
             </div>
             <div className="min-w-0">
                <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-none mb-1 truncate">Feels Like</p>
                <p className="text-sm font-bold text-[var(--text-color)] truncate">{weather.feelsLike ?? '--'}° {unit}</p>
             </div>
          </div>
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
             <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-lg">air</span>
             </div>
             <div className="min-w-0">
                <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-none mb-1 truncate">Wind Speed</p>
                <p className="text-sm font-bold text-[var(--text-color)] truncate">{weather.wind || '8 mph'}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Hourly Section */}
      <div className="glass-panel rounded-[2rem] p-5 shadow-2xl flex flex-col shrink-0 lg:flex-1 min-h-0">
        <div className="flex items-center justify-between mb-4 shrink-0 px-1">
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Hourly Forecast</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar flex-1 min-h-0">
          {(hourly || []).map((item, idx) => (
            <div key={idx} className={`min-w-[70px] flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all ${
              item.time === 'Now' ? 'bg-primary/20 border border-primary/40' : 'glass-card'
            }`}>
              <span className={`text-[9px] font-bold uppercase tracking-tighter ${item.time === 'Now' ? 'text-[var(--text-color)]' : 'text-[var(--text-muted)]'}`}>
                {item.time}
              </span>
              <span className={`material-symbols-outlined text-xl ${(item.icon || '').includes('sun') ? 'text-yellow-400' : 'text-[var(--text-muted)]'}`}>
                {item.icon || 'cloud'}
              </span>
              <span className="text-sm font-black text-[var(--text-color)]">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
