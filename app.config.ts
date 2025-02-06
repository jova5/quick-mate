import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'quick-mate',
  name: 'Potrčko',
  android: {
    googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#6b3ceb"
    },
    package: "com.anonymous.quickmate",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
      }
    }
  },
});
