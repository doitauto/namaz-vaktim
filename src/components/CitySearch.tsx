
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City } from '@/lib/types';
import { Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export const CitySearch = ({ onCitySelect }: CitySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout to prevent too many API calls
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5`
        );
        
        if (!response.ok) {
          throw new Error('Fehler beim Suchen der Stadt');
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          const cities = data.map((result: any) => ({
            name: result.display_name.split(',')[0],
            country: result.display_name.split(',').slice(-1)[0].trim(),
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
          }));
          setSuggestions(cities);
          setOpen(true);
        } else {
          setSuggestions([]);
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
    }, 300); // Delay for 300ms after typing stops

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, toast]);

  const handleSelectCity = (city: City) => {
    setSearchTerm(city.name);
    onCitySelect(city);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="flex gap-2 relative">
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            placeholder="Stadt suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/10 border-[#0EA5E9]/30 text-white placeholder:text-white/50 focus:border-[#0EA5E9] transition-all duration-300"
          />
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
          <Command>
            <CommandGroup>
              {suggestions.map((city, index) => (
                <CommandItem
                  key={index}
                  value={city.name}
                  onSelect={() => handleSelectCity(city)}
                  className="cursor-pointer hover:bg-[#0EA5E9]/10"
                >
                  {city.name}, {city.country}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Button 
        onClick={() => handleSelectCity(suggestions[0])}
        disabled={isSearching || suggestions.length === 0}
        className="bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 text-white hover:bg-[#0EA5E9]/30 hover:border-[#0EA5E9] transition-all duration-300"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};
