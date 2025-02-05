
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  onLocationRequest: () => void;
}

export const LocationButton = ({ onLocationRequest }: LocationButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      onClick={onLocationRequest}
    >
      <MapPin className="h-4 w-4 mr-2" />
      Aktuellen Standort verwenden
    </Button>
  );
};
