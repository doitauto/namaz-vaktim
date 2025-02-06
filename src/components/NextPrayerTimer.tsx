
import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { PrayerTime } from '@/lib/types';
import { motion } from 'framer-motion';
import { getTranslation } from '@/lib/translations';
import { calculateNextPrayerTime, formatTimeLeft } from '@/utils/timeCalculations';
import { usePrayerNotifications } from '@/hooks/usePrayerNotifications';

interface NextPrayerTimerProps {
  nextPrayer: PrayerTime;
  prayerTimes?: PrayerTime[];
  className?: string;
  lang?: string;
}

export const NextPrayerTimer = ({ 
  nextPrayer, 
  prayerTimes = [], 
  className = '', 
  lang = 'tr' 
}: NextPrayerTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const t = getTranslation(lang);
  usePrayerNotifications(prayerTimes, lang);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextPrayerTime = calculateNextPrayerTime(now, nextPrayer, prayerTimes);
      const diff = nextPrayerTime.getTime() - now.getTime();
      return formatTimeLeft(diff);
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
