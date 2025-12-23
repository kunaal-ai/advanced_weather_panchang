
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherInsight, SearchResult, GroundingSource } from "../types";

// Always initialize with process.env.API_KEY as per guidelines.
const aiInstance = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("Gemini API Key is missing. Using fallback/mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

const sanitizeIcon = (icon: string): string => {
  const map: Record<string, string> = {
    'partly_sunimage': 'partly_cloudy_day',
    'partly_sunny': 'partly_cloudy_day',
    'heavy_rain_image': 'rainy',
    'storm_icon': 'thunderstorm',
    'clear_night_icon': 'bedtime',
    'mostly_sunny': 'sunny',
    'mostly_cloudy': 'cloud',
    'scattered_showers': 'rainy_light',
    'light_rain': 'rainy_light'
  };
  const normalized = (icon || '').toLowerCase().trim();
  return map[normalized] || normalized;
};

export const getCitySuggestions = async (query: string): Promise<string[]> => {
  if (query.length < 2) return [];
  const ai = aiInstance();
  if (!ai) return [];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Return a list of up to 5 real-world city names and their countries that match the search query: "${query}". 
      Respond ONLY with a JSON array of strings, e.g., ["London, UK", "London, Ontario, Canada"].`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
      },
    });
    return response.text ? JSON.parse(response.text.trim()) : [];
  } catch (error) {
    console.error("Suggestions Error:", error);
    return [];
  }
};

export const getGeminiWeatherInsight = async (condition: string): Promise<WeatherInsight> => {
  const ai = aiInstance();
  if (!ai) return { quote: "Perform your obligatory duty, for action is better than inaction.", meaning: "Bhagavad Gita 3.8" };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short motivational quote from the Bhagavad Gita (in English only) that is relevant to the weather condition: "${condition}". 
      RULES:
      1. DO NOT include any Sanskrit. 
      2. The quote MUST be less than 20 words.
      3. Use the "quote" field for the text.
      4. Use the "meaning" field for the Chapter and Verse reference.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            meaning: { type: Type.STRING },
          },
          required: ["quote", "meaning"],
        },
      },
    });
    return response.text ? JSON.parse(response.text.trim()) : { quote: "Perform your duty.", meaning: "Bhagavad Gita 3.8" };
  } catch (error) {
    return { 
      quote: "A person can rise through the efforts of their own mind.", 
      meaning: "Bhagavad Gita 6.5" 
    };
  }
};

const processGeminiResponse = (response: any): SearchResult | null => {
  const text = response.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const rawData = JSON.parse(jsonMatch[0]);
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    const now = new Date();
    if (rawData.weather) rawData.weather.icon = sanitizeIcon(rawData.weather.icon);
    if (rawData.forecast) {
      rawData.forecast = rawData.forecast.map((f: any) => ({ ...f, icon: sanitizeIcon(f.icon) }));
    }
    if (rawData.hourly) {
      rawData.hourly = rawData.hourly.map((h: any) => ({ ...h, icon: sanitizeIcon(h.icon) }));
    }

    return {
      ...rawData,
      weather: {
        ...rawData.weather,
        date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
        icon: (rawData.weather && rawData.weather.icon) || "cloudy"
      }
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

const GENERATE_WEATHER_PROMPT = (query: string) => `
  TASK: Fetch REAL-TIME weather and Vedic Panchang for "${query}".
  URGENT DATA ACCURACY RULES:
  1. USE GOOGLE SEARCH to find the exact current temperature (Fahrenheit) for "${query}" right now. 
  2. PRIORITIZE search results over internal knowledge.
  3. ICON WHITELIST: 'sunny', 'partly_cloudy_day', 'cloud', 'cloudy', 'rainy', 'thunderstorm', 'snow', 'mist', 'fog', 'wind', 'bedtime'.
  
  Return ONLY valid JSON:
  {
    "weather": { "temp": number, "condition": "string", "feelsLike": number, "wind": "string", "location": "string", "icon": "string" },
    "forecast": [ { "day": "string", "icon": "string", "high": number, "low": number, "condition": "string" } ],
    "hourly": [ { "time": "string", "icon": "string", "temp": number } ],
    "panchang": { 
      "tithi": "string", "paksha": "string", "sunrise": "string", "sunset": "string",
      "upcomingEvents": [ { "date": "Oct 14", "name": "string", "type": "Festival | Purnima | Amavasya | Ekadashi | Auspicious | Other" } ],
      "rashifal": [ { "sign": "string", "prediction": "string", "luckyNumber": "string", "luckyColor": "string" } ]
    },
    "insight": { "quote": "string", "meaning": "Bhagavad Gita X.Y" }
  }
`;

export const searchWeatherForCity = async (city: string): Promise<SearchResult | null> => {
  const ai = aiInstance();
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: GENERATE_WEATHER_PROMPT(city),
      config: { tools: [{ googleSearch: {} }] },
    });
    return processGeminiResponse(response);
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
};

export const searchWeatherByCoords = async (lat: number, lon: number): Promise<SearchResult | null> => {
  const ai = aiInstance();
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: GENERATE_WEATHER_PROMPT(`current weather for coordinates ${lat}, ${lon}`),
      config: { tools: [{ googleSearch: {} }] },
    });
    return processGeminiResponse(response);
  } catch (error) {
    console.error("Coords Search Error:", error);
    return null;
  }
};
