
import React from 'react';
import { PanchangData, VedicEvent } from '../types.ts';

interface SidebarRightProps {
  panchang: PanchangData;
}

const getEventTypeColor = (type: VedicEvent['type']) => {
  switch (type) {
    case 'Festival': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'Purnima': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
    case 'Ekadashi': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'Amavasya': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    case 'Auspicious': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    default: return 'text-[var(--text-muted)] bg-[var(--text-muted)]/10 border-[var(--text-muted)]/20';
  }
};

export const SidebarRight: React.FC<SidebarRightProps> = ({ panchang }) => {
  return (
    <div className="flex flex-col gap-6 h-full lg:overflow-hidden">
      {/* Panchang Events Card */}
      <div className="flex-[1.5] glass-panel rounded-[2.5rem] p-5 flex flex-col min-h-[450px] lg:min-h-0 relative overflow-hidden">
        {/* Top Info Strip */}
        <div className="flex items-center justify-between mb-4 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-panchang-accent/10 rounded-lg border border-panchang-accent/20">
              <span className="material-symbols-outlined text-panchang-accent text-base">temple_hindu</span>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-color)] font-bold tracking-tight uppercase leading-none">Lunar Phase</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <p className="text-[10px] font-black text-[var(--text-color)] leading-none mb-0.5">{panchang.tithi || '---'}</p>
             <p className="text-[7px] font-bold text-panchang-accent uppercase tracking-tighter opacity-70">{panchang.paksha || '---'}</p>
          </div>
        </div>

        {/* Sunrise/Sunset Mini Row */}
        <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
          <div className="glass-card rounded-xl px-3 py-2 flex items-center justify-between border border-[var(--glass-border)]">
            <span className="material-symbols-outlined text-yellow-500/50 text-sm">light_mode</span>
            <div className="text-right">
              <p className="text-[6px] text-[var(--text-muted)] uppercase font-black leading-none mb-0.5">Sunrise</p>
              <p className="text-[var(--text-color)] text-[10px] font-bold leading-none">{panchang.sunrise || '--:--'}</p>
            </div>
          </div>
          <div className="glass-card rounded-xl px-3 py-2 flex items-center justify-between border border-[var(--glass-border)]">
            <span className="material-symbols-outlined text-orange-500/50 text-sm">bedtime</span>
            <div className="text-right">
              <p className="text-[6px] text-[var(--text-muted)] uppercase font-black leading-none mb-0.5">Sunset</p>
              <p className="text-[var(--text-color)] text-[10px] font-bold leading-none">{panchang.sunset || '--:--'}</p>
            </div>
          </div>
        </div>

        {/* 7-Day Events List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar min-h-0">
          <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2 sticky top-0 bg-[var(--glass-bg)] backdrop-blur py-2 z-10 border-b border-[var(--glass-border)]">
            Next 7 Days
          </p>
          <div className="space-y-2">
            {(panchang.upcomingEvents || []).map((event, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 glass-card rounded-xl border border-white/5 hover:border-panchang-accent/30 transition-all group cursor-default">
                <div className="text-center min-w-[36px] shrink-0">
                   <p className="text-[9px] font-black text-panchang-accent leading-none uppercase">{event.date?.split(' ')[0]}</p>
                   <p className="text-xs font-black text-[var(--text-color)] leading-none mt-1">{event.date?.split(' ')[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-[var(--text-color)] truncate group-hover:text-panchang-accent transition-colors">{event.name}</p>
                   <div className={`inline-block px-1.5 py-0.5 rounded-md border text-[7px] font-black uppercase mt-1 ${getEventTypeColor(event.type)}`}>
                     {event.type}
                   </div>
                </div>
              </div>
            ))}
            {(panchang.upcomingEvents || []).length === 0 && (
              <p className="text-[10px] text-[var(--text-muted)] text-center py-4 italic">No major events found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Daily Rashifal Card */}
      <div className="flex-1 glass-panel rounded-[2.5rem] p-6 flex flex-col min-h-[400px] lg:min-h-0 overflow-hidden relative">
        <div className="flex items-center justify-between mb-5 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <span className="material-symbols-outlined text-primary text-xl">star</span>
            </div>
            <div>
              <h3 className="text-[var(--text-color)] font-bold text-sm tracking-tight uppercase italic leading-none">Daily Rashifal</h3>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {(panchang.rashifal || []).map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card rounded-2xl p-4 flex flex-col gap-2 group transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 border border-transparent cursor-default"
            >
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-black text-[var(--text-color)] uppercase italic tracking-wide">{item.sign}</span>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full shadow-sm" style={{ background: (item.luckyColor || 'gray').toLowerCase() }}></span>
                  <span className="text-[9px] text-[var(--text-muted)] font-black uppercase opacity-70">Luck: {item.luckyNumber || '-'}</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-color)] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                {item.prediction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
