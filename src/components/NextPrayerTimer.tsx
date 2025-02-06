
import { Timer } from 'lucide-react';
import { PrayerTime } from '@/lib/types';
import { motion } from 'framer-motion';
import { getTranslation } from '@/lib/translations';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
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
  const t = getTranslation(lang);
  const timeLeft = useCountdownTimer(nextPrayer, prayerTimes);
  usePrayerNotifications(prayerTimes, lang);

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
