import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { PrayerTime } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const usePrayerTimes = (latitude?: number, longitude?: number) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setLocation({ lat: latitude, lng: longitude });
      return;
    }

    const getCurrentPosition = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getCurrentPosition();
  }, [latitude, longitude]);

  const { data: prayerTimes, isLoading, error } = useQuery({
    queryKey: ['prayerTimes', location?.lat, location?.lng],
    queryFn: async () => {
      if (!location) return null;
      
      const params = new URLSearchParams({
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        method: '13', // DIYANET method
        shafaq: 'general',
        tune: '11,1,-7,5,-34,6,6,-7,-6',
        school: '1',
        midnightMode: '0',
        timezonestring: 'Europe/Berlin',
        latitudeAdjustmentMethod: '1',
        calendarMethod: 'DIYANET',
        adjustment: '1',
        iso8601: 'true'
      });

      const response = await fetch(
        `http://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();
      
      return [
        { name: 'Fajr', arabicName: 'الفجر', time: data.data.timings.Fajr },
        { name: 'Sunrise', arabicName: 'الشروق', time: data.data.timings.Sunrise },
        { name: 'Dhuhr', arabicName: 'الظهر', time: data.data.timings.Dhuhr },
        { name: 'Asr', arabicName: 'العصر', time: data.data.timings.Asr },
        { name: 'Maghrib', arabicName: 'المغرب', time: data.data.timings.Maghrib },
        { name: 'Isha', arabicName: 'العشاء', time: data.data.timings.Isha },
      ] as PrayerTime[];
    },
    enabled: !!location,
  });

  return { prayerTimes, isLoading, error, location };
};