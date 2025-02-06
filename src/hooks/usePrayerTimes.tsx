
import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { PrayerTime } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const usePrayerTimes = (latitude?: number, longitude?: number) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestLocation, setNearestLocation] = useState<string>('');

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

  useEffect(() => {
    const fetchLocationName = async () => {
      if (!location) return;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        const locationName = data.address?.suburb || 
                           data.address?.city_district || 
                           data.address?.town || 
                           data.address?.city || 
                           data.address?.village || 
                           'Unbekannter Ort';
                           
        setNearestLocation(locationName);
      } catch (error) {
        console.error('Error fetching location name:', error);
        setNearestLocation('Unbekannter Ort');
      }
    };

    fetchLocationName();
  }, [location]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['prayerTimes', location?.lat, location?.lng],
    queryFn: async () => {
      if (!location) return null;
      
      const params = new URLSearchParams({
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        method: '13',
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
        `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();
      
      const formatTime = (timeStr: string) => {
        try {
          return timeStr.split('T')[1].substring(0, 5);
        } catch (e) {
          console.error('Error formatting time:', e);
          return timeStr;
        }
      };

      const prayerTimes = [
        { name: 'Fajr', arabicName: 'الفجر', time: formatTime(data.data.timings.Fajr) },
        { name: 'Sunrise', arabicName: 'الشروق', time: formatTime(data.data.timings.Sunrise) },
        { name: 'Dhuhr', arabicName: 'الظهر', time: formatTime(data.data.timings.Dhuhr) },
        { name: 'Asr', arabicName: 'العصر', time: formatTime(data.data.timings.Asr) },
        { name: 'Maghrib', arabicName: 'المغرب', time: formatTime(data.data.timings.Maghrib) },
        { name: 'Isha', arabicName: 'العشاء', time: formatTime(data.data.timings.Isha) },
      ] as PrayerTime[];

      // Sortiere die Gebetszeiten basierend auf der aktuellen Zeit
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      const sortedPrayerTimes = prayerTimes.map(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTimeInMinutes = hours * 60 + minutes;
        return {
          ...prayer,
          minutesFromMidnight: prayerTimeInMinutes,
          hasPassedToday: prayerTimeInMinutes <= currentTimeInMinutes
        };
      }).sort((a, b) => {
        // Wenn beide Zeiten vergangen sind oder beide noch nicht, normal sortieren
        if (a.hasPassedToday === b.hasPassedToday) {
          return a.minutesFromMidnight - b.minutesFromMidnight;
        }
        // Wenn eine Zeit vergangen ist und die andere nicht, die nicht vergangene zuerst
        return a.hasPassedToday ? 1 : -1;
      });

      // Entferne die zusätzlichen Eigenschaften vor der Rückgabe
      const cleanedPrayerTimes = sortedPrayerTimes.map(({ name, arabicName, time }) => ({
        name,
        arabicName,
        time
      }));
      
      return {
        prayerTimes: cleanedPrayerTimes,
        hijriDate: `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`,
      };
    },
    enabled: !!location,
  });

  return { 
    prayerTimes: data?.prayerTimes || [], 
    hijriDate: data?.hijriDate || '',
    isLoading, 
    error, 
    location,
    nearestLocation 
  };
};
