
import { PrayerTime } from '@/lib/types';
import { Sun, Sunrise, Moon, Clock, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTranslation } from '@/lib/translations';

interface PrayerCardProps {
  prayer: PrayerTime;
  isNext: boolean;
  index: number;
  lang?: string;
}

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

export const PrayerCard = ({ prayer, isNext, index, lang = 'tr' }: PrayerCardProps) => {
  const t = getTranslation(lang);

  const displayName = lang === 'tr' 
    ? getPrayerNameInTurkish(prayer.name)
    : lang === 'de' 
      ? getPrayerNameInGerman(prayer.name)
      : prayer.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`
        relative bg-white/5 backdrop-blur-xl rounded-xl
        transition-all duration-300 group hover:bg-white/10
        ${prayer.isCurrentPrayer ? 'ring-2 ring-[#8B5CF6]' : ''}
      `}
    >
      <div 
        className={`
          absolute inset-0 rounded-xl transition-opacity duration-300
          ${prayer.isCurrentPrayer 
            ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 opacity-100' 
            : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100'
          }
        `}
      />
      
      <div className="relative p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`
            p-2 rounded-lg transition-colors duration-300
            ${prayer.isCurrentPrayer 
              ? 'bg-[#8B5CF6]/20' 
              : 'bg-white/5 group-hover:bg-white/10'
            }
          `}>
            {getIcon(prayer.name)}
          </div>
          <div>
            <div className="font-medium text-white/90">{displayName}</div>
            {prayer.isNext && (
              <div className="text-sm text-[#8B5CF6]">{t.nextPrayer}</div>
            )}
          </div>
        </div>
        <div className={`
          text-2xl font-bold transition-colors duration-300
          ${prayer.isCurrentPrayer 
            ? 'text-[#8B5CF6]' 
            : 'text-[#0EA5E9] group-hover:text-white'
          }
        `}>
          {prayer.time}
        </div>
      </div>
    </motion.div>
  );
};

