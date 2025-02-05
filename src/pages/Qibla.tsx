
import { useState, useEffect } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const calculateQiblaDirection = (lat1: number, lon1: number) => {
  // Koordinaten der Kaaba
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;

  // Umrechnung in Radian
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (kaabaLat * Math.PI) / 180;
  const Δλ = ((kaabaLon - lon1) * Math.PI) / 180;

  // Berechnung der Qibla-Richtung
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  let qibla = Math.atan2(y, x);

  // Umrechnung in Grad
  qibla = (qibla * 180) / Math.PI;
  return (qibla + 360) % 360;
};

const Qibla = () => {
  const [direction, setDirection] = useState<number | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getLocation = async () => {
    try {
      setLoading(true);
      const position = await Geolocation.getCurrentPosition();
      const qiblaDirection = calculateQiblaDirection(
        position.coords.latitude,
        position.coords.longitude
      );
      setDirection(qiblaDirection);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Standortermittlung fehlgeschlagen. Bitte überprüfen Sie Ihre Standortfreigabe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceOrientation(event.alpha);
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof DeviceOrientationEvent !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
      </div>
    );
  }

  const qiblaRotation = direction !== null ? direction - deviceOrientation : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] px-4 py-8">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-light tracking-wider text-white/90">
            Qibla-Richtung
          </h1>
          
          <p className="text-white/70">
            Die Qibla zeigt die Richtung zur Kaaba in Mekka
          </p>

          <div className="relative w-72 h-72 mx-auto mt-8">
            {/* Kompass-Hintergrund */}
            <div className="absolute inset-0 bg-white/5 rounded-full border-2 border-white/10 shadow-lg"></div>
            
            {/* Kaaba-Indikator */}
            <div 
              className="absolute top-1/2 left-1/2 w-2 h-24 -ml-1 origin-bottom transform transition-transform duration-300"
              style={{ transform: `translateY(-100%) rotate(${qiblaRotation}deg)` }}
            >
              <div className="w-4 h-4 -ml-1 bg-[#8B5CF6] rounded-full shadow-lg"></div>
              <div className="w-0.5 h-full bg-gradient-to-b from-[#8B5CF6] to-transparent mx-auto"></div>
            </div>

            {/* Kompass-Markierungen */}
            <div className="absolute inset-0">
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute top-0 left-1/2 w-0.5 h-full origin-bottom"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="w-0.5 h-3 bg-white/30"></div>
                </div>
              ))}
            </div>

            {/* Kompass-Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="ghost"
              onClick={getLocation}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Compass className="h-4 w-4 mr-2" />
              Standort aktualisieren
            </Button>
          </div>

          {direction !== null && (
            <p className="text-white/70 mt-4">
              Qibla-Richtung: {Math.round(direction)}°
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Qibla;
