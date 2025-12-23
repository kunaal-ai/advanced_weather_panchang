
import React, { useState, useEffect } from 'react';
import { SidebarLeft } from './components/SidebarLeft.tsx';
import { WeatherHero } from './components/WeatherHero.tsx';
import { SidebarRight } from './components/SidebarRight.tsx';
import { 
  INITIAL_WEATHER, 
  MOCK_FORECAST, 
  MOCK_HOURLY, 
  MOCK_PANCHANG, 
  INITIAL_INSIGHT 
} from './constants.tsx';
import { WeatherData, ForecastDay, HourlyForecast, PanchangData, WeatherInsight } from './types.ts';
import { getGeminiWeatherInsight, searchWeatherForCity, searchWeatherByCoords } from './services/geminiService.ts';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [forecast, setForecast] = useState<ForecastDay[]>(MOCK_FORECAST);
  const [hourly, setHourly] = useState<HourlyForecast[]>(MOCK_HOURLY);
  const [panchang, setPanchang] = useState<PanchangData>(MOCK_PANCHANG);
  const [insight, setInsight] = useState<WeatherInsight>(INITIAL_INSIGHT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async (city: string) => {
    setIsSearching(true);
    const result = await searchWeatherForCity(city);
    if (result) {
      setWeather(result.weather);
      setForecast(result.forecast);
      setHourly(result.hourly);
      setPanchang(result.panchang);
      setInsight(result.insight);
    }
    setIsSearching(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsSearching(true);
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
    }, () => setIsSearching(false));
  };

  return (
    <div className="relative min-h-screen w-full bg-[#101622] flex flex-col items-center">
      <div className="fixed inset-0 z-0">
        <img alt="BG" className="w-full h-full object-cover opacity-10" src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000" />
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent"></div>
      </div>

      <main className="relative z-20 w-full max-w-[1440px] px-4 py-6 md:px-8 md:py-8 lg:px-10 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:h-screen lg:max-h-[1000px] items-stretch">
        {isLoading ? (
          <div className="col-span-12 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-6 glass-panel p-12 rounded-[2.5rem]">
              <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-white/20 text-[10px] font-black tracking-[0.5em] uppercase">Stabilizing</p>
            </div>
          </div>
        ) : (
          <>
            {/* Left Col: Search + Forecast */}
            <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-6 overflow-hidden">
              <SidebarLeft 
                weather={weather} 
                forecast={forecast} 
                insight={insight} 
                onSearch={handleSearch} 
                onGeolocation={handleGeolocation}
                isSearching={isSearching}
              />
            </div>
            
            {/* Center Col: Hero Weather */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col overflow-hidden">
              <WeatherHero weather={weather} hourly={hourly} />
            </div>

            {/* Right Col: Panchang + Rashifal */}
            <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 overflow-hidden">
              <SidebarRight panchang={panchang} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
