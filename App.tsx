
import React, { useState, useEffect, useMemo } from 'react';
import { SidebarLeft } from './components/SidebarLeft.tsx';
import { WeatherHero } from './components/WeatherHero.tsx';
import { SidebarRight } from './components/SidebarRight.tsx';
import { SettingsMenu } from './components/SettingsMenu.tsx';
import { 
  INITIAL_WEATHER, 
  MOCK_FORECAST, 
  MOCK_HOURLY, 
  MOCK_PANCHANG, 
  INITIAL_INSIGHT 
} from './constants.tsx';
import { WeatherData, ForecastDay, HourlyForecast, PanchangData, WeatherInsight, ThemeType } from './types.ts';
import { getGeminiWeatherInsight, searchWeatherForCity, searchWeatherByCoords } from './services/geminiService.ts';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [forecast, setForecast] = useState<ForecastDay[]>(MOCK_FORECAST || []);
  const [hourly, setHourly] = useState<HourlyForecast[]>(MOCK_HOURLY || []);
  const [panchang, setPanchang] = useState<PanchangData>(MOCK_PANCHANG);
  const [insight, setInsight] = useState<WeatherInsight>(INITIAL_INSIGHT);
  const [isSearching, setIsSearching] = useState(false);
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [theme, setTheme] = useState<ThemeType>('classic');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');

  useEffect(() => {
    const now = new Date();
    setWeather(prev => ({
      ...prev,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
    }));
    
    getGeminiWeatherInsight(INITIAL_WEATHER.condition)
      .then(res => setInsight(res))
      .catch(() => {});

    const boot = document.getElementById('boot-screen');
    if (boot) boot.remove();
  }, []);

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

  /**
   * More robust temperature conversion that handles numeric or string inputs.
   */
  const convertTemp = (temp: any) => {
    let num = typeof temp === 'number' ? temp : parseFloat(temp);
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
    setIsSearching(true);
    setSearchStatus(`Analyzing ${city}...`);
    try {
      const result = await searchWeatherForCity(city);
      if (result) {
        setWeather(result.weather);
        setForecast(result.forecast || []);
        setHourly(result.hourly || []);
        setPanchang(result.panchang || MOCK_PANCHANG);
        setInsight(result.insight || INITIAL_INSIGHT);
      }
    } catch (e) {
      console.error("Search error:", e);
    } finally {
      setIsSearching(false);
      setSearchStatus('');
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsSearching(true);
    setSearchStatus('Syncing location...');
    navigator.geolocation.getCurrentPosition(async (p) => {
      try {
        const res = await searchWeatherByCoords(p.coords.latitude, p.coords.longitude);
        if (res) {
          setWeather(res.weather);
          setForecast(res.forecast || []);
          setHourly(res.hourly || []);
          setPanchang(res.panchang || MOCK_PANCHANG);
          setInsight(res.insight || INITIAL_INSIGHT);
        }
      } catch (e) {
        console.error("Geo error:", e);
      } finally {
        setIsSearching(false);
        setSearchStatus('');
      }
    }, () => {
      setIsSearching(false);
      setSearchStatus('');
    });
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center theme-${theme} overflow-x-hidden`}>
      {isSearching && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel p-10 rounded-[3rem] flex flex-col items-center gap-6 shadow-2xl border border-white/10">
            <div className="relative">
              <div className="size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-3xl animate-pulse">cloud</span>
            </div>
            <p className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">{searchStatus}</p>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {theme === 'classic' && (
           <img alt="BG" className="w-full h-full object-cover opacity-10" src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000" />
        )}
        {theme === 'daylight' && (
           <div className="w-full h-full bg-gradient-to-tr from-[#E0F7FA] via-[#81D4FA] to-[#4FC3F7] opacity-60"></div>
        )}
        {theme === 'vedic' && (
           <div className="w-full h-full opacity-10 bg-[radial-gradient(#FF9933_0.5px,transparent_0.5px)] [background-size:24px_24px]"></div>
        )}
      </div>

      <main className="relative z-20 w-full max-w-[1600px] px-4 py-4 md:px-6 md:py-6 lg:px-10 lg:h-screen lg:max-h-[1200px] flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch overflow-y-auto lg:overflow-hidden">
        <div className="order-2 lg:order-1 lg:col-span-3 xl:col-span-3 flex flex-col gap-6 min-h-0">
          <SidebarLeft 
            weather={displayWeather} 
            forecast={displayForecast} 
            insight={insight} 
            onSearch={handleSearch} 
            onGeolocation={handleGeolocation}
            isSearching={isSearching}
            unit={unit}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5 flex flex-col min-h-0 h-auto lg:h-auto">
          <WeatherHero 
            weather={displayWeather} 
            hourly={displayHourly} 
            unit={unit}
            onToggleUnit={() => setUnit(u => u === 'F' ? 'C' : 'F')}
          />
        </div>
        <div className="order-3 lg:order-3 lg:col-span-4 xl:col-span-4 flex flex-col gap-6 min-h-0 pb-10 lg:pb-0">
          <SidebarRight panchang={panchang} />
        </div>
      </main>

      {isSettingsOpen && (
        <SettingsMenu 
          currentTheme={theme}
          onSelectTheme={setTheme}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
