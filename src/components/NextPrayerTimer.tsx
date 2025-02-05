
import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PrayerTime } from '@/lib/types';

interface NextPrayerTimerProps {
  nextPrayer: PrayerTime;
}

export const NextPrayerTimer = ({ nextPrayer }: NextPrayerTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const [hours, minutes] = nextPrayer.time.split(':');
      const nextPrayerTime = new Date();
      nextPrayerTime.setHours(parseInt(hours), parseInt(minutes), 0);

      if (nextPrayerTime.getTime() < Date.now()) {
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
      }

      const diff = nextPrayerTime.getTime() - Date.now();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [nextPrayer]);

  return (
    <Card className="p-6 mb-4 bg-gradient-to-r from-indigo-500/90 to-blue-500/90 text-white">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium tracking-tight">Nächstes Gebet</h3>
          <p className="text-sm text-white/80">{nextPrayer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 opacity-80" />
          <span className="text-3xl font-light">{timeLeft}</span>
        </div>
      </div>
    </Card>
  );
};
