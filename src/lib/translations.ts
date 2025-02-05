
type TranslationType = {
  [key: string]: {
    nextPrayerLabel: string;
    nextPrayer: string;
    qiblaDirection: string;
    locationPlaceholder: string;
    savedLocations: string;
    saveLocation: string;
    updateLocation: string;
    unknown: string;
  };
};

export const translations: TranslationType = {
  tr: {
    nextPrayerLabel: "Vaktin Çıkmasına Kalan Süre",
    nextPrayer: "Sonraki Namaz",
    qiblaDirection: "Kıble Yönü",
    locationPlaceholder: "Şehir ara...",
    savedLocations: "Kayıtlı Konumlar",
    saveLocation: "Konumu Kaydet",
    updateLocation: "Konumu Güncelle",
    unknown: "Bilinmeyen Konum"
  },
  de: {
    nextPrayerLabel: "Zeit bis zum nächsten Gebet",
    nextPrayer: "Nächstes Gebet",
    qiblaDirection: "Qibla-Richtung",
    locationPlaceholder: "Stadt suchen...",
    savedLocations: "Gespeicherte Orte",
    saveLocation: "Ort speichern",
    updateLocation: "Standort aktualisieren",
    unknown: "Unbekannter Ort"
  }
};

export const getTranslation = (lang: string = 'de') => {
  return translations[lang] || translations.de;
};

