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

export const NextPrayerTimer = ({ nextPrayer, prayerTimes = [], className = '', lang = 'tr' }: NextPrayerTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const t = getTranslation(lang);
  const { toast } = useToast();
  const [hasShownNotification, setHasShownNotification] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Aktuelle Zeit
      const now = new Date();
      
      // Finde die nächste Gebetszeit
      let nextPrayerTime: Date | null = null;
      let targetPrayer = nextPrayer;

      // Konvertiere die Gebetszeit in ein Date-Objekt für heute
      const [targetHours, targetMinutes] = targetPrayer.time.split(':').map(Number);
      nextPrayerTime = new Date(now);
      nextPrayerTime.setHours(targetHours, targetMinutes, 0, 0);

      // Wenn die Zeit bereits vorbei ist und wir weitere Gebetszeiten haben
      if (nextPrayerTime < now && prayerTimes.length > 0) {
        // Suche die nächste verfügbare Gebetszeit heute
        const futureTime = prayerTimes.find(prayer => {
          const [hours, minutes] = prayer.time.split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(hours, minutes, 0, 0);
          return prayerTime > now;
        });

        if (futureTime) {
          // Nehme die nächste Gebetszeit heute
          const [hours, minutes] = futureTime.time.split(':').map(Number);
          nextPrayerTime = new Date(now);
          nextPrayerTime.setHours(hours, minutes, 0, 0);
        } else {
          // Wenn keine weitere Gebetszeit heute, nehme die erste Gebetszeit morgen
          const firstPrayer = prayerTimes[0];
          const [hours, minutes] = firstPrayer.time.split(':').map(Number);
          nextPrayerTime = new Date(now);
          nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
          nextPrayerTime.setHours(hours, minutes, 0, 0);
        }
      }

      const now2 = new Date();
      const currentHours = now2.getHours();
      const currentMinutes = now2.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      // Finde Maghrib (Akşam) Gebetszeit
      const maghribPrayer = prayerTimes.find(prayer => prayer.name === 'Maghrib');
      
      if (maghribPrayer) {
        const [maghribHours, maghribMinutes] = maghribPrayer.time.split(':').map(Number);
        const maghribTimeInMinutes = maghribHours * 60 + maghribMinutes;
        
        // Berechne die Zeit 45 Minuten vor Maghrib
        const notificationTimeInMinutes = maghribTimeInMinutes - 45;
        
        // Wenn es genau die Zeit für die Benachrichtigung ist und sie noch nicht angezeigt wurde
        if (currentTimeInMinutes === notificationTimeInMinutes && !hasShownNotification) {
          const message = lang === 'tr' 
            ? "Akşam namazına 45 dakika kala sadece farz namaz kılınabilir."
            : "45 Minuten vor dem Abendgebet dürfen nur Fard-Gebete verrichtet werden.";
          
          toast({
            title: lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung",
            description: message,
            duration: 10000, // 10 Sekunden anzeigen
          });
          
          setHasShownNotification(true);
        }
        
        // Reset hasShownNotification nach dem Maghrib-Gebet
        if (currentTimeInMinutes > maghribTimeInMinutes) {
          setHasShownNotification(false);
        }
      }

      // Berechne die Zeitdifferenz
      const diff = nextPrayerTime.getTime() - now.getTime();
      
      // Konvertiere in Stunden, Minuten und Sekunden
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Formatiere die Zeit
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [nextPrayer, prayerTimes, toast, lang, hasShownNotification]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center ${className}`}
    >
      <div className="text-lg font-medium text-white/80 mb-2">
        {lang === 'tr' ? "Vaktin Çıkmasına Kalan Süre" : "Verbleibende Zeit bis zum nächsten Gebet"}
      </div>
      <div className="text-3xl font-light tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] mb-3">
        {timeLeft}
      </div>
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
