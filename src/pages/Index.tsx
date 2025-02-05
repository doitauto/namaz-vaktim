import { useState } from 'react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PrayerCard } from '@/components/PrayerCard';
import { CitySearch } from '@/components/CitySearch';
import { LocationButton } from '@/components/LocationButton';
import { City } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  const { prayerTimes, isLoading, location } = usePrayerTimes(
    selectedCity?.latitude,
    selectedCity?.longitude
  );

  const handleLocationRequest = () => {
    setSelectedCity(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {selectedCity ? selectedCity.name : 'Gebetszeiten'}
        </h1>
        
        <LocationButton onLocationRequest={handleLocationRequest} />
        <CitySearch onCitySelect={setSelectedCity} />

        <div className="space-y-4 mt-6">
          {prayerTimes?.map((prayer, index) => (
            <PrayerCard
              key={prayer.name}
              prayer={prayer}
              isNext={index === 0} // Vereinfacht - sollte eigentlich die nächste Gebetszeit markieren
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;