
import { useState, useEffect } from 'react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PrayerCard } from '@/components/PrayerCard';
import { CitySearch } from '@/components/CitySearch';
import { LocationButton } from '@/components/LocationButton';
import { NextPrayerTimer } from '@/components/NextPrayerTimer';
import { LocationInfo } from '@/components/LocationInfo';
import { SavedLocations } from '@/components/SavedLocations';
import { City, SavedLocation } from '@/lib/types';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'saved-prayer-locations';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const { toast } = useToast();
  
  const { prayerTimes, hijriDate, isLoading, location, nearestLocation } = usePrayerTimes(
    selectedCity?.latitude,
    selectedCity?.longitude
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleLocationRequest = () => {
    setSelectedCity(null);
  };

  const handleSaveLocation = () => {
    if (!selectedCity) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie zuerst einen Ort aus",
        variant: "destructive",
      });
      return;
    }

    const exists = savedLocations.some(loc => 
      loc.city.latitude === selectedCity.latitude && 
      loc.city.longitude === selectedCity.longitude
    );

    if (exists) {
      toast({
        title: "Hinweis",
        description: "Dieser Ort wurde bereits gespeichert",
      });
      return;
    }

    const newLocation: SavedLocation = {
      id: crypto.randomUUID(),
      city: selectedCity,
      timestamp: Date.now(),
    };

    setSavedLocations(prev => [...prev, newLocation]);
    toast({
      title: "Erfolg",
      description: "Ort wurde gespeichert",
    });
  };

  const handleRemoveLocation = (id: string) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== id));
    toast({
      title: "Erfolg",
      description: "Ort wurde entfernt",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] px-4 py-8">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-end gap-2">
          {selectedCity && (
            <Button
              variant="ghost"
              onClick={handleSaveLocation}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ort speichern
            </Button>
          )}
          <SavedLocations
            savedLocations={savedLocations}
            onLocationSelect={setSelectedCity}
            onLocationRemove={handleRemoveLocation}
          />
        </div>

        <div className="text-center space-y-4 mt-12">
          <h1 className="text-5xl font-light tracking-wider text-white/90">
            {selectedCity ? selectedCity.name : 'Gebetszeiten'}
          </h1>
          {prayerTimes && prayerTimes.length > 0 && (
            <NextPrayerTimer 
              nextPrayer={prayerTimes[0]} 
              className="inline-block mt-4"
            />
          )}
        </div>

        <div className="space-y-3 mt-12">
          {prayerTimes?.map((prayer, index) => (
            <PrayerCard
              key={prayer.name}
              prayer={prayer}
              isNext={index === 0}
              index={index}
            />
          ))}
        </div>

        <LocationInfo 
          city={selectedCity?.name || nearestLocation} 
          hijriDate={hijriDate}
        />

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent">
          <div className="max-w-2xl mx-auto space-y-2">
            <LocationButton onLocationRequest={handleLocationRequest} />
            <CitySearch onCitySelect={setSelectedCity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
