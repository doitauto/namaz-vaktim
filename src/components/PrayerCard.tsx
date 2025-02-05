import { PrayerTime } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface PrayerCardProps {
  prayer: PrayerTime;
  isNext: boolean;
}

export const PrayerCard = ({ prayer, isNext }: PrayerCardProps) => {
  return (
    <Card className={`p-4 mb-3 transition-all duration-300 ${
      isNext ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white scale-105' : 'hover:scale-102'
    }`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{prayer.name}</h3>
          <p className="text-sm opacity-80">{prayer.arabicName}</p>
        </div>
        <div className="text-2xl font-bold">{prayer.time}</div>
      </div>
    </Card>
  );
};