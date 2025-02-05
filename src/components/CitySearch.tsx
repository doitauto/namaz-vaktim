import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City } from '@/lib/types';
import { Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export const CitySearch = ({ onCitySelect }: CitySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Stadtnamen ein",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Nominatim API als Alternative zu OpenCage (keine API-Key erforderlich)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Fehler beim Suchen der Stadt');
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        onCitySelect({
          name: result.display_name.split(',')[0],
          country: result.display_name.split(',').slice(-1)[0].trim(),
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        });
      } else {
        toast({
          title: "Keine Ergebnisse",
          description: "Stadt konnte nicht gefunden werden",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Fehler bei der Stadtsuche",
        variant: "destructive",
      });
      console.error('Error searching city:', error);
    }
    setIsSearching(false);
  };

  return (
    <div className="flex gap-2 p-4">
      <Input
        placeholder="Stadt suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button onClick={handleSearch} disabled={isSearching}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};