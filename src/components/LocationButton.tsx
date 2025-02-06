
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';
import { getTranslation } from '@/lib/translations';

interface LocationButtonProps {
  onLocationRequest: () => void;
}

export const LocationButton = ({ onLocationRequest }: LocationButtonProps) => {
  const t = getTranslation();
  
  return (
    <Button
      variant="ghost"
      className="mt-6 w-full h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white/70 hover:text-white flex items-center gap-2 justify-center rounded-xl transition-all duration-300"
      onClick={onLocationRequest}
    >
      <LocateFixed className="h-6 w-6" />
      <span>{t.updateLocation}</span>
    </Button>
  );
};

