export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
  isCurrentPrayer?: boolean;
  isNext?: boolean;
}

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface SavedLocation {
  id: string;
  city: City;
  timestamp: number;
}

export interface ExtendedPrayerTime {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export type TimeRange = 'weekly' | 'monthly' | 'yearly';
