
import { ExtendedPrayerTime, TimeRange } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { formatDate, getDaysToFetch } from "@/lib/prayer-utils";

interface UsePrayerTimesQueryProps {
  timeRange: TimeRange;
  latitude?: number;
  longitude?: number;
}

export const usePrayerTimesQuery = ({ timeRange, latitude, longitude }: UsePrayerTimesQueryProps) => {
  return useQuery({
    queryKey: ['prayerTimes', timeRange, latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) return [];

      const days = getDaysToFetch(timeRange);
      const dates = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
      });

      // Batch die Anfragen in Gruppen von 10
      const batchSize = 10;
      const results: ExtendedPrayerTime[] = [];

      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        
        // Warte 1 Sekunde zwischen den Batches
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const batchResults = await Promise.all(
          batch.map(async (date) => {
            const timestamp = Math.floor(date.getTime() / 1000);
            
            const params = new URLSearchParams({
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              method: '13',
              shafaq: 'general',
              tune: '11,1,-7,5,-34,6,6,-7,-6',
              school: '1',
              midnightMode: '0',
              timezonestring: 'Europe/Berlin',
              latitudeAdjustmentMethod: '1',
              calendarMethod: 'DIYANET',
              adjustment: '1'
            });

            try {
              const response = await fetch(
                `https://api.aladhan.com/v1/timings/${timestamp}?${params.toString()}`
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              return {
                date: formatDate(date.toISOString()),
                fajr: data.data.timings.Fajr,
                sunrise: data.data.timings.Sunrise,
                dhuhr: data.data.timings.Dhuhr,
                asr: data.data.timings.Asr,
                maghrib: data.data.timings.Maghrib,
                isha: data.data.timings.Isha
              };
            } catch (error) {
              console.error(`Error fetching prayer times for ${date}:`, error);
              throw error;
            }
          })
        );

        results.push(...batchResults);
      }

      return results;
    },
    enabled: !!latitude && !!longitude,
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 60, // Cache für 1 Stunde
    gcTime: 1000 * 60 * 60 * 24, // Cache für 24 Stunden behalten
  });
};
