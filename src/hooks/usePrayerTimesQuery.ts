
import { ExtendedPrayerTime, TimeRange } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { formatDate, getDaysToFetch } from "@/lib/prayer-utils";
import { useToast } from "@/components/ui/use-toast";

interface UsePrayerTimesQueryProps {
  timeRange: TimeRange;
  latitude?: number;
  longitude?: number;
}

export const usePrayerTimesQuery = ({ timeRange, latitude, longitude }: UsePrayerTimesQueryProps) => {
  const { toast } = useToast();

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

      // Batch requests in groups of 5
      const batchSize = 5;
      const results: ExtendedPrayerTime[] = [];
      let failedRequests = 0;

      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        try {
          const batchResults = await Promise.all(
            batch.map(async (date) => {
              // Format date as YYYY-MM-DD
              const formattedDate = date.toISOString().split('T')[0];
              
              // Diyanet API requires coordinates in DDMM format
              const latDeg = Math.floor(Math.abs(latitude));
              const latMin = Math.round((Math.abs(latitude) - latDeg) * 60);
              const lonDeg = Math.floor(Math.abs(longitude));
              const lonMin = Math.round((Math.abs(longitude) - lonDeg) * 60);

              const latStr = `${latDeg.toString().padStart(2, '0')}${latMin.toString().padStart(2, '0')}N`;
              const lonStr = `${lonDeg.toString().padStart(3, '0')}${lonMin.toString().padStart(2, '0')}E`;

              const response = await fetch(
                `https://namazapi.diyanet.gov.tr/api/PrayerTimes/${latStr}/${lonStr}/${formattedDate}`
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              return {
                date: formatDate(date.toISOString()),
                fajr: data.Imsak,
                sunrise: data.Gunes,
                dhuhr: data.Ogle,
                asr: data.Ikindi,
                maghrib: data.Aksam,
                isha: data.Yatsi
              };
            })
          );

          results.push(...batchResults);
        } catch (error) {
          console.error(`Error fetching prayer times batch:`, error);
          failedRequests++;

          if (failedRequests > 3) {
            toast({
              title: "API Error",
              description: "Zu viele fehlgeschlagene Anfragen. Bitte versuchen Sie es später erneut.",
              variant: "destructive",
            });
            throw new Error("Zu viele fehlgeschlagene Anfragen");
          }

          await new Promise(resolve => setTimeout(resolve, 3000));
          i -= batchSize; // Diesen Batch erneut versuchen
        }
      }

      return results;
    },
    enabled: !!latitude && !!longitude,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
    staleTime: 1000 * 60 * 60, // Cache für 1 Stunde
    gcTime: 1000 * 60 * 60 * 24, // Im Garbage Collection für 24 Stunden behalten
  });
};
