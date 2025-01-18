import "../db/firebaseConfig";
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {useColorScheme} from '@/hooks/useColorScheme';
import {
  adaptNavigationTheme,
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider
} from "react-native-paper";
import {SafeAreaProvider} from "react-native-safe-area-context";

import {Colors} from "@/constants/Colors";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import App from "@/app/app";
import {Provider} from "react-redux";
import {setupStore} from "@/redux/store";
import "../assets/localization/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "i18next";

const store = setupStore();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const fontConfig = {
    fontFamily: 'RobotoRegular'
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: Colors.dark,
  fonts: configureFonts({config: fontConfig})
};
const customLightTheme = {
  ...MD3LightTheme,
  colors: Colors.light,
  fonts: configureFonts({config: fontConfig})
};

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const paperTheme =
      colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    RobotoLight: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
  });

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('LANGUAGE');
        if (storedLanguage) {
          i18next.changeLanguage(storedLanguage);
        }
      } catch (e) {
        console.error("Error loading languages: ", e);
      }

    }
    if (loaded) {
      loadLanguage()
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <Provider store={store}>
        <PaperProvider theme={paperTheme}>
          <SafeAreaProvider>
            <App/>
          </SafeAreaProvider>
        </PaperProvider>
      </Provider>
  );
}
