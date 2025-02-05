import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City } from '@/lib/types';
import { Search } from 'lucide-react';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export const CitySearch = ({ onCitySelect }: CitySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchTerm)}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.results?.length > 0) {
        const result = data.results[0];
        onCitySelect({
          name: result.components.city || result.components.town,
          country: result.components.country,
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
        });
      }
    } catch (error) {
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
      />
      <Button onClick={handleSearch} disabled={isSearching}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};