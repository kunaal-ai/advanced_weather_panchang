
import React from 'react';
import { PanchangData } from '../types.ts';

interface SidebarRightProps {
  panchang: PanchangData;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ panchang }) => {
  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex-1 glass-panel rounded-[2.5rem] p-6 flex flex-col overflow-hidden relative">
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 bg-panchang-accent/10 rounded-xl border border-panchang-accent/20">
            <span className="material-symbols-outlined text-panchang-accent text-xl">temple_hindu</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight uppercase italic leading-none">Aether Vedic</h3>
            <span className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1 block">Celestial Phase</span>
          </div>
        </div>

        <div className="text-center py-6 glass-card rounded-[2rem] relative z-10 mb-6 shrink-0">
          <p className="text-panchang-accent font-black uppercase text-[9px] tracking-[0.3em] mb-1 opacity-70">
            {panchang.paksha}
          </p>
          <h2 className="text-4xl font-black text-white italic tracking-tighter text-glow">
            {panchang.tithi}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-yellow-500/50 text-xl">light_mode</span>
              <p className="text-[9px] text-white/20 uppercase font-black">Sunrise</p>
              <p className="text-white text-xs font-bold">{panchang.sunrise}</p>
            </div>
            <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-orange-500/50 text-xl">bedtime</span>
              <p className="text-[9px] text-white/20 uppercase font-black">Sunset</p>
              <p className="text-white text-xs font-bold">{panchang.sunset}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Daily Rashifal</h4>
            <div className="flex flex-col gap-3">
              {panchang.rashifal?.slice(0, 6).map((item, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-4 flex flex-col gap-2 group transition-all hover:bg-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-black text-white uppercase italic">{item.sign}</span>
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full" style={{ background: item.luckyColor.toLowerCase() }}></span>
                      <span className="text-[9px] text-white/40 font-black">Luck: {item.luckyNumber}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                    {item.prediction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-600/10 to-transparent border border-red-500/10 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div className="p-2.5 bg-red-500/20 rounded-xl text-red-400">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
            </div>
            <div>
              <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest block mb-0.5">Upcoming Event</span>
              <p className="text-white text-sm font-black italic tracking-tight">{panchang.upcomingFestival}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
