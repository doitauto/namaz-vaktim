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
  const [hasShownNotification, setHasShownNotification] = useState(false);
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

      const maghribPrayer = prayerTimes.find(prayer => prayer.name === 'Maghrib');
      
      if (maghribPrayer) {
        const [maghribHours, maghribMinutes] = maghribPrayer.time.split(':').map(Number);
        const maghribTimeInMinutes = maghribHours * 60 + maghribMinutes;
        
        const notificationTimeInMinutes = maghribTimeInMinutes - 45;
        
        if (currentTimeInMinutes >= notificationTimeInMinutes && 
            currentTimeInMinutes < maghribTimeInMinutes && 
            !hasShownNotification) {
          const message = lang === 'tr' 
            ? "Akşam namazına 45 dakika kala sadece farz namaz kılınabilir."
            : "45 Minuten vor dem Abendgebet dürfen nur Fard-Gebete verrichtet werden.";
          
          const toastInstance = toast({
            title: (
              <div className="flex items-center gap-2 text-[#8B5CF6]">
                <Bell className="h-5 w-5" />
                <span>{lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung"}</span>
              </div>
            ),
            description: (
              <div className="bg-gradient-to-r from-[#E5DEFF] to-[#F2FCE2] p-3 rounded-lg mt-2 text-gray-700">
                {message}
              </div>
            ),
            duration: (maghribTimeInMinutes - currentTimeInMinutes) * 60 * 1000,
            className: "bg-white border-2 border-[#8B5CF6]/20 shadow-lg animate-in slide-in-from-top-full duration-300",
          });
          
          setCurrentToastId(toastInstance.id);
          setHasShownNotification(true);
        }
        
        if (currentTimeInMinutes >= maghribTimeInMinutes) {
          setHasShownNotification(false);
          if (currentToastId) {
            toast.dismiss(currentToastId);
            setCurrentToastId(null);
          }
        }
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
  }, [nextPrayer, prayerTimes, toast, lang, hasShownNotification, currentToastId]);

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

const getPrayerNameInTurkish = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'fajr':
      return 'İmsak';
    case 'sunrise':
      return 'Güneş';
    case 'dhuhr':
      return 'Öğle';
    case 'asr':
      return 'İkindi';
    case 'maghrib':
      return 'Akşam';
    case 'isha':
      return 'Yatsı';
    default:
      return name;
  }
};

const getPrayerNameInGerman = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'fajr':
      return 'Morgengebet';
    case 'sunrise':
      return 'Sonnenaufgang';
    case 'dhuhr':
      return 'Mittagsgebet';
    case 'asr':
      return 'Nachmittagsgebet';
    case 'maghrib':
      return 'Abendgebet';
    case 'isha':
      return 'Nachtgebet';
    default:
      return name;
  }
};
