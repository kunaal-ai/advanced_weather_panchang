
import React from 'react';
import { ThemeType } from '../types.ts';

interface SettingsMenuProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ currentTheme, onSelectTheme, onClose }) => {
  const themes: { id: ThemeType; name: string; icon: string; desc: string }[] = [
    { id: 'classic', name: 'Classic Aether', icon: 'auto_awesome', desc: 'Dark glassmorphism with deep blue accents.' },
    { id: 'vedic', name: 'Vedic Spirit', icon: 'temple_hindu', desc: 'Saffron and gold palette inspired by traditional vibes.' },
    { id: 'daylight', name: 'Daylight', icon: 'wb_sunny', desc: 'Bright, airy sky themes for outdoor reading.' },
    { id: 'eink', name: 'E-Ink Reader', icon: 'menu_book', desc: 'High contrast monochrome for maximum focus.' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md glass-panel rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[var(--text-color)] italic tracking-tight">System Configuration</h2>
            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">Appearance & Interface</p>
          </div>
          <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full hover:bg-[var(--text-muted)] hover:bg-opacity-10 text-[var(--text-muted)]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { onSelectTheme(t.id); }}
              className={`w-full text-left p-5 rounded-[1.5rem] border-2 transition-all flex items-center gap-5 ${
                currentTheme === t.id 
                  ? 'bg-primary border-primary text-white shadow-xl scale-[1.02]' 
                  : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-color)] hover:border-primary/50'
              }`}
            >
              <div className={`size-12 rounded-2xl flex items-center justify-center ${currentTheme === t.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined text-2xl">{t.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base leading-none mb-1">{t.name}</h4>
                <p className={`text-[11px] leading-tight ${currentTheme === t.id ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                  {t.desc}
                </p>
              </div>
              {currentTheme === t.id && (
                <span className="material-symbols-outlined text-white">check_circle</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--glass-border)] flex justify-center">
           <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Aether v2.2.0-stable</p>
        </div>
      </div>
    </div>
  );
};
