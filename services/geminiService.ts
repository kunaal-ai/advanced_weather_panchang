
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherInsight, SearchResult, GroundingSource, PanchangData } from "../types";

const aiInstance = () => {
  const key = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
  if (!key) {
    console.warn("Gemini API Key missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

const toTitleCase = (str: string): string => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const sanitizeIcon = (icon: string): string => {
  const map: Record<string, string> = {
    'partly_sunimage': 'partly_cloudy_day',
    'partly_sunny': 'partly_cloudy_day',
    'partly_cloudy': 'partly_cloudy_day',
    'heavy_rain_image': 'rainy',
    'storm_icon': 'thunderstorm',
    'clear_night_icon': 'bedtime',
    'mostly_sunny': 'sunny',
    'mostly_cloudy': 'cloud',
    'scattered_showers': 'rainy_light',
    'light_rain': 'rainy_light',
    'rain': 'rainy',
    'sunny': 'sunny',
    'clear': 'sunny',
    'cloudy': 'cloud',
    'overcast': 'cloud',
    'storm': 'thunderstorm'
  };
  const normalized = (icon || '').toLowerCase().trim().replace(/\s+/g, '_');
  if (map[normalized]) return map[normalized];
  if (normalized.includes('sun')) return 'sunny';
  if (normalized.includes('rain')) return 'rainy';
  if (normalized.includes('cloud')) return 'cloud';
  if (normalized.includes('storm')) return 'thunderstorm';
  if (normalized.includes('clear')) return 'sunny';
  return 'cloud';
};

const ensureNumber = (val: any, fallback: number = 0): number => {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

export const getCitySuggestions = async (query: string): Promise<string[]> => {
  if (query.length < 2) return [];
  const ai = aiInstance();
  if (!ai) return [];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List up to 5 real-world cities matching "${query}". Return ONLY a JSON array of strings: ["City, Country"].`,
      config: {
        responseMimeType: "application/json",
      },
    });
    if (!response.text) return [];
    const parsed = JSON.parse(response.text.trim());
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const getGeminiWeatherInsight = async (condition: string): Promise<WeatherInsight> => {
  const ai = aiInstance();
  if (!ai) return { quote: "Perform your prescribed duties, for action is better than inaction.", meaning: "3.8" };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide exactly ONE meaningful English insight/quote from the Bhagavad Gita relevant to ${condition} weather. Do NOT include the Sanskrit shloka, only the English translation. Return ONLY JSON: {"quote": "The English insight text", "meaning": "9.19"}.`,
      config: {
        responseMimeType: "application/json",
      },
    });
    if (!response.text) return { quote: "Perform your duty.", meaning: "3.8" };
    const parsed = JSON.parse(response.text.trim());
    return {
      quote: (parsed.quote || "Perform your duty.").split('\n')[0].trim(),
      meaning: parsed.meaning || "3.8"
    };
  } catch (error) {
    return { quote: "Rise through the efforts of your own mind.", meaning: "6.5" };
  }
};

const processGeminiResponse = (response: any): SearchResult | null => {
  const text = response.text || "";
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    console.error("No valid JSON found in response");
    return null;
  }

  const jsonString = text.substring(firstBrace, lastBrace + 1);

  try {
    const rawData = JSON.parse(jsonString);
    if (!rawData || typeof rawData !== 'object') return null;

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      });
    }

    const now = new Date();
    
    // Process Weather
    const weather = {
      temp: ensureNumber(rawData.weather?.temp, 72),
      feelsLike: ensureNumber(rawData.weather?.feelsLike, 70),
      condition: toTitleCase(rawData.weather?.condition || "Clear"),
      wind: rawData.weather?.wind || "5 mph",
      location: rawData.weather?.location || "Unknown",
      icon: sanitizeIcon(rawData.weather?.icon || rawData.weather?.condition || "sunny"),
      date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources
    };

    // Process Forecast
    const forecast = (Array.isArray(rawData.forecast) ? rawData.forecast : []).map((f: any) => ({
      day: f.day || "Day",
      icon: sanitizeIcon(f.icon || f.condition || "cloud"),
      high: ensureNumber(f.high, 75),
      low: ensureNumber(f.low, 60),
      condition: toTitleCase(f.condition || "Cloudy")
    }));

    // Process Hourly
    const hourly = (Array.isArray(rawData.hourly) ? rawData.hourly : []).map((h: any) => ({
      time: h.time || "--",
      icon: sanitizeIcon(h.icon || "cloud"),
      temp: ensureNumber(h.temp, 70)
    }));

    // Process Panchang
    const panchang: PanchangData = {
      tithi: rawData.panchang?.tithi || "N/A",
      paksha: rawData.panchang?.paksha || "N/A",
      sunrise: rawData.panchang?.sunrise || "--:-- AM",
      sunset: rawData.panchang?.sunset || "--:-- PM",
      upcomingEvents: (Array.isArray(rawData.panchang?.upcomingEvents) ? rawData.panchang.upcomingEvents : []).slice(0, 7),
      rashifal: Array.isArray(rawData.panchang?.rashifal) ? rawData.panchang.rashifal : []
    };

    // Process Insight
    const rawInsight = rawData.insight || {};
    const insight = {
      quote: (rawInsight.quote || "Perform your duty.").split('\n')[0].trim(),
      meaning: rawInsight.meaning || "2.47"
    };

    return { weather, forecast, hourly, panchang, insight };
  } catch (e) {
    console.error("Critical Parse Error in jsonString:", jsonString, e);
    return null;
  }
};

