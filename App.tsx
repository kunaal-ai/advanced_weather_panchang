
import React, { useState, useEffect } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { WeatherHero } from './components/WeatherHero';
import { SidebarRight } from './components/SidebarRight';
import { 
  INITIAL_WEATHER, 
  MOCK_FORECAST, 
  MOCK_HOURLY, 
  MOCK_PANCHANG, 
  INITIAL_INSIGHT 
} from './constants';
import { WeatherData, ForecastDay, HourlyForecast, PanchangData, WeatherInsight } from './types';
import { getGeminiWeatherInsight, searchWeatherForCity, searchWeatherByCoords } from './services/geminiService';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [forecast, setForecast] = useState<ForecastDay[]>(MOCK_FORECAST);
  const [hourly, setHourly] = useState<HourlyForecast[]>(MOCK_HOURLY);
  const [panchang, setPanchang] = useState<PanchangData>(MOCK_PANCHANG);
  const [insight, setInsight] = useState<WeatherInsight>(INITIAL_INSIGHT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
        
        setWeather(prev => ({ ...prev, time: timeString, date: dateString }));
        const geminiInsight = await getGeminiWeatherInsight(INITIAL_WEATHER.condition);
        setInsight(geminiInsight);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const timer = setInterval(() => {
      const now = new Date();
      setWeather(prev => ({
        ...prev,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 60000);
    return () => clearInterval(timer);
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
    } else {
      alert("City not found or error fetching real-time data.");
    }
    setIsSearching(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await searchWeatherByCoords(latitude, longitude);
        if (result) {
          setWeather(result.weather);
          setForecast(result.forecast);
          setHourly(result.hourly);
          setPanchang(result.panchang);
          setInsight(result.insight);
        } else {
          alert("Could not fetch weather for your location.");
        }
        setIsSearching(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please check your permissions.");
        setIsSearching(false);
      }
    );
  };

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden flex items-center justify-center p-4 lg:p-8">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-[#101622]/95 to-[#101622] z-10"></div>
        <img 
          alt="Atmospheric Background" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2574&auto=format&fit=crop"
        />
      </div>

      <main className="relative z-20 flex flex-col lg:flex-row w-full h-full max-w-[1440px] mx-auto gap-6 lg:items-stretch lg:h-[calc(100vh-4rem)]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-white/50 animate-pulse font-medium">Synchronizing Atmospheres...</p>
            </div>
          </div>
        ) : (
          <>
            <SidebarLeft 
              weather={weather} 
              forecast={forecast} 
              insight={insight} 
              onSearch={handleSearch} 
              onGeolocation={handleGeolocation}
              isSearching={isSearching}
            />
            <WeatherHero weather={weather} hourly={hourly} />
            <SidebarRight panchang={panchang} />
          </>
        )}
      </main>

      <button 
        onClick={async () => {
          const newInsight = await getGeminiWeatherInsight(weather.condition);
          setInsight(newInsight);
        }}
        className="fixed bottom-6 right-6 z-30 size-12 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
        title="Refresh AI Insight"
      >
        <span className="material-symbols-outlined text-white text-xl group-hover:rotate-180 transition-transform duration-700">refresh</span>
      </button>
    </div>
  );
};

export default App;
