
import { useState } from 'react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PrayerCard } from '@/components/PrayerCard';
import { CitySearch } from '@/components/CitySearch';
import { LocationButton } from '@/components/LocationButton';
import { NextPrayerTimer } from '@/components/NextPrayerTimer';
import { LocationInfo } from '@/components/LocationInfo';
import { City } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  const { prayerTimes, hijriDate, isLoading, location } = usePrayerTimes(
    selectedCity?.latitude,
    selectedCity?.longitude
  );

  const handleLocationRequest = () => {
    setSelectedCity(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">
            {selectedCity ? selectedCity.name : 'Gebetszeiten'}
          </h1>
          <p className="text-gray-500 text-sm">
            Alle Zeiten für heute
          </p>
        </div>
        
        <LocationButton onLocationRequest={handleLocationRequest} />
        <CitySearch onCitySelect={setSelectedCity} />

        <LocationInfo 
          city={selectedCity?.name || 'Aktueller Standort'} 
          hijriDate={hijriDate}
        />

        {prayerTimes.length > 0 && (
          <NextPrayerTimer nextPrayer={prayerTimes[0]} />
        )}

        <div className="space-y-2">
          {prayerTimes?.map((prayer, index) => (
            <PrayerCard
              key={prayer.name}
              prayer={prayer}
              isNext={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
