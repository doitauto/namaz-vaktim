
import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { PrayerTime } from '@/lib/types';
import { motion } from 'framer-motion';
import { getTranslation } from '@/lib/translations';
import { useToast } from "@/hooks/use-toast";

interface NextPrayerTimerProps {
  nextPrayer: PrayerTime;
  prayerTimes?: PrayerTime[];
  className?: string;
  lang?: string;
}

export const NextPrayerTimer = ({ nextPrayer, prayerTimes, className = '', lang = 'tr' }: NextPrayerTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isPrayerRestricted, setIsPrayerRestricted] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState<string>('');
  const t = getTranslation(lang);
  const { toast } = useToast();

  const checkPrayerRestrictions = () => {
    if (!prayerTimes) return;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const sunriseTime = prayerTimes.find(p => p.name === 'Sunrise');
    const dhuhrTime = prayerTimes.find(p => p.name === 'Dhuhr');
    const maghribTime = prayerTimes.find(p => p.name === 'Maghrib');

    if (sunriseTime && dhuhrTime && maghribTime) {
      const [sunriseHours, sunriseMinutes] = sunriseTime.time.split(':').map(Number);
      const [dhuhrHours, dhuhrMinutes] = dhuhrTime.time.split(':').map(Number);
      const [maghribHours, maghribMinutes] = maghribTime.time.split(':').map(Number);

      const sunriseInMinutes = sunriseHours * 60 + sunriseMinutes;
      const dhuhrInMinutes = dhuhrHours * 60 + dhuhrMinutes;
      const maghribInMinutes = maghribHours * 60 + maghribMinutes;

      // Check if current time is within 45 minutes after sunrise
      if (currentTime >= sunriseInMinutes && currentTime <= sunriseInMinutes + 45) {
        setIsPrayerRestricted(true);
        const message = lang === 'tr' 
          ? "Güneş doğduktan sonraki 45 dakika içinde namaz kılınmaz" 
          : "In den ersten 45 Minuten nach Sonnenaufgang ist das Gebet nicht gestattet";
        setRestrictionMessage(message);
        toast({
          title: lang === 'tr' ? "Namaz Kılınmaz" : "Gebetsverbot",
          description: message,
          duration: 5000,
        });
      }
      // Check if current time is within 45 minutes before dhuhr
      else if (currentTime >= dhuhrInMinutes - 45 && currentTime < dhuhrInMinutes) {
        setIsPrayerRestricted(true);
        const message = lang === 'tr'
          ? "Öğle namazı vaktinden önceki 45 dakika içinde namaz kılınmaz"
          : "In den letzten 45 Minuten vor dem Mittagsgebet ist das Gebet nicht gestattet";
        setRestrictionMessage(message);
        toast({
          title: lang === 'tr' ? "Namaz Kılınmaz" : "Gebetsverbot",
          description: message,
          duration: 5000,
        });
      }
      // Check if current time is within 45 minutes before maghrib
      else if (currentTime >= maghribInMinutes - 45 && currentTime < maghribInMinutes) {
        setIsPrayerRestricted(true);
        const message = lang === 'tr'
          ? "Akşam namazından önceki 45 dakika içinde sadece ikindi farz namazı kılınabilir"
          : "In den letzten 45 Minuten vor dem Abendgebet ist nur das Asr Farz-Gebet gestattet";
        setRestrictionMessage(message);
        toast({
          title: lang === 'tr' ? "Namaz Kısıtlaması" : "Gebetseinschränkung",
          description: message,
          duration: 5000,
        });
      } else {
        setIsPrayerRestricted(false);
        setRestrictionMessage('');
      }
    }
  };

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
      checkPrayerRestrictions();
    }, 1000);

    setTimeLeft(calculateTimeLeft());
    checkPrayerRestrictions();

    return () => clearInterval(timer);
  }, [nextPrayer, prayerTimes]);

  const nextPrayerName = lang === 'tr' 
    ? getPrayerNameInTurkish(nextPrayer.name)
    : lang === 'de'
      ? getPrayerNameInGerman(nextPrayer.name)
      : nextPrayer.name;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center ${className}`}
    >
      <div className="text-lg font-medium text-white/80 mb-2">
        {t.nextPrayer}: {nextPrayerName}
      </div>
      <div className="text-5xl font-light tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] mb-3">
        {timeLeft}
      </div>
      {isPrayerRestricted && (
        <div className="mt-2 text-red-500 text-sm font-medium">
          {restrictionMessage}
        </div>
      )}
    </motion.div>
  );
};

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
