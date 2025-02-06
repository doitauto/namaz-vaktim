import { useState, useEffect } from 'react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PrayerCard } from '@/components/PrayerCard';
import { CitySearch } from '@/components/CitySearch';
import { LocationButton } from '@/components/LocationButton';
import { NextPrayerTimer } from '@/components/NextPrayerTimer';
import { LocationInfo } from '@/components/LocationInfo';
import { SavedLocations } from '@/components/SavedLocations';
import { City, SavedLocation } from '@/lib/types';
import { Loader2, Compass, MapPin, Languages, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { getTranslation } from '@/lib/translations';
import { PrayerTable } from '@/components/PrayerTable';
import { TimeRange } from '@/lib/types';

const STORAGE_KEY = 'saved-prayer-locations';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [language, setLanguage] = useState<'tr' | 'de'>('tr');
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const { toast } = useToast();
  const t = getTranslation(language);
  
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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] px-4 pb-32">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="absolute top-0 right-0 pt-8">
          <a 
            href="https://ditib-lonsee.de/imsakiye/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/70 hover:text-white px-4 py-2 rounded-xl transition-all duration-300"
          >
            <Link2 className="h-5 w-5" />
            <span>IMSAKIYE</span>
          </a>
        </div>

        <div className="text-center space-y-4 mt-12">
          <h1 className="text-5xl font-light tracking-wider text-white/90">
            {selectedCity?.name}
          </h1>
          {prayerTimes && prayerTimes.length > 0 && (
            <>
              <NextPrayerTimer 
                nextPrayer={prayerTimes[0]} 
                prayerTimes={prayerTimes}
                className="inline-block mt-4"
                lang={language}
              />
              <LocationInfo 
                city={selectedCity?.name || nearestLocation} 
                hijriDate={hijriDate}
              />
            </>
          )}
        </div>

        <div className="space-y-3 mt-12">
          {prayerTimes?.map((prayer, index) => (
            <PrayerCard
              key={prayer.name}
              prayer={prayer}
              isNext={index === 0}
              index={index}
              lang={language}
            />
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <LocationButton onLocationRequest={handleLocationRequest} />
          <CitySearch onCitySelect={setSelectedCity} />
        </div>

        <div className="mt-8 mb-32">
          <div className="flex gap-2 mb-4">
            <Button
              variant="ghost"
              className={`flex-1 ${timeRange === 'weekly' ? 'bg-white/10' : 'bg-white/5'} text-white/70 hover:text-white`}
              onClick={() => setTimeRange('weekly')}
            >
              {language === 'tr' ? 'Haftalık' : 'Wöchentlich'}
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 ${timeRange === 'monthly' ? 'bg-white/10' : 'bg-white/5'} text-white/70 hover:text-white`}
              onClick={() => setTimeRange('monthly')}
            >
              {language === 'tr' ? 'Aylık' : 'Monatlich'}
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 ${timeRange === 'yearly' ? 'bg-white/10' : 'bg-white/5'} text-white/70 hover:text-white`}
              onClick={() => setTimeRange('yearly')}
            >
              {language === 'tr' ? 'Yıllık' : 'Jährlich'}
            </Button>
          </div>
          
          <PrayerTable 
            timeRange={timeRange} 
            lang={language} 
            latitude={selectedCity?.latitude || location?.lat}
            longitude={selectedCity?.longitude || location?.lng}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/95 to-transparent">
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between gap-2">
              <Link 
                to="/qibla"
                className="flex-1 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/70 hover:text-white flex items-center justify-center py-4 rounded-xl transition-all duration-300"
              >
                <Compass className="h-6 w-6" />
              </Link>
            
              <Button
                variant="ghost"
                onClick={handleSaveLocation}
                className="flex-1 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/70 hover:text-white flex items-center justify-center py-4 rounded-xl transition-all duration-300"
                disabled={!selectedCity}
              >
                <MapPin className="h-6 w-6" />
              </Button>

              <SavedLocations
                savedLocations={savedLocations}
                onLocationSelect={setSelectedCity}
                onLocationRemove={handleRemoveLocation}
              />

              <button
                onClick={() => setLanguage(language === 'tr' ? 'de' : 'tr')}
                className="flex-1 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/70 hover:text-white flex items-center justify-center py-4 rounded-xl transition-all duration-300"
              >
                <Languages className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
