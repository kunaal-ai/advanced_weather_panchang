
import React from 'react';
import { PanchangData } from '../types';

interface SidebarRightProps {
  panchang: PanchangData;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ panchang }) => {
  return (
    <section className="flex flex-col w-full lg:w-[32%] h-full gap-5">
      <div className="flex-1 glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col border-t border-l border-white/10 shadow-2xl" 
           style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))' }}>
        
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-panchang-accent/20 rounded-full blur-[70px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        
        <div className="flex items-start justify-between mb-6 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-panchang-accent/20 to-transparent rounded-xl border border-panchang-accent/10 shadow-inner">
              <span className="material-symbols-outlined text-panchang-accent text-xl">temple_hindu</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-none tracking-tight">Daily Panchang</h3>
              <span className="text-[11px] text-white/50 mt-1 block">Vedic Insights</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mb-6 z-10 text-center py-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-panchang-accent/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-panchang-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h4 className="text-panchang-accent font-bold uppercase text-[10px] tracking-[0.3em] mb-2 z-10">
            {panchang.paksha}
          </h4>
          <h2 className="text-4xl font-bold text-white mb-2 z-10 drop-shadow-lg tracking-tight">
            {panchang.tithi}
          </h2>
          <div className="flex items-center gap-2 mt-1 z-10">
            <span className="size-1.5 rounded-full bg-panchang-accent animate-pulse"></span>
            <p className="text-white/70 text-xs font-medium">Full Tithi Analysis</p>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 flex flex-col gap-6 z-10 overflow-y-auto pr-1 custom-scrollbar">
          
          {/* Times and Astral Details */}
          <div className="flex flex-col gap-3">
            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex justify-between items-center hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                  <span className="material-symbols-outlined text-xl">wb_twilight</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Sunrise</p>
                  <p className="text-white text-sm font-semibold">{panchang.sunrise}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Sunset</p>
                  <p className="text-white text-sm font-semibold">{panchang.sunset}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 group-hover:text-orange-300 transition-colors">
                  <span className="material-symbols-outlined text-xl rotate-180">wb_twilight</span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex items-center gap-4 hover:bg-white/5 transition-colors group">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="material-symbols-outlined text-xl">stars</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Nakshatra</p>
                <div className="flex justify-between items-end w-full">
                  <p className="text-white text-sm font-semibold">{panchang.nakshatra}</p>
                  <span className="text-[10px] text-white/40 font-medium bg-white/5 px-1.5 py-0.5 rounded">
                    {panchang.nakshatraEnd}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Rashifal Carousel */}
          {panchang.rashifal && panchang.rashifal.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[12px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-panchang-accent">auto_awesome</span>
                  Daily Rashifal
                </h4>
                <div className="flex gap-1 items-center">
                   <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter mr-2">Scroll to explore</span>
                   <div className="size-1 rounded-full bg-panchang-accent"></div>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                {panchang.rashifal.map((item, idx) => (
                  <div key={idx} className="min-w-[280px] max-w-[280px] bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl p-5 transition-all duration-500 group cursor-default shadow-xl flex flex-col gap-4 hover:border-panchang-accent/30 hover:shadow-panchang-accent/5">
                    
                    {/* Sign Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-panchang-accent/10 border border-panchang-accent/10">
                          <span className="material-symbols-outlined text-panchang-accent text-lg">
                            {idx % 4 === 0 ? 'fire_extinguisher' : idx % 4 === 1 ? 'water_drop' : idx % 4 === 2 ? 'cyclone' : 'public'}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">{item.sign}</span>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Sign {idx + 1}</span>
                      </div>
                    </div>

                    {/* Detailed Prediction */}
                    <div className="relative">
                      <span className="absolute -left-2 -top-2 material-symbols-outlined text-white/5 text-4xl select-none">format_quote</span>
                      <p className="text-[12px] text-white/70 leading-[1.6] italic font-light z-10 relative pl-2 group-hover:text-white transition-colors duration-300">
                        {item.prediction}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] text-white/40 uppercase font-bold">Lucky Number:</span>
                         <span className="size-6 rounded-full bg-panchang-accent/20 border border-panchang-accent/30 flex items-center justify-center text-[10px] font-black text-panchang-accent">
                           {item.luckyNumber}
                         </span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] text-white/40 uppercase font-bold">Color:</span>
                         <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                            <span className="size-1.5 rounded-full" style={{ backgroundColor: item.luckyColor.toLowerCase() }}></span>
                            <span className="text-[10px] font-medium text-white/80">{item.luckyColor}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Festival Alert */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-center gap-4 mt-auto hover:from-red-500/20 hover:to-orange-500/20 transition-all group shrink-0">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-300 group-hover:text-red-200 transition-colors">
              <span className="material-symbols-outlined text-xl">festival</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-red-300 uppercase font-bold tracking-wider mb-0.5">Upcoming Festival</p>
              <div className="flex justify-between items-end w-full">
                <p className="text-white text-sm font-semibold tracking-wide">
                  {panchang.upcomingFestival}
                </p>
                <span className="text-[10px] text-white/40 font-medium bg-white/5 px-1.5 py-0.5 rounded">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
