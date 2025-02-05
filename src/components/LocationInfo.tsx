
import { MapPin, Calendar } from 'lucide-react';

interface LocationInfoProps {
  city: string;
  hijriDate: string;
}

export const LocationInfo = ({ city, hijriDate }: LocationInfoProps) => {
  return (
    <div className="text-center space-y-2 text-white/90">
      <div className="flex items-center justify-center gap-2">
        <MapPin className="h-4 w-4 opacity-70" />
        <span className="text-sm">{city}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Calendar className="h-4 w-4 opacity-70" />
        <span className="text-sm">{hijriDate}</span>
      </div>
    </div>
  );
};
