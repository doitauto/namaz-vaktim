
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';

interface LocationButtonProps {
  onLocationRequest: () => void;
}

export const LocationButton = ({ onLocationRequest }: LocationButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white/70 hover:text-white flex items-center justify-center rounded-xl transition-all duration-300"
      onClick={onLocationRequest}
    >
      <LocateFixed className="h-6 w-6" />
    </Button>
  );
};
