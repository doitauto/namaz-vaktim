
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light tracking-wider text-white/90 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9]">
            {selectedCity ? selectedCity.name : 'Gebetszeiten'}
          </h1>
        </div>

        <div className="relative w-full aspect-square">
          <div className="absolute inset-0">
            <div className="w-full h-full rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(139,92,246,0.1)] p-8">
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

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent">
          <div className="max-w-3xl mx-auto space-y-2">
            <LocationButton onLocationRequest={handleLocationRequest} />
            <CitySearch onCitySelect={setSelectedCity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
