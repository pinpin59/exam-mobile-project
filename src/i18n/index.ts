// i18next s'utilise via son instance par défaut (i18n.use, i18n.changeLanguage)
/* eslint-disable import/no-named-as-default-member */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

const KEY = '@eventease/language';

export const resources = { fr: { translation: fr }, en: { translation: en } } as const;
export type Language = keyof typeof resources;
export const languages = Object.keys(resources) as Language[];

const isLanguage = (v: string | null | undefined): v is Language =>
  !!v && v in resources;

const deviceLanguage = getLocales()[0]?.languageCode;

i18n.use(initReactI18next).init({
  resources,
  lng: isLanguage(deviceLanguage) ? deviceLanguage : 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }, // React échappe déjà
});

// Une langue choisie dans l'app prime sur celle de l'appareil
AsyncStorage.getItem(KEY).then((v) => {
  if (isLanguage(v)) i18n.changeLanguage(v);
});

export function setLanguage(lng: Language) {
  i18n.changeLanguage(lng);
  AsyncStorage.setItem(KEY, lng);
}

export default i18n;
