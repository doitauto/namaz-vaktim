
import { MapPin, Calendar } from 'lucide-react';

interface LocationInfoProps {
  city: string;
  parentLocation?: string;
  hijriDate: string;
}

export const LocationInfo = ({ city, parentLocation, hijriDate }: LocationInfoProps) => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <MapPin className="h-4 w-4 text-[#8B5CF6]" />
        <span className="text-sm text-white/70">
          {city} {parentLocation && `(${parentLocation})`}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Calendar className="h-4 w-4 text-[#0EA5E9]" />
        <span className="text-sm text-white/70">{hijriDate}</span>
      </div>
    </div>
  );
};
