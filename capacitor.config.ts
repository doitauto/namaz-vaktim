
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f7322767919e404c92d29a8fed528e93',
  appName: 'prayer-schedule-safari',
  webDir: 'dist',
  server: {
    url: 'https://f7322767-919e-404c-92d2-9a8fed528e93.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: true
  }
};

export default config;
