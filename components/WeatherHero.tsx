
import React from 'react';
import { WeatherData, HourlyForecast } from '../types.ts';

interface WeatherHeroProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, hourly }) => {
  return (
    <section className="flex flex-col w-full lg:w-[40%] h-full gap-5">
      {/* Hero Card */}
      <div className="relative flex-1 glass-panel rounded-[3rem] p-10 flex flex-col items-center justify-center overflow-hidden group text-center border-t border-l border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-indigo-500/5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/20 transition-all duration-1000"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 size-2 bg-white/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-10 left-10 size-3 bg-primary/30 rounded-full blur-md animate-pulse"></div>

        <div className="relative z-10 size-72 flex items-center justify-center mb-6">
          <img 
            alt="Atmospheric visualization" 
            className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] scale-110 transform transition-transform duration-1000 group-hover:scale-105 motion-safe:animate-float" 
            src={weather.icon}
          />
        </div>

        <div className="flex flex-col z-10 items-center">
          <div className="flex items-start justify-center translate-x-3">
            <h1 className="text-[10rem] font-extralight tracking-tighter text-white leading-none text-glow">{weather.temp}</h1>
            <span className="text-5xl text-white/40 mt-10 font-light select-none tracking-tighter">°</span>
          </div>
          <h2 className="text-4xl font-bold text-white mt-[-15px] tracking-tight text-glow uppercase">{weather.condition}</h2>
          
          <div className="mt-8 flex items-center gap-3 glass-button px-6 py-2.5 rounded-full border border-white/10 group-hover:border-primary/40">
             <span className="text-[11px] text-white/40 font-black uppercase tracking-widest">Feels Like</span>
             <span className="text-lg font-bold text-primary tabular-nums">{weather.feelsLike}°</span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="h-auto glass-panel rounded-[2rem] p-8 flex flex-col justify-center shrink-0 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm animate-pulse">schedule</span>
            <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">Precision Hourly</span>
          </div>
          <button className="text-[10px] text-primary/60 font-black hover:text-white transition-all uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5 hover:border-primary/30">View Analysis</button>
        </div>
        
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {hourly.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center min-w-[84px] rounded-3xl p-4 py-6 transition-all duration-500 cursor-pointer group hover:scale-[1.08] relative overflow-hidden ${
                item.time === 'Now' 
                ? 'bg-primary/20 border border-primary/50 shadow-[0_15px_30px_rgba(19,91,236,0.3)]' 
                : 'glass-card border-white/5 hover:border-white/20'
              }`}
            >
              {item.time === 'Now' && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              )}
              
              <span className={`text-[11px] font-black mb-4 uppercase tracking-tighter ${item.time === 'Now' ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>
                {item.time}
              </span>
              
              <div className="relative mb-4">
                <span className={`material-symbols-outlined text-3xl transition-all duration-500 group-hover:scale-125 ${
                  item.icon === 'sunny' ? 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]' : 
                  item.icon.includes('rain') ? 'text-blue-400' : 'text-white/60 group-hover:text-white'
                }`}>
                  {item.icon}
                </span>
                {item.time === 'Now' && (
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse"></div>
                )}
              </div>

              <span className={`text-xl font-bold tabular-nums ${item.time === 'Now' ? 'text-white text-glow' : 'text-white/80'}`}>
                {item.temp}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
