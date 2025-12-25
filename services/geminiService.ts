
import { GoogleGenAI } from "@google/genai";
import { WeatherInsight, SearchResult, PanchangData, WeatherData, ForecastDay, HourlyForecast } from "../types";
import { INITIAL_WEATHER, MOCK_PANCHANG, INITIAL_INSIGHT, MOCK_FORECAST, MOCK_HOURLY } from "../constants";

/**
 * Access the OpenWeatherMap API key from environment variables.
 * In Netlify, ensure you have set WEATHER_API_KEY in the Environment Variables settings.
 */
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

/**
 * Robust JSON extraction to handle model artifacts and markdown blocks
 */
function extractJson(text: string) {
  if (!text) return null;
  try {
    let clean = text.replace(/```json|```|'''json|'''/gi, '').trim();
    const startIdx = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      clean = clean.substring(startIdx, endIdx + 1);
    }
    return JSON.parse(clean);
  } catch (e) {
    console.warn("JSON Extraction Failed:", e);
    return null;
  }
}

/**
 * Fallback to OpenWeatherMap if Gemini is exhausted or if no Gemini Key is provided.
 * Uses the WEATHER_API_KEY environment variable.
 */
async function fetchFallbackWeather(query: string): Promise<SearchResult | null> {
  if (!WEATHER_API_KEY) {
    console.error("OpenWeatherMap API Key is missing. Please set WEATHER_API_KEY in your environment.");
    return null;
  }

  try {
    // Current Weather
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${WEATHER_API_KEY}&units=imperial`);
    // 5-day / 3-hour Forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&appid=${WEATHER_API_KEY}&units=imperial`);
    
    if (!weatherRes.ok) return null;
    
    const wData = await weatherRes.json();
    const fData = await forecastRes.json();
    
    const now = new Date();
    
    const weather: WeatherData = {
      temp: Math.round(wData.main.temp),
      feelsLike: Math.round(wData.main.feels_like),
      condition: wData.weather[0].main,
      wind: `${Math.round(wData.wind.speed)} mph`,
      location: `${wData.name}, ${wData.sys.country}`,
      icon: mapConditionToIcon(wData.weather[0].main),
      date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Simple transformation of 3-hour chunks to daily view
    const dailyMap: any = {};
    fData.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { high: item.main.temp_max, low: item.main.temp_min, condition: item.weather[0].main };
      } else {
        dailyMap[date].high = Math.max(dailyMap[date].high, item.main.temp_max);
        dailyMap[date].low = Math.min(dailyMap[date].low, item.main.temp_min);
      }
    });

    const forecast: ForecastDay[] = Object.keys(dailyMap).slice(0, 7).map(date => {
      const d = new Date(date);
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        high: Math.round(dailyMap[date].high),
        low: Math.round(dailyMap[date].low),
        condition: dailyMap[date].condition,
        icon: mapConditionToIcon(dailyMap[date].condition)
      };
    });

    const hourly: HourlyForecast[] = fData.list.slice(0, 6).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }),
      temp: Math.round(item.main.temp),
      icon: mapConditionToIcon(item.weather[0].main)
    }));

    return {
      weather,
      forecast,
      hourly,
      panchang: MOCK_PANCHANG, // Fallback to mock for Vedic data
      insight: INITIAL_INSIGHT
    };
  } catch (e) {
    console.error("OpenWeatherMap fallback failed:", e);
    return null;
  }
}

/**
 * Maps weather condition strings to Material Symbol names
 */
const mapConditionToIcon = (condition: string): string => {
  if (!condition) return 'sunny';
  const c = condition.toLowerCase();
  if (c.includes('thunder') || c.includes('storm')) return 'thunderstorm';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('showers')) return 'rainy';
  if (c.includes('snow') || c.includes('ice') || c.includes('freezing')) return 'cloudy_snowing';
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'foggy';
  if (c.includes('partly') && c.includes('cloud')) return 'partly_cloudy_day';
  if (c.includes('cloud')) return 'cloud';
  if (c.includes('clear') || c.includes('sunny')) return 'sunny';
  if (c.includes('wind') || c.includes('breezy')) return 'air';
  return 'filter_drama';
};

