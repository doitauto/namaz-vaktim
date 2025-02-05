import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  onLocationRequest: () => void;
}

export const LocationButton = ({ onLocationRequest }: LocationButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full mb-4 bg-white/80 backdrop-blur-sm"
      onClick={onLocationRequest}
    >
      <MapPin className="h-4 w-4 mr-2" />
      Aktuellen Standort verwenden
    </Button>
  );
};