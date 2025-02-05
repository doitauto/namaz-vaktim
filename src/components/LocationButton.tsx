
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  onLocationRequest: () => void;
}

export const LocationButton = ({ onLocationRequest }: LocationButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full bg-white/10 backdrop-blur-xl border-[#8B5CF6]/30 text-white hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6] transition-all duration-300"
      onClick={onLocationRequest}
    >
      <MapPin className="h-4 w-4 mr-2 text-[#8B5CF6]" />
      Aktuellen Standort verwenden
    </Button>
  );
};
