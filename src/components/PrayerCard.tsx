
import { PrayerTime } from '@/lib/types';
import { Sun, Sunrise, Moon, Clock, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrayerCardProps {
  prayer: PrayerTime;
  isNext: boolean;
  index: number;
  total: number;
}

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'fajr':
      return <Sunrise className="h-5 w-5" />;
    case 'sunrise':
      return <Sun className="h-5 w-5" />;
    case 'dhuhr':
      return <Sun className="h-5 w-5" />;
    case 'asr':
      return <CloudSun className="h-5 w-5" />;
    case 'maghrib':
      return <Moon className="h-5 w-5" />;
    case 'isha':
      return <Moon className="h-5 w-5" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};

export const PrayerCard = ({ prayer, isNext, index, total }: PrayerCardProps) => {
  const angle = (index * (360 / total)) - 90;
  const radius = 'calc(50% - 2rem)';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `rotate(${angle}deg) translateX(${radius}) rotate(-${angle}deg)`,
      }}
      className={`
        -translate-x-1/2 -translate-y-1/2
        ${isNext ? 'text-blue-400' : 'text-white/80'}
      `}
    >
      <div className="flex flex-col items-center space-y-1">
        {getIcon(prayer.name)}
        <div className="text-lg font-light">{prayer.time}</div>
        <div className="text-sm opacity-80">{prayer.name}</div>
      </div>
    </motion.div>
  );
};
