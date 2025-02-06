
import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { PrayerTime } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = "https://awqatsalah.diyanet.gov.tr/api/v1";

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

      try {
        // 1. Authenticate
        const authResponse = await fetch(`${API_BASE_URL}/Auth/Login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: "guest@diyanet.gov.tr",
            password: "guest123"
          })
        });

        if (!authResponse.ok) {
          throw new Error('Authentication failed');
        }

        const authData = await authResponse.json();
        const accessToken = authData.data.accessToken;

        // 2. Get prayer times
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `${API_BASE_URL}/PrayerTime/Daily/${location.lat},${location.lng}/${today}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }

        const data = await response.json();
        const prayerData = data.data[0];

        const prayerTimes = [
          { name: 'Fajr', arabicName: 'الفجر', time: prayerData.fajr },
          { name: 'Sunrise', arabicName: 'الشروق', time: prayerData.sunrise },
          { name: 'Dhuhr', arabicName: 'الظهر', time: prayerData.dhuhr },
          { name: 'Asr', arabicName: 'العصر', time: prayerData.asr },
          { name: 'Maghrib', arabicName: 'المغرب', time: prayerData.maghrib },
          { name: 'Isha', arabicName: 'العشاء', time: prayerData.isha }
        ] as PrayerTime[];

        // Mark current and next prayers
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeInMinutes = currentHours * 60 + currentMinutes;

        let currentPrayerIndex = -1;
        
        for (let i = prayerTimes.length - 1; i >= 0; i--) {
          const [hours, minutes] = prayerTimes[i].time.split(':').map(Number);
          const prayerTimeInMinutes = hours * 60 + minutes;
          
          if (currentTimeInMinutes >= prayerTimeInMinutes) {
            currentPrayerIndex = i;
            break;
          }
        }

        if (currentPrayerIndex === -1) {
          currentPrayerIndex = prayerTimes.length - 1;
        }

        const nextIndex = (currentPrayerIndex + 1) % prayerTimes.length;

        prayerTimes[currentPrayerIndex].isCurrentPrayer = true;
        prayerTimes[nextIndex].isNext = true;

        return {
          prayerTimes,
          hijriDate: prayerData.hijriDateShort || '',
        };
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    },
    enabled: !!location,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
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
