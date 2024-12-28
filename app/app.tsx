import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useTheme} from "react-native-paper";
import {useTranslation} from "react-i18next";

const App = () => {

  const colorScheme = useColorScheme();
  const theme = useTheme();
  const {t} = useTranslation();

  return (
      <>
        <Stack>
          {/*LOGIN SCREEN*/}
          <Stack.Screen name="index" options={{headerShown: false}}/>
          {/*HOME SCREENS*/}
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
          {/*POSTS SCREENS*/}
          <Stack.Screen name="posts" options={{headerShown: false}}/>
          {/*CITY SCREEN*/}
          <Stack.Screen name="city" options={
            {
              headerTitle: t("city"),
              headerShown: true,
              headerStyle: {backgroundColor: theme.colors.surfaceVariant},
              headerShadowVisible: false,
              headerTitleStyle: {color: theme.colors.onSurfaceVariant},
              headerTintColor: theme.colors.onSurfaceVariant
            }}/>
          <Stack.Screen name="+not-found"/>
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>
      </>
  )
}

export default App;
