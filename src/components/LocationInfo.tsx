
import { MapPin, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LocationInfoProps {
  city: string;
  hijriDate: string;
}

export const LocationInfo = ({ city, hijriDate }: LocationInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="p-4 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">{city}</span>
        </div>
      </Card>
      <Card className="p-4 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">{hijriDate}</span>
        </div>
      </Card>
    </div>
  );
};
