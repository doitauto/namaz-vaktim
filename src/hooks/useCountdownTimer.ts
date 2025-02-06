
import { useState, useEffect } from 'react';
import { PrayerTime } from '@/lib/types';

export const useCountdownTimer = (nextPrayer: PrayerTime, prayerTimes: PrayerTime[] = []) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      let nextPrayerTime: Date | null = null;
      let targetPrayer = nextPrayer;

      const [targetHours, targetMinutes] = targetPrayer.time.split(':').map(Number);
      nextPrayerTime = new Date(now);
      nextPrayerTime.setHours(targetHours, targetMinutes, 0, 0);

      if (nextPrayerTime < now && prayerTimes.length > 0) {
        const futureTime = prayerTimes.find(prayer => {
          const [hours, minutes] = prayer.time.split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(hours, minutes, 0, 0);
          return prayerTime > now;
        });

        if (futureTime) {
          const [hours, minutes] = futureTime.time.split(':').map(Number);
          nextPrayerTime = new Date(now);
          nextPrayerTime.setHours(hours, minutes, 0, 0);
        } else {
          const firstPrayer = prayerTimes[0];
          const [hours, minutes] = firstPrayer.time.split(':').map(Number);
          nextPrayerTime = new Date(now);
          nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
          nextPrayerTime.setHours(hours, minutes, 0, 0);
        }
      }

      const diff = nextPrayerTime.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [nextPrayer, prayerTimes]);

  return timeLeft;
};
