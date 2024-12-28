import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './english.json';
import rs from './serbian-lat.json';
import {getLocales} from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const saveLanguageData = async (languageCode) => {
  try {
    await AsyncStorage.setItem('LANGUAGE', languageCode);
  } catch {
    console.log('err in saving language data');
  }
};

export const changeI18NLanguage = (languageCode) => {
  i18next.changeLanguage(languageCode);
  saveLanguageData(languageCode);
}
