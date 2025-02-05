
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
  const radius = 'calc(50% - 7rem)'; // Increased radius to move cards further from center
  
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
        backdrop-blur-xl p-6 rounded-2xl
        min-w-[160px]
        ${isNext 
          ? 'bg-gradient-to-br from-[#8B5CF6]/50 to-[#0EA5E9]/50 border-2 border-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.4)]' 
          : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-300'
        }
      `}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className={`${isNext ? 'text-[#8B5CF6]' : 'text-white'}`}>
          {getIcon(prayer.name)}
        </div>
        <div className="text-3xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
          {prayer.time}
        </div>
        <div className="text-base font-medium text-white/90">
          {prayer.name}
        </div>
      </div>
    </motion.div>
  );
};
