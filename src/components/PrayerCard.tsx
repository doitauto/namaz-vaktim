
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
        relative bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 
        transition-all duration-300 group hover:bg-white/10
        ${prayer.isCurrentPrayer ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 
        rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            {getIcon(prayer.name)}
          </div>
          <div>
            <div className="font-medium text-white/90">{displayName}</div>
            {prayer.isNext && (
              <div className="text-sm text-blue-300">{t.nextPrayer}</div>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-300 group-hover:text-white transition-colors">
          {prayer.time}
        </div>
      </div>
      
      {prayer.isCurrentPrayer && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 w-full" />
      )}
    </motion.div>
  );
};
