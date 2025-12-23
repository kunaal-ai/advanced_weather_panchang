
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
  const [forecast, setForecast] = useState<ForecastDay[]>(MOCK_FORECAST);
  const [hourly, setHourly] = useState<HourlyForecast[]>(MOCK_HOURLY);
  const [panchang, setPanchang] = useState<PanchangData>(MOCK_PANCHANG);
  const [insight, setInsight] = useState<WeatherInsight>(INITIAL_INSIGHT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [theme, setTheme] = useState<ThemeType>('classic');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        setWeather(prev => ({
          ...prev,
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
        }));
        const geminiInsight = await getGeminiWeatherInsight(INITIAL_WEATHER.condition);
        setInsight(geminiInsight);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
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

  const convertTemp = (temp: number) => {
    if (unit === 'F') return Math.round(temp);
    return Math.round((temp - 32) * 5 / 9);
  };

  const displayWeather = useMemo(() => ({
    ...weather,
    temp: convertTemp(weather.temp),
    feelsLike: convertTemp(weather.feelsLike)
  }), [weather, unit]);

  const displayForecast = useMemo(() => forecast.map(f => ({
    ...f,
    high: convertTemp(f.high),
    low: convertTemp(f.low)
  })), [forecast, unit]);

  const displayHourly = useMemo(() => hourly.map(h => ({
    ...h,
    temp: convertTemp(h.temp)
  })), [hourly, unit]);

  const handleSearch = async (city: string) => {
    setIsSearching(true);
    setSearchStatus(`Analyzing atmosphere in ${city}...`);
    const result = await searchWeatherForCity(city);
    if (result) {
      setWeather(result.weather);
      setForecast(result.forecast);
      setHourly(result.hourly);
      setPanchang(result.panchang);
      setInsight(result.insight);
    }
    setIsSearching(false);
    setSearchStatus('');
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsSearching(true);
    setSearchStatus('Detecting local coordinates...');
    navigator.geolocation.getCurrentPosition(async (p) => {
      const res = await searchWeatherByCoords(p.coords.latitude, p.coords.longitude);
      if (res) {
        setWeather(res.weather);
        setForecast(res.forecast);
        setHourly(res.hourly);
        setPanchang(res.panchang);
        setInsight(res.insight);
      }
      setIsSearching(false);
      setSearchStatus('');
    }, () => {
      setIsSearching(false);
      setSearchStatus('');
    });
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center theme-${theme} overflow-x-hidden`}>
      {/* Search Processing Overlay */}
      {isSearching && !isLoading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel p-10 rounded-[3rem] flex flex-col items-center gap-6 shadow-2xl border border-white/10">
            <div className="relative">
              <div className="size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-3xl animate-pulse">cloud</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">{searchStatus}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2 italic">Aether Synchronizing...</p>
            </div>
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
           <>
             <div className="w-full h-full vedic-pattern"></div>
             <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/10 to-transparent"></div>
           </>
        )}
        <div className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b ${theme === 'eink' ? 'from-transparent' : 'from-primary/5'} to-transparent`}></div>
      </div>

      <main className="relative z-20 w-full max-w-[1600px] px-4 py-4 md:px-6 md:py-6 lg:px-10 lg:h-screen lg:max-h-[1200px] flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch overflow-y-auto lg:overflow-hidden">
        {isLoading ? (
          <div className="col-span-12 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-6 glass-panel p-12 rounded-[2.5rem]">
              <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-muted text-[10px] font-black tracking-[0.5em] uppercase">Stabilizing</p>
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar Left */}
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
            
            {/* Main Hero */}
            <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5 flex flex-col min-h-0 h-auto lg:h-auto">
              <WeatherHero 
                weather={displayWeather} 
                hourly={displayHourly} 
                unit={unit}
                onToggleUnit={() => setUnit(u => u === 'F' ? 'C' : 'F')}
              />
            </div>

            {/* Sidebar Right */}
            <div className="order-3 lg:order-3 lg:col-span-4 xl:col-span-4 flex flex-col gap-6 min-h-0 pb-10 lg:pb-0">
              <SidebarRight panchang={panchang} />
            </div>
          </>
        )}
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
