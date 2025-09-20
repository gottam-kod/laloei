import i18n from "../lang/i18n";

export const LOCALES = [
  { lang: 'th', label: 'ไทย' },
  { lang: 'en', label: 'English' },
];

export function getCurrentLocale() {
  return i18n.language;
}

export function setCurrentLocale(locale: string) {
  i18n.changeLanguage(locale);
}