export const searchWeatherForCity = async (city: string): Promise<SearchResult | null> => {
  const ai = aiInstance();
  if (!ai) return null;
  try {
    const prompt = `SEARCH FOR CURRENT REAL-TIME WEATHER FOR "${city}" RIGHT NOW. 
    USE GOOGLE SEARCH TO VERIFY THE ABSOLUTE LATEST TEMPERATURE IN FAHRENHEIT.
    DANGER: IF YOU FIND CELSIUS, CONVERT IT TO FAHRENHEIT. DO NOT BE WRONG.
    EXAMPLE: IF IT IS 44°F, DO NOT REPORT IT AS 34°F. BE PRECISE.
    
    Also provide full Vedic Panchang including exactly 7 upcoming Hindu festivals/events.
    
    STRICT JSON OUTPUT ONLY:
    {
      "weather": { "temp": number, "condition": "Title Case string", "feelsLike": number, "wind": "10 mph", "location": "City Name", "icon": "sunny" },
      "forecast": [ { "day": "Mon", "icon": "sunny", "high": number, "low": number, "condition": "Sunny" } ],
      "hourly": [ { "time": "12 PM", "icon": "cloudy", "temp": number } ],
      "panchang": { 
        "tithi": string, "paksha": string, "sunrise": string, "sunset": string, 
        "upcomingEvents": [ { "date": "Oct 15", "name": "Festival Name", "type": "Festival" } ],
        "rashifal": [ { "sign": "Aries", "prediction": "text", "luckyNumber": "7", "luckyColor": "Red" } ]
      },
      "insight": { "quote": "EXACTLY ONE meaningful English insight/quote from the Bhagavad Gita", "meaning": "9.19" }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return processGeminiResponse(response);
  } catch (error) {
    console.error("Search API Error:", error);
    return null;
  }
};

export const searchWeatherByCoords = async (lat: number, lon: number): Promise<SearchResult | null> => {
  const ai = aiInstance();
  if (!ai) return null;
  try {
    const prompt = `SEARCH WEATHER AND PANCHANG for coords ${lat}, ${lon}. 
    Use Google Search for CURRENT accurate real-time Fahrenheit temperature. 
    Convert all Celsius values to Fahrenheit. Return 7 upcoming Hindu festivals.
    JSON same as city search. Return meaningful English Gita quotes only.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return processGeminiResponse(response);
  } catch (error) {
    return null;
  }
};
