
import React from 'react';
import { PrayerTime } from '@/lib/types';
import { type ToastFunction } from '@/hooks/use-toast';

export const showPrayerNotification = (
  title: string,
  message: string,
  duration: number,
  toastFn: ToastFunction
) => {
  return toastFn({
    title: title,
    description: (
      <div className="bg-gradient-to-r from-[#E5DEFF] to-[#F2FCE2] p-3 rounded-lg mt-2 text-gray-700">
        {message}
      </div>
    ),
    duration: duration,
    className: "bg-white border-2 border-[#8B5CF6]/20 shadow-lg animate-in slide-in-from-top-full duration-300",
  });
};

export const getNotificationMessages = (lang: string) => {
  return {
    maghribTitle: lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung",
    maghribMessage: lang === 'tr' 
      ? "Akşam namazına 45 dakika kala sadece farz namaz kılınabilir."
      : "45 Minuten vor dem Abendgebet dürfen nur Fard-Gebete verrichtet werden.",
    sunriseTitle: lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung",
    sunriseMessage: lang === 'tr' 
      ? "Güneş doğduktan sonraki 45 dakika boyunca namaz kılınmaz."
      : "In den ersten 45 Minuten nach Sonnenaufgang darf kein Gebet verrichtet werden.",
    dhuhrTitle: lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung",
    dhuhrMessage: lang === 'tr' 
      ? "Öğle namazına 30 dakika kala namaz kılınmaz."
      : "30 Minuten vor dem Mittagsgebet darf kein Gebet verrichtet werden.",
  };
};
