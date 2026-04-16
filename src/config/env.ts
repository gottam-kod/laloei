import { Platform } from 'react-native';

export const ENV = {
  APP_ENV: process.env.APP_ENV || 'development',
  API_BASE_URL:
    process.env.APP_ENV === 'production'
      ? 'https://api.laloei.com'
      : 'https://api-dev.laloei.com',
  PLATFORM: Platform.OS,
};
