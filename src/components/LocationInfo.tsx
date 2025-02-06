
import { MapPin, Calendar, Cloud } from 'lucide-react';

interface LocationInfoProps {
  city: string;
  parentLocation?: string;
  hijriDate: string;
}

export const LocationInfo = ({ city, parentLocation, hijriDate }: LocationInfoProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      
      <div className="relative flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {new Date().toLocaleTimeString()}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              {city} {parentLocation && `(${parentLocation})`}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-300">{hijriDate}</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-blue-400">
            <Cloud className="w-4 h-4" />
            <span>13°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
