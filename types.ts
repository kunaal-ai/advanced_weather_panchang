
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Rashifal {
  sign: string;
  prediction: string;
  luckyNumber: string;
  luckyColor: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  feelsLike: number;
  location: string;
  icon: string;
  date: string;
  time: string;
  sources?: GroundingSource[];
}

export interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  condition: string;
}

export interface HourlyForecast {
  time: string;
  icon: string;
  temp: number;
}

export interface PanchangData {
  tithi: string;
  paksha: string;
  nakshatra: string;
  nakshatraEnd: string;
  sunrise: string;
  sunset: string;
  upcomingFestival: string;
  rashifal?: Rashifal[];
}

export interface WeatherInsight {
  quote: string;
  meaning: string;
}

export interface SearchResult {
  weather: WeatherData;
  forecast: ForecastDay[];
  hourly: HourlyForecast[];
  panchang: PanchangData;
  insight: WeatherInsight;
}
