
import { MapPin, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PrayerTime } from '@/lib/types';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { usePrayerNotifications } from '@/hooks/usePrayerNotifications';
import { getTranslation } from '@/lib/translations';

interface LocationInfoProps {
  city: string;
  parentLocation?: string;
  hijriDate: string;
  nextPrayer?: PrayerTime;
  prayerTimes?: PrayerTime[];
  lang?: string;
}

export const LocationInfo = ({ 
  city, 
  hijriDate, 
  nextPrayer, 
  prayerTimes = [],
  lang = 'tr'
}: LocationInfoProps) => {
  const t = getTranslation(lang);
  const timeLeft = useCountdownTimer(nextPrayer!, prayerTimes);
  usePrayerNotifications(prayerTimes, lang);

  return (
    <div className="backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
      
      <div className="relative flex justify-between items-start">
        <div>
          <div className="text-lg font-medium text-white/80 mb-2">
            {lang === 'tr' ? "Vaktin Çıkmasına Kalan Süre" : "Verbleibende Zeit bis zum nächsten Gebet"}
          </div>
          <div className="text-3xl font-light tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] mb-3">
            {timeLeft}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              {city}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-300">{hijriDate}</div>
        </div>
      </div>
    </div>
  );
};
