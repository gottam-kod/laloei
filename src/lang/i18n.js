import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import th from './th.json';
import en from './en.json';

const device = Localization.getLocales()[0];
const initialLng = (device?.languageTag || device?.languageCode || 'th').toLowerCase().startsWith('th') ? 'th' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: { th: { translation: th }, en: { translation: en } },
    lng: initialLng,
    fallbackLng: 'th',
    compatibilityJSON: 'v3',
    interpolation: { escapeValue: false },
  });

export default i18n;
