import {router, Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useTheme} from "react-native-paper";
import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {selectUser} from "@/redux/user-slice/userSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";

const App = () => {

  const colorScheme = useColorScheme();
  const theme = useTheme();
  const {t} = useTranslation();
  const {isLoggedIn} = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {

    if (isLoggedIn === false) {
      router.navigate('/');
    }
  }, [isLoggedIn]);

  return (
      <>
        <Stack initialRouteName="(tabs)">
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
          <Stack.Screen name="after-login-setup" options={
            {
              headerShown: false
            }}/>
          <Stack.Screen name="map" options={
            {
              headerShown: false
            }}/>
          <Stack.Screen name="+not-found"/>
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>
      </>
  )
}

export default App;
