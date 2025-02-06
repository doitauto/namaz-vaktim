
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
        
        const nearestCity = data.address?.city || 
                          data.address?.town ||
                          data.address?.municipality ||
                          'Unbekannter Ort';
        
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

      // Format coordinates for Diyanet API
      const latDeg = Math.floor(Math.abs(location.lat));
      const latMin = Math.round((Math.abs(location.lat) - latDeg) * 60);
      const lonDeg = Math.floor(Math.abs(location.lng));
      const lonMin = Math.round((Math.abs(location.lng) - lonDeg) * 60);

      const latStr = `${latDeg.toString().padStart(2, '0')}${latMin.toString().padStart(2, '0')}N`;
      const lonStr = `${lonDeg.toString().padStart(3, '0')}${lonMin.toString().padStart(2, '0')}E`;

      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(
        `https://namazapi.diyanet.gov.tr/api/PrayerTimes/${latStr}/${lonStr}/${today}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();

      const prayerOrder = ['Imsak', 'Gunes', 'Ogle', 'Ikindi', 'Aksam', 'Yatsi'];
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      let currentPrayerIndex = -1;
      
      for (let i = prayerOrder.length - 1; i >= 0; i--) {
        const time = data[prayerOrder[i]];
        const [hours, minutes] = time.split(':').map(Number);
        const prayerTimeInMinutes = hours * 60 + minutes;
        
        if (currentTimeInMinutes >= prayerTimeInMinutes) {
          currentPrayerIndex = i;
          break;
        }
      }

      if (currentPrayerIndex === -1) {
        currentPrayerIndex = prayerOrder.length - 1;
      }

      const prayerTimes = prayerOrder.map((name, index) => {
        const time = data[name];
        const [hours, minutes] = time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        
        const isCurrentPrayer = index === currentPrayerIndex;
        const nextIndex = (currentPrayerIndex + 1) % prayerOrder.length;
        const isNext = index === nextIndex;

        // Map Turkish names to English/Arabic
        const prayerName = 
          name === 'Imsak' ? 'Fajr' :
          name === 'Gunes' ? 'Sunrise' :
          name === 'Ogle' ? 'Dhuhr' :
          name === 'Ikindi' ? 'Asr' :
          name === 'Aksam' ? 'Maghrib' :
          'Isha';

        const arabicName = 
          name === 'Imsak' ? 'الفجر' :
          name === 'Gunes' ? 'الشروق' :
          name === 'Ogle' ? 'الظهر' :
          name === 'Ikindi' ? 'العصر' :
          name === 'Aksam' ? 'المغرب' :
          'العشاء';

        return {
          name: prayerName,
          arabicName,
          time,
          isCurrentPrayer,
          isNext
        };
      }) as PrayerTime[];
      
      return {
        prayerTimes,
        hijriDate: data.HicriTarih || '',
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
