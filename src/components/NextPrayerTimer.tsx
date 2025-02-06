
import { useState, useEffect } from 'react';
import { Timer, Bell } from 'lucide-react';
import { PrayerTime } from '@/lib/types';
import { motion } from 'framer-motion';
import { getTranslation } from '@/lib/translations';
import { useToast } from "@/hooks/use-toast";

interface NextPrayerTimerProps {
  nextPrayer: PrayerTime;
  prayerTimes?: PrayerTime[];
  className?: string;
  lang?: string;
}

export const NextPrayerTimer = ({ nextPrayer, prayerTimes = [], className = '', lang = 'tr' }: NextPrayerTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const t = getTranslation(lang);
  const { toast } = useToast();
  const [hasShownMaghribNotification, setHasMaghribShownNotification] = useState(false);
  const [hasShownSunriseNotification, setHasSunriseShownNotification] = useState(false);
  const [hasShownDhuhrNotification, setHasDhuhrShownNotification] = useState(false);
  const [currentToastId, setCurrentToastId] = useState<string | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      let nextPrayerTime: Date | null = null;
      let targetPrayer = nextPrayer;

      const [targetHours, targetMinutes] = targetPrayer.time.split(':').map(Number);
      nextPrayerTime = new Date(now);
      nextPrayerTime.setHours(targetHours, targetMinutes, 0, 0);

      if (nextPrayerTime < now && prayerTimes.length > 0) {
        const futureTime = prayerTimes.find(prayer => {
          const [hours, minutes] = prayer.time.split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(hours, minutes, 0, 0);
          return prayerTime > now;
        });

        if (futureTime) {
          const [hours, minutes] = futureTime.time.split(':').map(Number);
          nextPrayerTime = new Date(now);
          nextPrayerTime.setHours(hours, minutes, 0, 0);
        } else {
          const firstPrayer = prayerTimes[0];
          const [hours, minutes] = firstPrayer.time.split(':').map(Number);
          nextPrayerTime = new Date(now);
          nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
          nextPrayerTime.setHours(hours, minutes, 0, 0);
        }
      }

      const now2 = new Date();
      const currentHours = now2.getHours();
      const currentMinutes = now2.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      // Handle Maghrib notification (45 minutes before)
      const maghribPrayer = prayerTimes.find(prayer => prayer.name === 'Maghrib');
      const sunrisePrayer = prayerTimes.find(prayer => prayer.name === 'Sunrise');
      const dhuhrPrayer = prayerTimes.find(prayer => prayer.name === 'Dhuhr');
      
      const showNotification = (title: string, message: string, duration: number) => {
        return toast({
          title: (
            <div className="flex items-center gap-2 text-[#8B5CF6]">
              <Bell className="h-5 w-5" />
              {title}
            </div>
          ),
          description: (
            <div className="bg-gradient-to-r from-[#E5DEFF] to-[#F2FCE2] p-3 rounded-lg mt-2 text-gray-700">
              {message}
            </div>
          ),
          duration: duration,
          className: "bg-white border-2 border-[#8B5CF6]/20 shadow-lg animate-in slide-in-from-top-full duration-300",
        });
      };
      
      if (maghribPrayer) {
        const [maghribHours, maghribMinutes] = maghribPrayer.time.split(':').map(Number);
        const maghribTimeInMinutes = maghribHours * 60 + maghribMinutes;
        const notificationTimeInMinutes = maghribTimeInMinutes - 45;
        
        if (currentTimeInMinutes >= notificationTimeInMinutes && 
            currentTimeInMinutes < maghribTimeInMinutes && 
            !hasShownMaghribNotification) {
          const title = lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung";
          const message = lang === 'tr' 
            ? "Akşam namazına 45 dakika kala sadece farz namaz kılınabilir."
            : "45 Minuten vor dem Abendgebet dürfen nur Fard-Gebete verrichtet werden.";
          
          const toastInstance = showNotification(
            title,
            message,
            (maghribTimeInMinutes - currentTimeInMinutes) * 60 * 1000
          );
          
          if (toastInstance) {
            setCurrentToastId(toastInstance.id);
            setHasMaghribShownNotification(true);
          }
        }
      }

      // Handle Sunrise notification
      if (sunrisePrayer) {
        const [sunriseHours, sunriseMinutes] = sunrisePrayer.time.split(':').map(Number);
        const sunriseTimeInMinutes = sunriseHours * 60 + sunriseMinutes;
        const sunriseEndMinutes = sunriseTimeInMinutes + 45;
        
        if (currentTimeInMinutes >= sunriseTimeInMinutes && 
            currentTimeInMinutes < sunriseEndMinutes && 
            !hasShownSunriseNotification) {
          const title = lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung";
          const message = lang === 'tr' 
            ? "Güneş doğduktan sonraki 45 dakika boyunca namaz kılınmaz."
            : "In den ersten 45 Minuten nach Sonnenaufgang darf kein Gebet verrichtet werden.";
          
          const toastInstance = showNotification(
            title,
            message,
            (sunriseEndMinutes - currentTimeInMinutes) * 60 * 1000
          );
          
          if (toastInstance) {
            setCurrentToastId(toastInstance.id);
            setHasSunriseShownNotification(true);
          }
        }
      }

      // Handle Dhuhr notification (30 minutes before)
      if (dhuhrPrayer) {
        const [dhuhrHours, dhuhrMinutes] = dhuhrPrayer.time.split(':').map(Number);
        const dhuhrTimeInMinutes = dhuhrHours * 60 + dhuhrMinutes;
        const notificationTimeInMinutes = dhuhrTimeInMinutes - 30;
        
        if (currentTimeInMinutes >= notificationTimeInMinutes && 
            currentTimeInMinutes < dhuhrTimeInMinutes && 
            !hasShownDhuhrNotification) {
          const title = lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung";
          const message = lang === 'tr' 
            ? "Öğle namazına 30 dakika kala namaz kılınmaz."
            : "30 Minuten vor dem Mittagsgebet darf kein Gebet verrichtet werden.";
          
          const toastInstance = showNotification(
            title,
            message,
            (dhuhrTimeInMinutes - currentTimeInMinutes) * 60 * 1000
          );
          
          if (toastInstance) {
            setCurrentToastId(toastInstance.id);
            setHasDhuhrShownNotification(true);
          }
        }
      }

      // Reset notifications at appropriate times
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
        useToast().dismiss(currentToastId);
        setCurrentToastId(null);
      }

      const diff = nextPrayerTime.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [nextPrayer, prayerTimes, toast, lang, hasShownMaghribNotification, hasShownSunriseNotification, hasShownDhuhrNotification, currentToastId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center ${className}`}
    >
      <div className="text-lg font-medium text-white/80 mb-2">
        {lang === 'tr' ? "Vaktin Çıkmasına Kalan Süre" : "Verbleibende Zeit bis zum nächsten Gebet"}
      </div>
      <div className="text-3xl font-light tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] mb-3">
        {timeLeft}
      </div>
    </motion.div>
  );
};

