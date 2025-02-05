
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1529] to-[#0f2547]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1529] to-[#0f2547] px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-wider text-white/90">
            {selectedCity ? selectedCity.name : 'Gebetszeiten'}
          </h1>
        </div>

        <div className="relative w-full aspect-square">
          <div className="absolute inset-0">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm p-8">
              <div className="relative w-full h-full">
                {prayerTimes.length > 0 && (
                  <NextPrayerTimer 
                    nextPrayer={prayerTimes[0]} 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                )}
                <div className="absolute inset-0">
                  {prayerTimes?.map((prayer, index) => (
                    <PrayerCard
                      key={prayer.name}
                      prayer={prayer}
                      isNext={index === 0}
                      index={index}
                      total={prayerTimes.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <LocationInfo 
          city={selectedCity?.name || 'Aktueller Standort'} 
          hijriDate={hijriDate}
        />

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-lg mx-auto space-y-2">
            <LocationButton onLocationRequest={handleLocationRequest} />
            <CitySearch onCitySelect={setSelectedCity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
