
import React from 'react';
import { WeatherData, HourlyForecast } from '../types';

interface WeatherHeroProps {
  weather: WeatherData;
  hourly: HourlyForecast[];
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, hourly }) => {
  return (
    <section className="flex flex-col w-full lg:w-[40%] h-full gap-5">
      {/* Hero Card */}
      <div className="relative flex-1 glass-panel rounded-2xl p-8 flex flex-col items-center justify-center overflow-hidden group text-center border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/25 transition-colors duration-700"></div>
        
        <div className="relative z-10 size-64 flex items-center justify-center mb-4">
          <img 
            alt="3D Weather Icon" 
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-110 transform transition-transform duration-700 group-hover:scale-105 motion-safe:animate-float" 
            src={weather.icon}
          />
        </div>

        <div className="flex flex-col z-10 items-center">
          <div className="flex items-start justify-center ml-6">
            <h1 className="text-9xl font-thin tracking-tighter text-white drop-shadow-2xl">{weather.temp}</h1>
            <span className="text-4xl text-white/60 mt-6 font-light">°F</span>
          </div>
          <h2 className="text-3xl font-bold text-white mt-[-10px] tracking-tight">{weather.condition}</h2>
          <p className="text-white/60 text-sm mt-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            Feels like {weather.feelsLike}°
          </p>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="h-auto glass-panel rounded-2xl p-6 flex flex-col justify-center shrink-0 shadow-lg">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-bold text-white tracking-wide">Hourly Forecast</span>
          <button className="text-xs text-primary font-bold hover:text-white transition-colors uppercase tracking-wider">Details</button>
        </div>
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {hourly.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center min-w-[72px] rounded-2xl p-3 py-4 transition-all duration-300 cursor-pointer group hover:scale-105 ${
                item.time === 'Now' 
                ? 'bg-primary/20 border border-primary/40 shadow-[0_0_15px_rgba(19,91,236,0.2)]' 
                : 'hover:bg-white/5'
              }`}
            >
              <span className={`text-[10px] font-medium mb-2 ${item.time === 'Now' ? 'text-white/80' : 'text-gray-400 group-hover:text-white'}`}>
                {item.time}
              </span>
              <span className={`material-symbols-outlined mb-2 text-xl ${
                item.icon === 'sunny' ? 'text-yellow-400' : 'text-gray-300 group-hover:text-white'
              }`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold text-white">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
