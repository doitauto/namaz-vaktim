
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
  
  const { prayerTimes, hijriDate, isLoading, location, nearestLocation } = usePrayerTimes(
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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] px-4 py-8">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-wider text-white/90">
            {selectedCity ? selectedCity.name : 'Gebetszeiten'}
          </h1>
          {prayerTimes && prayerTimes.length > 0 && (
            <NextPrayerTimer 
              nextPrayer={prayerTimes[0]} 
              className="inline-block"
            />
          )}
        </div>

        <div className="space-y-3">
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

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-