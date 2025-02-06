
import { PrayerTime } from '@/lib/types';
import { motion } from 'framer-motion';
import { getTranslation } from '@/lib/translations';

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
  return null; // Component no longer needed, but kept for now to prevent breaking changes
};
