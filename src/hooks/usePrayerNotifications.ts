
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PrayerTime } from '@/lib/types';
import { createPrayerNotification, getPrayerMessages } from '@/utils/prayerNotifications';
import { calculateTimeInMinutes } from '@/utils/timeCalculations';

export const usePrayerNotifications = (
  prayerTimes: PrayerTime[],
  lang: string
) => {
  const { toast } = useToast();
  const [hasShownMaghribNotification, setHasMaghribShownNotification] = useState(false);
  const [hasShownSunriseNotification, setHasSunriseShownNotification] = useState(false);
  const [hasShownDhuhrNotification, setHasDhuhrShownNotification] = useState(false);
  const [currentToastId, setCurrentToastId] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = calculateTimeInMinutes(currentHours, currentMinutes);
    const messages = getPrayerMessages(lang);

    const maghribPrayer = prayerTimes.find(prayer => prayer.name === 'Maghrib');
    const sunrisePrayer = prayerTimes.find(prayer => prayer.name === 'Sunrise');
    const dhuhrPrayer = prayerTimes.find(prayer => prayer.name === 'Dhuhr');

    // Handle Maghrib notification
    if (maghribPrayer) {
      const [maghribHours, maghribMinutes] = maghribPrayer.time.split(':').map(Number);
      const maghribTimeInMinutes = calculateTimeInMinutes(maghribHours, maghribMinutes);
      const notificationTimeInMinutes = maghribTimeInMinutes - 45;

      if (currentTimeInMinutes >= notificationTimeInMinutes && 
          currentTimeInMinutes < maghribTimeInMinutes && 
          !hasShownMaghribNotification) {
        const toastInstance = toast(
          createPrayerNotification(
            messages.maghrib.title,
            messages.maghrib.message,
            (maghribTimeInMinutes - currentTimeInMinutes) * 60 * 1000
          )
        );
        
        if (toastInstance) {
          setCurrentToastId(toastInstance.id);
          setHasMaghribShownNotification(true);
        }
      }

      if (currentTimeInMinutes >= maghribTimeInMinutes) {
        setHasMaghribShownNotification(false);
      }
    }

    // Handle Sunrise notification
    if (sunrisePrayer) {
      const [sunriseHours, sunriseMinutes] = sunrisePrayer.time.split(':').map(Number);
      const sunriseTimeInMinutes = calculateTimeInMinutes(sunriseHours, sunriseMinutes);
      const sunriseEndMinutes = sunriseTimeInMinutes + 45;

      if (currentTimeInMinutes >= sunriseTimeInMinutes && 
          currentTimeInMinutes < sunriseEndMinutes && 
          !hasShownSunriseNotification) {
        const toastInstance = toast(
          createPrayerNotification(
            messages.sunrise.title,
            messages.sunrise.message,
            (sunriseEndMinutes - currentTimeInMinutes) * 60 * 1000
          )
        );
        
        if (toastInstance) {
          setCurrentToastId(toastInstance.id);
          setHasSunriseShownNotification(true);
        }
      }

      if (currentTimeInMinutes >= sunriseEndMinutes) {
        setHasSunriseShownNotification(false);
      }
    }

    // Handle Dhuhr notification
    if (dhuhrPrayer) {
      const [dhuhrHours, dhuhrMinutes] = dhuhrPrayer.time.split(':').map(Number);
      const dhuhrTimeInMinutes = calculateTimeInMinutes(dhuhrHours, dhuhrMinutes);
      const notificationTimeInMinutes = dhuhrTimeInMinutes - 30;

      if (currentTimeInMinutes >= notificationTimeInMinutes && 
          currentTimeInMinutes < dhuhrTimeInMinutes && 
          !hasShownDhuhrNotification) {
        const toastInstance = toast(
          createPrayerNotification(
            messages.dhuhr.title,
            messages.dhuhr.message,
            (dhuhrTimeInMinutes - currentTimeInMinutes) * 60 * 1000
          )
        );
        
        if (toastInstance) {
          setCurrentToastId(toastInstance.id);
          setHasDhuhrShownNotification(true);
        }
      }

      if (currentTimeInMinutes >= dhuhrTimeInMinutes) {
        setHasDhuhrShownNotification(false);
      }
    }

    // Clear current toast if exists
    if (currentToastId) {
      useToast().dismiss(currentToastId);
      setCurrentToastId(null);
    }
  }, [prayerTimes, lang, hasShownMaghribNotification, hasShownSunriseNotification, hasShownDhuhrNotification, currentToastId, toast]);

  return { currentToastId };
};
