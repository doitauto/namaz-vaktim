
import { PrayerTime } from '@/lib/types';

export const calculateTimeInMinutes = (hours: number, minutes: number) => 
  hours * 60 + minutes;

export const calculateNextPrayerTime = (now: Date, nextPrayer: PrayerTime, prayerTimes: PrayerTime[]) => {
  const [targetHours, targetMinutes] = nextPrayer.time.split(':').map(Number);
  let nextPrayerTime = new Date(now);
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

  return nextPrayerTime;
};

export const formatTimeLeft = (diff: number): string => {
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
