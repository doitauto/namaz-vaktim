
import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
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

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();

      // Parse next prayer time
      const [prayerHours, prayerMinutes] = nextPrayer.time.split(':').map(Number);
      
      // Calculate difference
      let diffHours = prayerHours - currentHours;
      let diffMinutes = prayerMinutes - currentMinutes;
      let diffSeconds = 0 - currentSeconds;

      // Adjust for negative differences
      if (diffSeconds < 0) {
        diffSeconds += 60;
        diffMinutes--;
      }
      if (diffMinutes < 0) {
        diffMinutes += 60;
        diffHours--;
      }
      
      // If the prayer time has already passed today
      if (diffHours < 0) {
        // Find the first prayer time of the next day
        const firstPrayerTime = prayerTimes[0];
        const [firstPrayerHours, firstPrayerMinutes] = firstPrayerTime.time.split(':').map(Number);
        
        // Calculate hours until midnight plus hours until first prayer
        diffHours = (24 - currentHours) + firstPrayerHours;
        diffMinutes = firstPrayerMinutes - currentMinutes;
        diffSeconds = 0 - currentSeconds;

        // Adjust minutes and seconds again
        if (diffSeconds < 0) {
          diffSeconds += 60;
          diffMinutes--;
        }
        if (diffMinutes < 0) {
          diffMinutes += 60;
          diffHours--;
        }
      }

      // Format the time left
      return `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(diffSeconds).padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [nextPrayer, prayerTimes]);

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