export const getCitySuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  const key = process.env.API_KEY;
  if (!key) return [];
  
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for 5 major world cities starting with "${query}". Return ONLY a JSON array of strings: ["City, Country"].`,
    });
    const data = extractJson(response.text);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
};

export const searchWeatherForCity = async (query: string): Promise<SearchResult | null> => {
  if (!query) return null;
  const key = process.env.API_KEY;
  
  // If no Gemini key, use OWM immediately
  if (!key) {
    return fetchFallbackWeather(query);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    
    const prompt = `Perform a Google Search for LIVE weather and Vedic Panchang for "${query}". 
    Units: Fahrenheit.
    Strictly return ONLY JSON in this structure:
    {
      "weather": { "temp": number, "feelsLike": number, "condition": "string", "wind": "string", "location": "string" },
      "forecast": [ { "day": "3-LETTER-ABBREVIATION", "high": number, "low": number, "condition": "string" } ],
      "hourly": [ { "time": "string", "temp": number, "condition": "string" } ],
      "panchang": { 
        "tithi": "string", 
        "paksha": "string", 
        "sunrise": "string", 
        "sunset": "string", 
        "upcomingEvents": [{"date": "MMM DD", "name": "string", "type": "string"}],
        "rashifal": [{"sign": "string", "prediction": "string", "luckyNumber": "string", "luckyColor": "string"}] 
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    const raw = extractJson(response.text);
    if (!raw) throw new Error("Empty AI Response");

    const now = new Date();
    
    const hasRashifal = raw.panchang?.rashifal && Array.isArray(raw.panchang.rashifal) && raw.panchang.rashifal.length > 0;
    const hasEvents = raw.panchang?.upcomingEvents && Array.isArray(raw.panchang.upcomingEvents) && raw.panchang.upcomingEvents.length > 0;

    return {
      weather: {
        temp: raw.weather?.temp ?? INITIAL_WEATHER.temp,
        feelsLike: raw.weather?.feelsLike ?? INITIAL_WEATHER.feelsLike,
        condition: raw.weather?.condition ?? INITIAL_WEATHER.condition,
        wind: raw.weather?.wind ?? INITIAL_WEATHER.wind,
        location: raw.weather?.location || query,
        icon: mapConditionToIcon(raw.weather?.condition),
        date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      forecast: (raw.forecast && Array.isArray(raw.forecast) ? raw.forecast : MOCK_FORECAST).map((f: any) => ({
        day: (f.day || "DAY").substring(0, 3).toUpperCase(),
        high: f.high ?? 70,
        low: f.low ?? 60,
        condition: f.condition || "Cloudy",
        icon: mapConditionToIcon(f.condition)
      })).slice(0, 7),
      hourly: (raw.hourly && Array.isArray(raw.hourly) ? raw.hourly : MOCK_HOURLY).map((h: any) => ({
        time: h.time || "---",
        temp: h.temp ?? 70,
        icon: mapConditionToIcon(h.condition)
      })),
      panchang: {
        tithi: raw.panchang?.tithi || MOCK_PANCHANG.tithi,
        paksha: raw.panchang?.paksha || MOCK_PANCHANG.paksha,
        sunrise: raw.panchang?.sunrise || MOCK_PANCHANG.sunrise,
        sunset: raw.panchang?.sunset || MOCK_PANCHANG.sunset,
        upcomingEvents: hasEvents ? raw.panchang.upcomingEvents : MOCK_PANCHANG.upcomingEvents,
        rashifal: hasRashifal ? raw.panchang.rashifal : MOCK_PANCHANG.rashifal
      },
      insight: INITIAL_INSIGHT
    };
  } catch (e: any) {
    console.error("Gemini failed, switching to OWM fallback:", e);
    return fetchFallbackWeather(query);
  }
};

export const searchWeatherByCoords = async (lat: number, lon: number): Promise<SearchResult | null> => {
  if (!WEATHER_API_KEY) return null;
  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`);
    if (weatherRes.ok) {
        const wData = await weatherRes.json();
        return searchWeatherForCity(wData.name);
    }
  } catch (e) {
    console.error("Coords sync failed:", e);
  }
  return null;
};
