
import { WeatherData, ForecastDay, HourlyForecast, PanchangData, WeatherInsight, Rashifal, VedicEvent } from './types';

export const INITIAL_WEATHER: WeatherData = {
  temp: 72,
  condition: "Heavy Rain",
  feelsLike: 68,
  wind: "12 mph",
  location: "San Francisco",
  icon: "rainy",
  date: "Monday, 14 Oct",
  time: "10:23 AM"
};

export const GITA_QUOTES: WeatherInsight[] = [
  {
    quote: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    meaning: "Bhagavad Gita 2.47"
  },
  {
    quote: "Man is made by his belief. As he believes, so he is.",
    meaning: "Bhagavad Gita 17.3"
  },
  {
    quote: "The soul is neither born, nor does it ever die.",
    meaning: "Bhagavad Gita 2.20"
  },
  {
    quote: "Change is the law of the universe. You can be a millionaire, or a pauper in a moment.",
    meaning: "Bhagavad Gita 2.12"
  },
  {
    quote: "One who has control over the mind is tranquil in heat and cold, in pleasure and pain, and in honor and dishonor.",
    meaning: "Bhagavad Gita 6.7"
  },
  {
    quote: "A person can rise through the efforts of his own mind; or draw himself down, in the same manner. Because each person is his own friend or enemy.",
    meaning: "Bhagavad Gita 6.5"
  },
  {
    quote: "Hell has three gates: lust, anger and greed.",
    meaning: "Bhagavad Gita 16.21"
  },
  {
    quote: "Perform your obligatory duty, for action is indeed better than inaction.",
    meaning: "Bhagavad Gita 3.8"
  },
  {
    quote: "Whatever action a great man performs, common men follow.",
    meaning: "Bhagavad Gita 3.21"
  },
  {
    quote: "There is neither this world, nor the world beyond, nor happiness for the one who doubts.",
    meaning: "Bhagavad Gita 4.40"
  },
  {
    quote: "Delusion arises from anger. The mind is bewildered by delusion. Reasoning is destroyed when the mind is bewildered.",
    meaning: "Bhagavad Gita 2.63"
  },
  {
    quote: "The peace of God is with them whose mind and soul are in harmony, who are free from desire and wrath, who know their own soul.",
    meaning: "Bhagavad Gita 5.26"
  }
];

export const INITIAL_INSIGHT = GITA_QUOTES[0];

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

const MOCK_EVENTS: VedicEvent[] = [
  { date: "Oct 14", name: "Papmochani Ekadashi", type: "Ekadashi" },
  { date: "Oct 15", name: "Auspicious Marriage Muhurat", type: "Auspicious" },
  { date: "Oct 17", name: "Pradosh Vrat", type: "Auspicious" },
  { date: "Oct 20", name: "Sharad Purnima", type: "Purnima" },
  { date: "Oct 24", name: "Karwa Chauth", type: "Festival" },
  { date: "Oct 27", name: "Rama Ekadashi", type: "Ekadashi" },
  { date: "Oct 29", name: "Dhanteras", type: "Festival" },
  { date: "Oct 31", name: "Deepawali", type: "Festival" },
  { date: "Nov 02", name: "Govardhan Puja", type: "Festival" },
  { date: "Nov 03", name: "Bhai Dooj", type: "Festival" },
];

export const MOCK_PANCHANG: PanchangData = {
  tithi: "Ekadashi",
  paksha: "Shukla Paksha",
  sunrise: "06:34 AM",
  sunset: "06:12 PM",
  upcomingEvents: MOCK_EVENTS,
  rashifal: MOCK_RASHIFAL
};
