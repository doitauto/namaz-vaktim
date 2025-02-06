
import * as React from 'react';
import { Bell } from 'lucide-react';
import { ToastOptions } from '@/hooks/use-toast';

export const createPrayerNotification = (
  title: string,
  message: string,
  duration: number
): ToastOptions => ({
  title: (
    <div className="flex items-center gap-2 text-[#8B5CF6]">
      <Bell className="h-5 w-5" />
      <span>{title}</span>
    </div>
  ),
  description: (
    <div className="bg-gradient-to-r from-[#E5DEFF] to-[#F2FCE2] p-3 rounded-lg mt-2 text-gray-700">
      {message}
    </div>
  ),
  duration: duration,
  className: "bg-white border-2 border-[#8B5CF6]/20 shadow-lg animate-in slide-in-from-top-full duration-300",
});

export const getPrayerMessages = (lang: string) => ({
  maghrib: {
    title: lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung",
    message: lang === 'tr' 
      ? "Akşam namazına 45 dakika kala sadece farz namaz kılınabilir."
      : "45 Minuten vor dem Abendgebet dürfen nur Fard-Gebete verrichtet werden."
  },
  sunrise: {
    title: lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung",
    message: lang === 'tr' 
      ? "Güneş doğduktan sonraki 45 dakika boyunca namaz kılınmaz."
      : "In den ersten 45 Minuten nach Sonnenaufgang darf kein Gebet verrichtet werden."
  },
  dhuhr: {
    title: lang === 'tr' ? "Namaz Hatırlatması" : "Gebetsbenachrichtigung",
    message: lang === 'tr' 
      ? "Öğle namazına 30 dakika kala namaz kılınmaz."
      : "30 Minuten vor dem Mittagsgebet darf kein Gebet verrichtet werden."
  }
});
