import { City, SavedLocation } from '@/lib/types';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SavedLocationsProps {
  savedLocations: SavedLocation[];
  onLocationSelect: (city: City) => void;
  onLocationRemove: (id: string) => void;
}

export const SavedLocations = ({ 
  savedLocations, 
  onLocationSelect, 
  onLocationRemove 
}: SavedLocationsProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex-1 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/70 hover:text-white flex items-center justify-center py-4 rounded-xl transition-all duration-300"
        >
          <MapPin className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[#1A1F2C]/95 border-[#8B5CF6]/30 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="text-white">Gespeicherte Orte</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {savedLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/10 text-white"
            >
              <button
                onClick={() => onLocationSelect(location.city)}
                className="flex-1 text-left hover:text-[#8B5CF6] transition-colors"
              >
                {location.city.name}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLocationRemove(location.id)}
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {savedLocations.length === 0 && (
            <p className="text-white/50 text-center py-4">
              Keine Orte gespeichert
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
