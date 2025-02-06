
import { MapPin, Calendar } from 'lucide-react';

interface LocationInfoProps {
  city: string;
  parentLocation?: string;
  hijriDate: string;
}

export const LocationInfo = ({ city, hijriDate }: LocationInfoProps) => {
  return (
    <div className="backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
      
      <div className="relative flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {new Date().toLocaleTimeString()}
          </h1>
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

