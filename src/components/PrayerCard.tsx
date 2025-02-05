import { PrayerTime } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PrayerCardProps {
  prayer: PrayerTime;
  isNext: boolean;
}

export const PrayerCard = ({ prayer, isNext }: PrayerCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`
          p-6 mb-4 backdrop-blur-sm transition-all duration-300
          ${isNext 
            ? 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white shadow-lg scale-102' 
            : 'bg-white/60 hover:bg-white/80 hover:scale-102'
          }
        `}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className={`text-lg font-medium tracking-tight ${isNext ? 'text-white' : 'text-gray-900'}`}>
              {prayer.name}
            </h3>
            <p className={`text-sm ${isNext ? 'text-white/80' : 'text-gray-500'} font-arabic`}>
              {prayer.arabicName}
            </p>
          </div>
          <div className={`text-3xl font-light ${isNext ? 'text-white' : 'text-gray-900'}`}>
            {prayer.time}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};