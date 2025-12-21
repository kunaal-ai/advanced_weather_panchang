
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherInsight, SearchResult, GroundingSource } from "../types";

const aiInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiWeatherInsight = async (condition: string): Promise<WeatherInsight> => {
  const ai = aiInstance();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a relevant short Sanskrit weather-related quote and its English meaning for the weather condition: "${condition}".`,
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
    return response.text ? JSON.parse(response.text.trim()) : { quote: "", meaning: "" };
  } catch (error) {
    return { quote: "Adityaat Jaayate Vrishtihi", meaning: "From the Sun comes rain." };
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
    return {
      ...rawData,
      weather: {
        ...rawData.weather,
        date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
        icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYuSUsiv3b3YXKjnKr-H_aaJd29W7yCKpIqfDTC7QkHU8_YtFqYOZDWLt-C6CsXlAJ6jn1357L-CuTCfvp-8dv4X0YxusF0je1YfEeQYrvJXzC-ucED_bzWL2M1BZP7UswxMQ3YejPCJ3x1wpvhDHWeEvE_3wakZRXkEYC2os8tlHaLnSAYxauiwp68isu3zZYwDAzpkZy_zPGAbhWUbJmKA7opy_QLm54g7o5Z3iuxylA12p6xfVxbEKJDF_DIr26LTv5IRScww"
      }
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

const GENERATE_WEATHER_PROMPT = (query: string) => `
  Get the real-time weather and Vedic Panchang for "${query}".
  Include the "Detailed Daily Rashifal" (Horoscope) for the 12 zodiac signs (Mesh, Vrishabh, Mithun, Kark, Simha, Kanya, Tula, Vrishchik, Dhanu, Makar, Kumbh, Meena).
  For each sign, provide:
  1. A detailed 3-sentence prediction covering career, health, and personal life.
  2. A "Lucky Number" (1-9).
  3. A "Lucky Color".

  Provide the data in a STRICT valid JSON format inside a code block.
  JSON structure:
  {
    "weather": { "temp": number, "condition": "string", "feelsLike": number, "location": "string", "icon": "material-icon-name" },
    "forecast": [ { "day": "short-day", "icon": "material-icon-name", "high": number, "low": number, "condition": "string" } ],
    "hourly": [ { "time": "string", "icon": "material-icon-name", "temp": number } ],
    "panchang": { 
      "tithi": "string", 
      "paksha": "string", 
      "nakshatra": "string", 
      "nakshatraEnd": "string", 
      "sunrise": "string", 
      "sunset": "string", 
      "upcomingFestival": "string",
      "rashifal": [ { "sign": "string", "prediction": "string", "luckyNumber": "string", "luckyColor": "string" } ]
    },
    "insight": { "quote": "Sanskrit-quote", "meaning": "English-meaning" }
  }
  Use Material Symbol icon names (e.g., 'sunny', 'rainy', 'cloud', 'thunderstorm').
`;

export const searchWeatherForCity = async (city: string): Promise<SearchResult | null> => {
  const ai = aiInstance();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: GENERATE_WEATHER_PROMPT(city),
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return processGeminiResponse(response);
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
};

export const searchWeatherByCoords = async (lat: number, lon: number): Promise<SearchResult | null> => {
  const ai = aiInstance();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: GENERATE_WEATHER_PROMPT(`coordinates ${lat}, ${lon}`),
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return processGeminiResponse(response);
  } catch (error) {
    console.error("Coords Search Error:", error);
    return null;
  }
};
