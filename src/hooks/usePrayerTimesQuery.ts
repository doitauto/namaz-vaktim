
import { ExtendedPrayerTime, TimeRange } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { formatDate, getDaysToFetch } from "@/lib/prayer-utils";
import { useToast } from "@/components/ui/use-toast";

interface UsePrayerTimesQueryProps {
  timeRange: TimeRange;
  latitude?: number;
  longitude?: number;
}

interface DiyanetAuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  success: boolean;
  message: string | null;
}

interface DiyanetPrayerTimeResponse {
  data: [{
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    hijriDateShort: string;
    gregorianDateShort: string;
  }];
  success: boolean;
  message: string | null;
}

// API-Basis-URL für die Diyanet Prayer Times API
const API_BASE_URL = "https://awqatsalah.diyanet.gov.tr/api/v1";

export const usePrayerTimesQuery = ({ timeRange, latitude, longitude }: UsePrayerTimesQueryProps) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['prayerTimes', timeRange, latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) return [];

      try {
        // 1. Authentifizierung
        const authResponse = await fetch(`${API_BASE_URL}/Auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          body: JSON.stringify({
            email: "guest@diyanet.gov.tr",
            password: "guest123"
          })
        });

        if (!authResponse.ok) {
          console.error('Auth response:', await authResponse.text());
          throw new Error('Authentication failed');
        }

        const authData: DiyanetAuthResponse = await authResponse.json();
        const accessToken = authData.data.accessToken;

        // 2. Gebetszeiten abrufen
        const days = getDaysToFetch(timeRange);
        const dates = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          return date;
        });

        const results: ExtendedPrayerTime[] = [];

        // Batch requests für Gebetszeiten
        const batchSize = 5;
        let failedRequests = 0;

        for (let i = 0; i < dates.length; i += batchSize) {
          const batch = dates.slice(i, i + batchSize);
          
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          try {
            const batchResults = await Promise.all(
              batch.map(async (date) => {
                const formattedDate = date.toISOString().split('T')[0];
                
                const response = await fetch(
                  `${API_BASE_URL}/PrayerTime/Daily/${latitude},${longitude}/${formattedDate}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                      'Accept': 'application/json',
                      'Origin': window.location.origin
                    }
                  }
                );

                if (!response.ok) {
                  console.error('Prayer time response:', await response.text());
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: DiyanetPrayerTimeResponse = await response.json();
                const prayerTime = data.data[0];

                return {
                  date: formatDate(formattedDate),
                  fajr: prayerTime.fajr,
                  sunrise: prayerTime.sunrise,
                  dhuhr: prayerTime.dhuhr,
                  asr: prayerTime.asr,
                  maghrib: prayerTime.maghrib,
                  isha: prayerTime.isha
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
              throw error;
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
            i -= batchSize; // Retry this batch
          }
        }

        return results;
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        toast({
          title: "API Error",
          description: "Fehler beim Abrufen der Gebetszeiten. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!latitude && !!longitude,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
