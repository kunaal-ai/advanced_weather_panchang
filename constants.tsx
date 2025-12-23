
import { WeatherData, ForecastDay, HourlyForecast, PanchangData, WeatherInsight, Rashifal } from './types.ts';

export const INITIAL_WEATHER: WeatherData = {
  temp: 72,
  condition: "Heavy Rain",
  feelsLike: 68,
  location: "San Francisco",
  icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYuSUsiv3b3YXKjnKr-H_aaJd29W7yCKpIqfDTC7QkHU8_YtFqYOZDWLt-C6CsXlAJ6jn1357L-CuTCfvp-8dv4X0YxusF0je1YfEeQYrvJXzC-ucED_bzWL2M1BZP7UswxMQ3YejPCJ3x1wpvhDHWeEvE_3wakZRXkEYC2os8tlHaLnSAYxauiwp68isu3zZYwDAzpkZy_zPGAbhWUbJmKA7opy_QLm54g7o5Z3iuxylA12p6xfVxbEKJDF_DIr26LTv5IRScww",
  date: "Monday, 14 Oct",
  time: "10:23 AM"
};

const MOCK_RASHIFAL: Rashifal[] = [
  { 
    sign: "Mesh (Aries)", 
    prediction: "A powerful alignment of Mars suggests a day for bold career moves. Your energy will be contagious, leading to a breakthrough in a stalled project. Stay hydrated and avoid minor arguments.",
    luckyNumber: "9",
    luckyColor: "Red"
  },
  { 
    sign: "Vrishabh (Taurus)", 
    prediction: "Venus brings a wave of harmony to your personal relationships. It's an excellent time for financial planning and stable investments. A surprise gift from a loved one might brighten your evening.",
    luckyNumber: "6",
    luckyColor: "White"
  },
  { 
    sign: "Mithun (Gemini)", 
    prediction: "Communication is your greatest tool today. Expect a phone call that opens new doors for travel or higher education. Keep your focus steady and don't let distractions ruin your productivity.",
    luckyNumber: "5",
    luckyColor: "Green"
  },
  { 
    sign: "Kark (Cancer)", 
    prediction: "The Moon's influence encourages emotional depth and intuition. Trust your gut feeling when dealing with family matters. A peaceful evening spent at home will rejuvenate your spirit for the week ahead.",
    luckyNumber: "2",
    luckyColor: "Silver"
  },
  { 
    sign: "Simha (Leo)", 
    prediction: "Your natural charisma is at an all-time high today. Solar energy supports creative pursuits and public speaking. Lead with confidence, but ensure you listen to the needs of your team members.",
    luckyNumber: "1",
    luckyColor: "Gold"
  },
  { 
    sign: "Kanya (Virgo)", 
    prediction: "Meticulous planning pays off in unexpected ways. Mercury sharpens your analytical mind, helping you solve complex puzzles. Take a small break to walk in nature to maintain your mental clarity.",
    luckyNumber: "4",
    luckyColor: "Blue"
  },
];

export const MOCK_FORECAST: ForecastDay[] = [
  { day: "Today", icon: "rainy", high: 72, low: 65, condition: "Rain" },
  { day: "Tue", icon: "sunny", high: 75, low: 62, condition: "Sun" },
  { day: "Wed", icon: "partly_cloudy_day", high: 70, low: 60, condition: "Cloudy" },
  { day: "Thu", icon: "cloud", high: 68, low: 58, condition: "Overcast" },
  { day: "Fri", icon: "thunderstorm", high: 65, low: 55, condition: "Storm" },
  { day: "Sat", icon: "sunny", high: 78, low: 64, condition: "Sun" },
  { day: "Sun", icon: "sunny", high: 80, low: 66, condition: "Sun" },
];

export const MOCK_HOURLY: HourlyForecast[] = [
  { time: "Now", icon: "thunderstorm", temp: 72 },
  { time: "11 AM", icon: "rainy", temp: 70 },
  { time: "12 PM", icon: "cloudy", temp: 69 },
  { time: "1 PM", icon: "partly_cloudy_day", temp: 71 },
  { time: "2 PM", icon: "sunny", temp: 74 },
  { time: "3 PM", icon: "sunny", temp: 75 },
];

export const MOCK_PANCHANG: PanchangData = {
  tithi: "Ekadashi",
  paksha: "Shukla Paksha",
  sunrise: "06:34 AM",
  sunset: "06:12 PM",
  upcomingFestival: "Papmochani Ekadashi",
  rashifal: MOCK_RASHIFAL
};

export const INITIAL_INSIGHT: WeatherInsight = {
  quote: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
  meaning: "Bhagavad Gita 2.47"
};
