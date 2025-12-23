
import React from 'react';
import { PanchangData } from '../types.ts';

interface SidebarRightProps {
  panchang: PanchangData;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ panchang }) => {
  return (
    <section className="flex flex-col w-full lg:w-[32%] h-full gap-5">
      <div className="flex-1 glass-panel rounded-[2rem] p-8 relative overflow-hidden flex flex-col border-t border-l border-white/20 shadow-2xl" 
           style={{ background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01))' }}>
        
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-panchang-accent/15 rounded-full blur-[90px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        
        <div className="flex items-start justify-between mb-8 z-10 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-panchang-accent/25 to-transparent rounded-2xl border border-panchang-accent/20 shadow-inner group cursor-pointer hover:border-panchang-accent/40 transition-all">
              <span className="material-symbols-outlined text-panchang-accent text-2xl group-hover:rotate-12 transition-transform duration-500">temple_hindu</span>
            </div>
            <div>
              <h3 className="text-white font-black text-xl leading-none tracking-tight uppercase italic">Aether Vedic</h3>
              <span className="text-[10px] text-panchang-accent/60 font-black uppercase tracking-[0.2em] mt-2 block">Celestial Synchrony</span>
            </div>
          </div>
          <div className="size-2 rounded-full bg-panchang-accent/40 animate-ping"></div>
        </div>

        <div className="flex flex-col items-center justify-center mb-8 z-10 text-center py-10 glass-card rounded-[2rem] border-white/10 relative overflow-hidden group hover:border-panchang-accent/30 transition-all duration-700 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-panchang-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <h4 className="text-panchang-accent font-black uppercase text-[11px] tracking-[0.4em] mb-3 opacity-80">
              {panchang.paksha}
            </h4>
            <h2 className="text-5xl font-black text-white mb-3 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] tracking-tighter text-glow italic">
              {panchang.tithi}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-8 bg-white/10"></div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Panchang Phase</p>
              <div className="h-px w-8 bg-white/10"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 flex flex-col gap-8 z-10 overflow-y-auto pr-3 -mr-3 custom-scrollbar">
          
          {/* Times with improved icons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-2 border-white/5 hover:border-yellow-500/30 transition-all group">
               <span className="material-symbols-outlined text-yellow-500/60 group-hover:text-yellow-400 group-hover:scale-110 transition-all text-2xl">light_mode</span>
               <div>
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Sunrise</p>
                  <p className="text-white text-sm font-bold tracking-tight">{panchang.sunrise}</p>
               </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-2 border-white/5 hover:border-orange-500/30 transition-all group">
               <span className="material-symbols-outlined text-orange-500/60 group-hover:text-orange-400 group-hover:scale-110 transition-all text-2xl rotate-180">bedtime</span>
               <div>
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Sunset</p>
                  <p className="text-white text-sm font-bold tracking-tight">{panchang.sunset}</p>
               </div>
            </div>
          </div>

          {/* Detailed Rashifal Carousel */}
          {panchang.rashifal && panchang.rashifal.length > 0 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-panchang-accent shadow-[0_0_10px_rgba(255,159,67,0.5)]"></div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em]">Cosmic Forecast</h4>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                  <div className="w-1 h-1 rounded-full bg-panchang-accent"></div>
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                </div>
              </div>
              
              <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide -mx-1 px-1">
                {panchang.rashifal.map((item, idx) => (
                  <div key={idx} className="min-w-[290px] max-w-[290px] glass-card border-white/10 rounded-[2rem] p-7 transition-all duration-700 group cursor-default shadow-2xl flex flex-col gap-6 hover:border-panchang-accent/40 hover:scale-[1.02] hover:bg-white/[0.05] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-panchang-accent/5 rounded-full blur-2xl group-hover:bg-panchang-accent/10 transition-all"></div>
                    
                    {/* Sign Header */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-panchang-accent/30 transition-all">
                          <span className="material-symbols-outlined text-panchang-accent text-xl group-hover:scale-110 transition-all">
                            {idx % 4 === 0 ? 'flare' : idx % 4 === 1 ? 'waves' : idx % 4 === 2 ? 'cyclone' : 'terrain'}
                          </span>
                        </div>
                        <div>
                          <span className="text-base font-black text-white tracking-tight uppercase italic">{item.sign.split(' ')[0]}</span>
                          <span className="text-[9px] text-white/30 block font-bold tracking-widest">{item.sign.split(' ')[1]}</span>
                        </div>
                      </div>
                      <span className="text-[40px] font-black text-white/5 select-none absolute top-4 right-4 italic tracking-tighter group-hover:text-panchang-accent/10 transition-all">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Detailed Prediction */}
                    <div className="relative z-10">
                      <p className="text-[13px] text-white/70 leading-relaxed italic font-light group-hover:text-white/90 transition-colors duration-500">
                        {item.prediction}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between z-10">
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Aura No.</span>
                         <span className="size-8 rounded-full glass-button flex items-center justify-center text-[12px] font-black text-panchang-accent border-panchang-accent/20 group-hover:border-panchang-accent/50 group-hover:scale-110">
                           {item.luckyNumber}
                         </span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Color</span>
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-white/10 group-hover:border-white/30 transition-all">
                            <span className="size-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.luckyColor.toLowerCase() }}></span>
                            <span className="text-[10px] font-black text-white/60 tracking-tighter uppercase">{item.luckyColor}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Festival Alert - Redesigned */}
          <div className="bg-gradient-to-r from-red-600/20 to-transparent border border-red-500/20 rounded-[1.5rem] p-5 flex items-center gap-5 mt-auto hover:from-red-600/30 transition-all group shrink-0 shadow-2xl">
            <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-all border border-red-500/20">
              <span className="material-symbols-outlined text-2xl">auto_awesome_motion</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] text-red-400 uppercase font-black tracking-[0.3em]">Upcoming Celebration</span>
                <span className="size-1 bg-red-400/50 rounded-full animate-ping"></span>
              </div>
              <p className="text-white text-lg font-black tracking-tight italic">
                {panchang.upcomingFestival}
              </p>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter block mb-1">Status</span>
               <span className="text-[9px] text-red-400 font-black border border-red-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
