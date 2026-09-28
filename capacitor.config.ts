import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bishing.optivault',
  appName: 'OptiVault',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
};

export default config;
