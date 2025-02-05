
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
      return <Sunrise className="h-7 w-7" />;
    case 'sunrise':
      return <Sun className="h-7 w-7" />;
    case 'dhuhr':
      return <Sun className="h-7 w-7" />;
    case 'asr':
      return <CloudSun className="h-7 w-7" />;
    case 'maghrib':
      return <Moon className="h-7 w-7" />;
    case 'isha':
      return <Moon className="h-7 w-7" />;
    default:
      return <Clock className="h-7 w-7" />;
  }
};

export const PrayerCard = ({ prayer, isNext, index, total }: PrayerCardProps) => {
  const angle = (index * (360 / total)) - 90;
  const radius = 'calc(50% - 5rem)';
  
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
        backdrop-blur-xl p-5 rounded-2xl
        min-w-[140px]
        ${isNext 
          ? 'bg-gradient-to-br from-[#8B5CF6]/30 to-[#0EA5E9]/30 border-2 border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
          : 'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300'
        }
      `}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`${isNext ? 'text-[#8B5CF6]' : 'text-white/90'}`}>
          {getIcon(prayer.name)}
        </div>
        <div className="text-2xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
          {prayer.time}
        </div>
        <div className="text-sm font-medium text-white/80">
          {prayer.name}
        </div>
      </div>
    </motion.div>
  );
};
