
import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { PrayerTime } from '@/lib/types';
import { motion } from 'framer-motion';

interface NextPrayerTimerProps {
  nextPrayer: PrayerTime;
  className?: string;
}

export const NextPrayerTimer = ({ nextPrayer, className = '' }: NextPrayerTimerProps) => {
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
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [nextPrayer]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center ${className}`}
    >
      <div className="text-4xl font-light text-white mb-2">{timeLeft}</div>
      <div className="text-blue-400 text-sm">Bis {nextPrayer.name}</div>
    </motion.div>
  );
};
