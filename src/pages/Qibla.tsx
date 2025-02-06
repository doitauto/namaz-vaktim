
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

    const requestPermission = async () => {
      // @ts-ignore - Diese Warnung ignorieren, da die TypeScript-Definitionen nicht vollständig sind
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          // @ts-ignore
          const permissionState = await (DeviceOrientationEvent as any).requestPermission();
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            toast({
              title: "Zugriff verweigert",
              description: "Bitte erlauben Sie den Zugriff auf den Kompass in den Einstellungen.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Fehler bei der Berechtigungsanfrage:', error);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // @ts-ignore - Diese Warnung ignorieren, da die TypeScript-Definitionen nicht vollständig sind
      if (event.webkitCompassHeading) {
        // iOS devices
        // @ts-ignore
        setDeviceOrientation(event.webkitCompassHeading);
      } else if (event.alpha !== null) {
        // Android devices
        setDeviceOrientation(360 - event.alpha);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F]">
        <div className="glass-morphism p-8 rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
        </div>
      </div>
    );
  }

  const qiblaRotation = direction !== null ? direction - deviceOrientation : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0EA5E9] rounded-full filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-light tracking-wider text-gradient">
            Qibla-Richtung
          </h1>
          
          <p className="text-white/70 glass-morphism px-6 py-3 rounded-full inline-block">
            Die Qibla zeigt die Richtung zur Kaaba in Mekka
          </p>

          <div className="relative w-80 h-80 mx-auto mt-8">
            {/* Kompass-Hintergrund */}
            <div className="absolute inset-0 glass-morphism rounded-full border border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]"></div>
            
            {/* Kaaba-Indikator */}
            <div 
              className="absolute top-1/2 left-1/2 w-2 h-32 -ml-1 origin-bottom transform transition-transform duration-300 ease-out"
              style={{ transform: `translateY(-100%) rotate(${qiblaRotation}deg)` }}
            >
              <div className="w-4 h-4 -ml-1 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-full shadow-lg shadow-[#8B5CF6]/50"></div>
              <div className="w-0.5 h-full bg-gradient-to-b from-[#8B5CF6] to-transparent mx-auto"></div>
            </div>

            {/* Kompass-Markierungen */}
            <div className="absolute inset-0">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute top-0 left-1/2 w-0.5 h-full origin-bottom"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="w-0.5 h-4 bg-white/30"></div>
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
              className="glass-morphism text-white hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <Compass className="h-4 w-4 mr-2" />
              Standort aktualisieren
            </Button>
          </div>

          {direction !== null && (
            <p className="text-white/70 mt-4 glass-morphism px-4 py-2 rounded-full inline-block">
              Qibla-Richtung: {Math.round(direction)}°
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Qibla;
