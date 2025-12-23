
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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
        console.error("Fetch Data Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const timer = setInterval(() => {
      const now = new Date();
      setWeather(prev => ({
        ...prev,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 60000);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

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
    <div className="relative min-h-screen w-screen overflow-x-hidden flex items-center justify-center p-4 lg:p-10 transition-colors duration-1000">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-[#101622]/98 to-[#101622] z-10 backdrop-blur-[2px]"></div>
        <img 
          alt="Atmospheric Background" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2574&auto=format&fit=crop"
        />
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative z-20 flex flex-col lg:flex-row w-full h-full max-w-[1550px] mx-auto gap-8 lg:items-stretch lg:h-[calc(100vh-5rem)]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-8 glass-panel p-16 rounded-[3rem] border-white/10">
              <div className="relative">
                <div className="size-20 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 size-20 border-[3px] border-transparent border-b-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <p className="text-white font-black text-xl tracking-[0.4em] uppercase text-glow">Synchronizing</p>
                 <p className="text-white/30 text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">Aether Systems Active</p>
              </div>
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
              canInstall={!!deferredPrompt}
              onInstall={handleInstallApp}
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
        className="fixed bottom-10 right-10 z-30 size-14 bg-primary rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(19,91,236,0.4)] hover:scale-110 hover:rotate-3 transition-all active:scale-90 group border border-white/20 backdrop-blur-md overflow-hidden"
        title="Refresh AI Insight"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="material-symbols-outlined text-white text-2xl group-hover:rotate-180 transition-transform duration-1000">refresh</span>
      </button>
    </div>
  );
};

export default App;
