import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './english.json';
import rs from './serbian-lat.json';
import {getLocales} from "expo-localization";

export const resources = {
  en: {translation: en},
  rs: {translation: rs},
};

i18next
.use(initReactI18next)
.init({
  compatibilityJSON: 'v4',
  resources,
  lng: getLocales()[0].languageCode ?? 'en',// default language to use.
});

export default i18next;
