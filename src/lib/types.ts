
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
