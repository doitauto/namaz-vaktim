
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
        w-full max-w-md mx-auto
        ${isNext 
          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] shadow-lg shadow-[#8B5CF6]/20'
          : 'bg-white/5 hover:bg-white/10 transition-colors duration-300'
        }
        backdrop-blur-md rounded-xl p-4 border border-white/10
      `}
    >
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <div className={`${isNext ? 'text-white' : 'text-white/80'} p-3 rounded-lg bg-white/5`}>
            {getIcon(prayer.name)}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white/90">
              {displayName}
            </h3>
            <p className={`text-2xl font-bold ${isNext ? 'text-white' : 'text-white/80'}`}>
              {prayer.time}
            </p>
          </div>
        </div>
        {isNext && (
          <div className="px-3 py-1 rounded-full bg-white/10 text-sm text-white">
            {t.nextPrayer}
          </div>
        )}
      </div>
    </motion.div>
  );
};
