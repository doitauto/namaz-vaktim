
import { MapPin, Calendar } from 'lucide-react';

interface LocationInfoProps {
  city: string;
  hijriDate: string;
}

export const LocationInfo = ({ city, hijriDate }: LocationInfoProps) => {
  return (
    <div className="text-center space-y-3 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-center gap-2">
        <MapPin className="h-4 w-4 text-[#8B5CF6]" />
        <span className="text-sm text-white/90">{city}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Calendar className="h-4 w-4 text-[#0EA5E9]" />
        <span className="text-sm text-white/90">{hijriDate}</span>
      </div>
    </div>
  );
};
