
import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { PrayerTime } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const usePrayerTimes = (latitude?: number, longitude?: number) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestLocation, setNearestLocation] = useState<string>('');
  const [parentLocation, setParentLocation] = useState<string>('');

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
        
        // Get the nearest city/town
        const nearestCity = data.address?.city || 
                          data.address?.town ||
                          data.address?.municipality ||
                          'Unbekannter Ort';
        
        // Get the county/district
        const district = data.address?.county || 
                        data.address?.state_district;
        
        setNearestLocation(nearestCity);
        setParentLocation(district || '');
      } catch (error) {
        console.error('Error fetching location name:', error);
        setNearestLocation('Unbekannter Ort');
        setParentLocation('');
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

      const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      let currentPrayerIndex = -1;
      
      // Find the current prayer time
      for (let i = prayerOrder.length - 1; i >= 0; i--) {
        const time = formatTime(data.data.timings[prayerOrder[i]]);
        const [hours, minutes] = time.split(':').map(Number);
        const prayerTimeInMinutes = hours * 60 + minutes;
        
        if (currentTimeInMinutes >= prayerTimeInMinutes) {
          currentPrayerIndex = i;
          break;
        }
      }

      // If no prayer time is found before current time, it means we're after Isha
      // So the current prayer is still Isha (last prayer of the day)
      if (currentPrayerIndex === -1) {
        currentPrayerIndex = prayerOrder.length - 1;
      }

      const prayerTimes = prayerOrder.map((name, index) => {
        const time = formatTime(data.data.timings[name]);
        const [hours, minutes] = time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        
        // Set current prayer based on the found index
        const isCurrentPrayer = index === currentPrayerIndex;
        
        // Find the next prayer time
        let isNext = false;
        const nextIndex = (currentPrayerIndex + 1) % prayerOrder.length;
        isNext = index === nextIndex;

        return {
          name,
          arabicName: name === 'Fajr' ? 'الفجر' :
                     name === 'Sunrise' ? 'الشروق' :
                     name === 'Dhuhr' ? 'الظهر' :
                     name === 'Asr' ? 'العصر' :
                     name === 'Maghrib' ? 'المغرب' :
                     'العشاء',
          time,
          isCurrentPrayer,
          isNext
        };
      }) as PrayerTime[];
      
      return {
        prayerTimes,
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
    nearestLocation,
    parentLocation 
  };
};
