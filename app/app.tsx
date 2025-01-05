import {router, Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useTheme} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {selectUser, setIsLoggedIn, setUserInfo} from "@/redux/user-slice/userSlice";
import * as SplashScreen from "expo-splash-screen";
import {useAppSelector} from "@/redux/hooks";

const App = () => {

  const colorScheme = useColorScheme();
  const theme = useTheme();
  const {t} = useTranslation();
  const {isLoggedIn} = useAppSelector(selectUser);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "394706700488-i46gnrvhq126vcvmcte9re19lcm3qaaa.apps.googleusercontent.com",
    });
  }, []);

  useEffect(() => {

    if (isLoggedIn === false) {
      removeSession().then(() => {
        router.navigate('/');
      });
    }
  }, [isLoggedIn]);


  async function removeSession() {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('AUTH_TOKEN');
  }

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
          <Stack.Screen name="profile-info" options={
            {
              headerTitle: t("profileInfo"),
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
