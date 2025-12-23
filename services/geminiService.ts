
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherInsight, SearchResult, GroundingSource } from "../types";

const aiInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiWeatherInsight = async (condition: string): Promise<WeatherInsight> => {
  const ai = aiInstance();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short motivational quote from the Bhagavad Gita (in English only) that is relevant to the overall mood or atmosphere for the weather condition: "${condition}". 
      
      RULES:
      1. DO NOT include any Sanskrit. 
      2. The quote MUST be less than 20 words.
      3. Use the "quote" field for the text of the quote.
      4. Use the "meaning" field for the Chapter and Verse reference (e.g., "Bhagavad Gita 2.47").`,
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
    return {
      ...rawData,
      weather: {
        ...rawData.weather,
        date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
        icon: rawData.weather.icon || "cloudy"
      }
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

const GENERATE_WEATHER_PROMPT = (query: string) => `
  Get the real-time weather and detailed Vedic Panchang for "${query}".
  
  IMPORTANT: 
  1. ALL temperature values MUST be in FAHRENHEIT.
  2. For the "panchang" section, provide "upcomingEvents" as a list of festivals, Purnimas, Amavasyas, Ekadashis, and auspicious days for the NEXT 15 DAYS starting from today.
  
  For the "insight" section:
  1. Provide a short motivational quote from the Bhagavad Gita in English only.
  2. NO SANSKRIT.
  3. The quote MUST be less than 20 words.
  4. "quote" is the text, "meaning" is the Chapter and Verse reference.

  Provide the data in a STRICT valid JSON format inside a code block.
  JSON structure:
  {
    "weather": { 
      "temp": number, 
      "condition": "string", 
      "feelsLike": number, 
      "wind": "string (e.g. 10 mph)",
      "location": "string", 
      "icon": "material-icon-name" 
    },
    "forecast": [ { "day": "short-day", "icon": "material-icon-name", "high": number, "low": number, "condition": "string" } ],
    "hourly": [ { "time": "string", "icon": "material-icon-name", "temp": number } ],
    "panchang": { 
      "tithi": "string", 
      "paksha": "string", 
      "sunrise": "string", 
      "sunset": "string", 
      "upcomingEvents": [ { "date": "string (e.g. Oct 14)", "name": "string", "type": "Festival | Purnima | Amavasya | Ekadashi | Auspicious | Other" } ],
      "rashifal": [ { "sign": "string", "prediction": "string", "luckyNumber": "string", "luckyColor": "string" } ]
    },
    "insight": { "quote": "English-only Gita quote", "meaning": "Chapter & Verse" }
  }
  Use Material Symbol icon names (e.g., 'sunny', 'rainy', 'cloud', 'thunderstorm', 'cloudy', 'mist', 'wind', 'snow').
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
