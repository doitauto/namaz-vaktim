
import { MapPin, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LocationInfoProps {
  city: string;
  parentLocation?: string;
  hijriDate: string;
}

export const LocationInfo = ({ city, hijriDate }: LocationInfoProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(24, 0, 0, 0);
      const diff = target.getTime() - now.getTime();
      
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
  }, []);

  return (
    <div className="backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
      
      <div className="relative flex justify-between items-start">
        <div>
          <div className="text-lg font-medium text-white/80 mb-2">
            Vaktin Çıkmasına Kalan Süre
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
