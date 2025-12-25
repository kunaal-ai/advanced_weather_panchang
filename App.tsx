
import React, { useState, useEffect, useMemo } from 'react';
import { SidebarLeft } from './components/SidebarLeft.tsx';
import { WeatherHero } from './components/WeatherHero.tsx';
import { SidebarRight } from './components/SidebarRight.tsx';
import { SettingsMenu } from './components/SettingsMenu.tsx';
import { LegalModal } from './components/LegalModal.tsx';
import { 
  INITIAL_WEATHER, 
  MOCK_FORECAST, 
  MOCK_HOURLY, 
  MOCK_PANCHANG, 
  GITA_QUOTES 
} from './constants.tsx';
import { WeatherData, ForecastDay, HourlyForecast, PanchangData, WeatherInsight, ThemeType } from './types.ts';
import { searchWeatherForCity, searchWeatherByCoords } from './services/geminiService.ts';

/**
 * Deterministically picks a quote based on the current date string
 * ensuring it only changes once every 24 hours.
 */
const getQuoteOfTheDay = (): WeatherInsight => {
  const dateStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
  }
  const index = Math.abs(hash) % GITA_QUOTES.length;
  return GITA_QUOTES[index];
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [forecast, setForecast] = useState<ForecastDay[]>(MOCK_FORECAST);
  const [hourly, setHourly] = useState<HourlyForecast[]>(MOCK_HOURLY);
  const [panchang, setPanchang] = useState<PanchangData>(MOCK_PANCHANG);
  const [isSearching, setIsSearching] = useState(false);
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [theme, setTheme] = useState<ThemeType>('classic');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [legalView, setLegalView] = useState<'privacy' | 'terms' | null>(null);
  const [searchStatus, setSearchStatus] = useState('');
  const [showKeySelector, setShowKeySelector] = useState(false);

  // Use useMemo to ensure the quote only recalculates if needed
  const dailyQuote = useMemo(() => getQuoteOfTheDay(), []);

  // Initial load: Try searching with default key first
  useEffect(() => {
    handleSearch("New York");
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setShowKeySelector(false);
      setTimeout(() => handleSearch("New York"), 500);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-classic', 'theme-eink', 'theme-daylight', 'theme-vedic');
    root.classList.add(`theme-${theme}`);
    if (theme === 'classic') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
  }, [theme]);

  const convertTemp = (temp: any) => {
    if (temp === undefined || temp === null) return 0;
    let num = typeof temp === 'number' ? temp : parseFloat(temp.toString().replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return 0;
    if (unit === 'F') return Math.round(num);
    return Math.round((num - 32) * 5 / 9);
  };

  const displayWeather = useMemo(() => ({
    ...weather,
    temp: convertTemp(weather.temp),
    feelsLike: convertTemp(weather.feelsLike)
  }), [weather, unit]);

  const displayForecast = useMemo(() => (forecast || []).map(f => ({
    ...f,
    high: convertTemp(f.high),
    low: convertTemp(f.low)
  })), [forecast, unit]);

  const displayHourly = useMemo(() => (hourly || []).map(h => ({
    ...h,
    temp: convertTemp(h.temp)
  })), [hourly, unit]);

  const handleSearch = async (city: string) => {
    if (!city) return;
    setIsSearching(true);
    setSearchStatus(`Accessing Data Streams for ${city}...`);
    try {
      const result = await searchWeatherForCity(city);
      if (result) {
        setWeather(result.weather);
        setForecast(result.forecast);
        setHourly(result.hourly);
        setPanchang(result.panchang);
      }
    } catch (e: any) {
      console.error("Search error handled in App:", e);
      if (e.message?.includes("API key")) {
        setShowKeySelector(true);
      } else {
        alert("Primary sync failed. Using legacy data streams.");
      }
    } finally {
      setIsSearching(false);
      setSearchStatus('');
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    setIsSearching(true);
    setSearchStatus('Locking GPS Coordinates...');
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try {
          const res = await searchWeatherByCoords(p.coords.latitude, p.coords.longitude);
          if (res) {
            setWeather(res.weather);
            setForecast(res.forecast);
            setHourly(res.hourly);
            setPanchang(res.panchang);
          } else {
            alert("Location lock lost. Search manually.");
          }
        } catch (e: any) {
          console.error("Geo search failure:", e);
        } finally {
          setIsSearching(false);
          setSearchStatus('');
        }
      },
      (err) => {
        setIsSearching(false);
        setSearchStatus('');
        alert("GPS Signal Blocked. Use manual search.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center theme-${theme} overflow-x-hidden transition-colors duration-500`}>
      {showKeySelector && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-2xl px-6">
          <div className="glass-panel p-10 rounded-[3rem] flex flex-col items-center text-center max-w-sm gap-6 border border-white/10 shadow-3xl">
            <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-primary text-5xl">speed</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">API Quota Exhausted</h2>
            <p className="text-[11px] text-white/50 font-medium leading-relaxed">
              Gemini free tier reached its limit. Connect your own paid key to restore full AI-powered Search and Vedic insights.
            </p>
            <button 
              onClick={handleOpenKeySelector}
              className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/40 flex items-center justify-center gap-3"
            >
              Select Paid API Key
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
            <div className="flex flex-col gap-2">
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                className="text-[10px] text-primary font-black uppercase underline tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              >
                Billing Documentation
              </a>
              <button 
                onClick={() => setShowKeySelector(false)}
                className="text-[9px] text-white/30 font-black uppercase tracking-widest hover:text-white/60 transition-colors"
              >
                Use Legacy Fallback Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="glass-panel p-12 rounded-[3.5rem] flex flex-col items-center gap-8 shadow-2xl border border-white/10">
            <div className="relative">
              <div className="size-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-4xl animate-pulse">satellite_alt</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white uppercase tracking-[0.4em] animate-pulse mb-2">{searchStatus}</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Bridging AI & Satellite Streams</p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {theme === 'classic' && (
           <img alt="BG" className="w-full h-full object-cover opacity-[0.12] scale-105" src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000" />
        )}
        {theme === 'daylight' && (
           <div className="w-full h-full bg-gradient-to-tr from-[#E0F7FA] via-[#81D4FA] to-[#4FC3F7] opacity-60"></div>
        )}
        {theme === 'vedic' && (
           <div className="w-full h-full opacity-10 bg-[radial-gradient(#FF9933_1px,transparent_1px)] [background-size:32px_32px]"></div>
        )}
      </div>

      <main className="relative z-20 w-full max-w-[1600px] px-4 py-4 md:px-6 md:py-6 lg:px-10 lg:h-screen lg:max-h-[1200px] flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch overflow-y-auto lg:overflow-hidden">
        <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-6 min-h-0">
          <SidebarLeft 
            weather={displayWeather} 
            forecast={displayForecast} 
            insight={dailyQuote} 
            onSearch={handleSearch} 
            onGeolocation={handleGeolocation}
            isSearching={isSearching}
            unit={unit}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col min-h-0">
          <WeatherHero 
            weather={displayWeather} 
            hourly={displayHourly} 
            unit={unit}
            onToggleUnit={() => setUnit(u => u === 'F' ? 'C' : 'F')}
          />
        </div>
        <div className="order-3 lg:order-3 lg:col-span-4 flex flex-col gap-6 min-h-0 pb-12 lg:pb-0">
          <SidebarRight panchang={panchang} />
        </div>
      </main>

      {isSettingsOpen && (
        <SettingsMenu 
          currentTheme={theme}
          onSelectTheme={setTheme}
          onClose={() => setIsSettingsOpen(false)}
          onOpenLegal={setLegalView}
        />
      )}

      {legalView && (
        <LegalModal 
          type={legalView} 
          onClose={() => setLegalView(null)} 
        />
      )}
    </div>
  );
};

export default App;
