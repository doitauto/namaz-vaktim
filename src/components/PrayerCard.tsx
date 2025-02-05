
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
      return <Sunrise className="h-6 w-6" />;
    case 'sunrise':
      return <Sun className="h-6 w-6" />;
    case 'dhuhr':
      return <Sun className="h-6 w-6" />;
    case 'asr':
      return <CloudSun className="h-6 w-6" />;
    case 'maghrib':
      return <Moon className="h-6 w-6" />;
    case 'isha':
      return <Moon className="h-6 w-6" />;
    default:
      return <Clock className="h-6 w-6" />;
  }
};

export const PrayerCard = ({ prayer, isNext, index, total }: PrayerCardProps) => {
  const angle = (index * (360 / total)) - 90;
  const radius = 'calc(50% - 4.5rem)'; // Increased radius even more
  
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
        bg-white/20 backdrop-blur-md p-4 rounded-xl
        border border-white/30 shadow-lg
        min-w-[120px]
        ${isNext ? 'bg-blue-500/30 ring-2 ring-blue-400 text-white' : 'text-white hover:bg-white/30 transition-colors'}
      `}
    >
      <div className="flex flex-col items-center space-y-2">
        {getIcon(prayer.name)}
        <div className="text-xl font-semibold tracking-wide">{prayer.time}</div>
        <div className="text-sm font-medium">{prayer.name}</div>
      </div>
    </motion.div>
  );
};
