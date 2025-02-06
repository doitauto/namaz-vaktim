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

      // Batch requests in groups of 5 (reduced from 10 to minimize server load)
      const batchSize = 5;
      const results: ExtendedPrayerTime[] = [];
      let failedRequests = 0;

      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        
        // Wait 2 seconds between batches (increased from 1 second)
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        try {
          const batchResults = await Promise.all(
            batch.map(async (date) => {
              const timestamp = Math.floor(date.getTime() / 1000);
              
              const params = new URLSearchParams({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                method: '13',
                shafaq: 'general',
                tune: '0,0,0,5,0,6,8,0,0', // Feinabstimmung für Lonsee basierend auf Diyanet
                school: '1',
                midnightMode: '0',
                timezonestring: 'Europe/Berlin',
                latitudeAdjustmentMethod: '1',
                calendarMethod: 'DIYANET',
                adjustment: '1'
              });

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
            })
          );

          results.push(...batchResults);
        } catch (error) {
          console.error(`Error fetching prayer times batch:`, error);
          failedRequests++;

          // If too many failures, show a toast and stop
          if (failedRequests > 3) {
            toast({
              title: "API Error",
              description: "Too many failed requests. Please try again later.",
              variant: "destructive",
            });
            throw new Error("Too many failed requests");
          }

          // Wait a bit longer before retrying
          await new Promise(resolve => setTimeout(resolve, 3000));
          i -= batchSize; // Retry this batch
        }
      }

      return results;
    },
    enabled: !!latitude && !!longitude,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection for 24 hours
  });
};
