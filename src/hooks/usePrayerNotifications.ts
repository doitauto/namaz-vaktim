
import { useState, useEffect } from 'react';
import { PrayerTime } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { showPrayerNotification, getNotificationMessages } from '@/utils/notification-utils';

export const usePrayerNotifications = (prayerTimes: PrayerTime[] = [], lang: string = 'tr') => {
  const { toast } = useToast();
  const [hasShownMaghribNotification, setHasMaghribShownNotification] = useState(false);
  const [hasShownSunriseNotification, setHasSunriseShownNotification] = useState(false);
  const [hasShownDhuhrNotification, setHasDhuhrShownNotification] = useState(false);
  const [currentToastId, setCurrentToastId] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    const maghribPrayer = prayerTimes.find(prayer => prayer.name === 'Maghrib');
    const sunrisePrayer = prayerTimes.find(prayer => prayer.name === 'Sunrise');
    const dhuhrPrayer = prayerTimes.find(prayer => prayer.name === 'Dhuhr');
    
    const messages = getNotificationMessages(lang);

    if (maghribPrayer) {
      const [maghribHours, maghribMinutes] = maghribPrayer.time.split(':').map(Number);
      const maghribTimeInMinutes = maghribHours * 60 + maghribMinutes;
      const notificationTimeInMinutes = maghribTimeInMinutes - 45;
      
      if (currentTimeInMinutes >= notificationTimeInMinutes && 
          currentTimeInMinutes < maghribTimeInMinutes && 
          !hasShownMaghribNotification) {
        const toastInstance = showPrayerNotification(
          messages.maghribTitle,
          messages.maghribMessage,
          (maghribTimeInMinutes - currentTimeInMinutes) * 60 * 1000,
          toast
        );
        
        if (toastInstance) {
          setCurrentToastId(toastInstance.id);
          setHasMaghribShownNotification(true);
        }
      }
    }

    if (sunrisePrayer) {
      const [sunriseHours, sunriseMinutes] = sunrisePrayer.time.split(':').map(Number);
      const sunriseTimeInMinutes = sunriseHours * 60 + sunriseMinutes;
      const sunriseEndMinutes = sunriseTimeInMinutes + 45;
      
      if (currentTimeInMinutes >= sunriseTimeInMinutes && 
          currentTimeInMinutes < sunriseEndMinutes && 
          !hasShownSunriseNotification) {
        const toastInstance = showPrayerNotification(
          messages.sunriseTitle,
          messages.sunriseMessage,
          (sunriseEndMinutes - currentTimeInMinutes) * 60 * 1000,
          toast
        );
        
        if (toastInstance) {
          setCurrentToastId(toastInstance.id);
          setHasSunriseShownNotification(true);
        }
      }
    }

    if (dhuhrPrayer) {
      const [dhuhrHours, dhuhrMinutes] = dhuhrPrayer.time.split(':').map(Number);
      const dhuhrTimeInMinutes = dhuhrHours * 60 + dhuhrMinutes;
      const notificationTimeInMinutes = dhuhrTimeInMinutes - 30;
      
      if (currentTimeInMinutes >= notificationTimeInMinutes && 
          currentTimeInMinutes < dhuhrTimeInMinutes && 
          !hasShownDhuhrNotification) {
        const toastInstance = showPrayerNotification(
          messages.dhuhrTitle,
          messages.dhuhrMessage,
          (dhuhrTimeInMinutes - currentTimeInMinutes) * 60 * 1000,
          toast
        );
        
        if (toastInstance) {
          setCurrentToastId(toastInstance.id);
          setHasDhuhrShownNotification(true);
        }
      }
    }

    // Reset notifications
    if (maghribPrayer) {
      const [maghribHours, maghribMinutes] = maghribPrayer.time.split(':').map(Number);
      const maghribTimeInMinutes = maghribHours * 60 + maghribMinutes;
      
      if (currentTimeInMinutes >= maghribTimeInMinutes) {
        setHasMaghribShownNotification(false);
      }
    }

    if (sunrisePrayer) {
      const [sunriseHours, sunriseMinutes] = sunrisePrayer.time.split(':').map(Number);
      const sunriseTimeInMinutes = sunriseHours * 60 + sunriseMinutes;
      const sunriseEndMinutes = sunriseTimeInMinutes + 45;
      
      if (currentTimeInMinutes >= sunriseEndMinutes) {
        setHasSunriseShownNotification(false);
      }
    }

    if (dhuhrPrayer) {
      const [dhuhrHours, dhuhrMinutes] = dhuhrPrayer.time.split(':').map(Number);
      const dhuhrTimeInMinutes = dhuhrHours * 60 + dhuhrMinutes;
      
      if (currentTimeInMinutes >= dhuhrTimeInMinutes) {
        setHasDhuhrShownNotification(false);
      }
    }

    if (currentToastId) {
      toast.dismiss(currentToastId);
      setCurrentToastId(null);
    }
  }, [prayerTimes, toast, lang, hasShownMaghribNotification, hasShownSunriseNotification, hasShownDhuhrNotification, currentToastId]);
};
