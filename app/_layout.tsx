import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider} from "react-native-paper";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Colors} from "@/constants/Colors";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import merge from "deepmerge";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
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
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <Stack>
            {/*LOGIN SCREEN*/}
            <Stack.Screen name="index" options={{headerShown: false}}/>
            {/*HOME SCREENS*/}
            <Stack.Screen name="(home)" options={{headerShown: false}}/>
            {/*PROFILE SCREENS*/}
            <Stack.Screen name="(profile)" options={{headerShown: false}}/>
            <Stack.Screen name="+not-found"/>
          </Stack>
        </SafeAreaProvider>
      </PaperProvider>
  );
}
