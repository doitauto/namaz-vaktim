
import { TimeRange } from "@/lib/types";

export const getPrayerTitle = (timeRange: TimeRange, lang: 'tr' | 'de') => {
  if (lang === 'tr') {
    switch (timeRange) {
      case 'weekly':
        return 'Haftalık Namaz Vakitleri';
      case 'monthly':
        return 'Aylık Namaz Vakitleri';
      case 'yearly':
        return 'Yıllık Namaz Vakitleri';
    }
  } else {
    switch (timeRange) {
      case 'weekly':
        return 'Wöchentliche Gebetszeiten';
      case 'monthly':
        return 'Monatliche Gebetszeiten';
      case 'yearly':
        return 'Jährliche Gebetszeiten';
    }
  }
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE');
};

export const getDaysToFetch = (timeRange: TimeRange) => {
  switch (timeRange) {
    case 'weekly':
      return 7;
    case 'monthly':
      return 30;
    case 'yearly':
      return 365;
    default:
      return 7;
  }
};

