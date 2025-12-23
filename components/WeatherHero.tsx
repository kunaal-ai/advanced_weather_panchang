
import React from 'react';
import { WeatherData, HourlyForecast } from '../types.ts';

interface WeatherHeroProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, hourly }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 glass-panel rounded-[3rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group min-h-[400px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[240px] md:max-w-[280px] aspect-square flex items-center justify-center mb-4">
          <img alt="Icon" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" src={weather.icon} />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="flex items-start translate-x-2">
            <h1 className="text-[7rem] md:text-[9rem] font-light leading-none tracking-tighter text-white text-glow">
              {weather.temp}
            </h1>
            <span className="text-3xl md:text-4xl text-white/20 mt-4 md:mt-6">°</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white -mt-2 uppercase tracking-tight italic">{weather.condition}</h2>
          <div className="mt-6 flex items-center gap-4 px-5 py-2 rounded-full bg-white/5 border border-white/5">
            <h3 className="text-xs font-bold text-white/40 tracking-wider uppercase">{weather.location}</h3>
            <div className="w-px h-3 bg-white/10"></div>
            <span className="text-sm font-bold text-primary">{weather.feelsLike}° feels</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-6 shadow-2xl shrink-0">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Next 6 Hours</h3>
          <span className="text-[9px] text-primary/60 font-bold uppercase tracking-widest">Dynamic analysis</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {hourly.map((item, idx) => (
            <div key={idx} className={`min-w-[75px] flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${
              item.time === 'Now' ? 'bg-primary/20 border border-primary/40' : 'bg-white/5'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${item.time === 'Now' ? 'text-white' : 'text-white/30'}`}>
                {item.time}
              </span>
              <span className={`material-symbols-outlined text-2xl ${item.icon === 'sunny' ? 'text-yellow-400' : 'text-white/40'}`}>
                {item.icon}
              </span>
              <span className="text-base font-black text-white">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
