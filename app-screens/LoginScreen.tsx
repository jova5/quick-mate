import {Image, Platform, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Button, Dialog, IconButton, MD3Theme, Portal, Text, useTheme} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {useAppDispatch} from "@/redux/hooks";
import {useTranslation} from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import {changeI18NLanguage} from "@/assets/localization/i18n";
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {setIsLoggedIn, setUserInfo, UserInfo} from "@/redux/user-slice/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addUser,
  checkUserByEmail,
  CreateUserInterface,
  getUser,
  UserInterface
} from "@/db/collections/users";
import {router} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createNotificationChannel} from "@/assets/scripts/rnFireBase";

const LoginScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const [isLanguageModalShowing, setIsLanguageModalShowing] = useState(false);
  const [isLoggedUserLoading, setIsLoggedUserLoading] = useState(false)
  const [chosenLanguage, setChosenLanguage] = useState<"rs" | "en" | undefined>(undefined);

  const hideLanguageModal = () => setIsLanguageModalShowing(false);
  const showLanguageModal = () => setIsLanguageModalShowing(true);

  const changeLanguageLocalization = (languageCode: "rs" | "en") => {

    changeI18NLanguage(languageCode);
    setChosenLanguage(languageCode);
    hideLanguageModal();
  }

  useEffect(() => {

    auth().onAuthStateChanged((currentUser) => {

      if (currentUser) {
        handleLoggedInUser(currentUser);
      } else {
        dispatch(setIsLoggedIn(false));
      }
    });

    createNotificationChannel();

    loadLanguage();

    SplashScreen.hideAsync();
  }, []);

  const handleLoggedInUser = async (currentUser: FirebaseAuthTypes.User | null) => {

    let userInfo;

    const exists = await checkUserByEmail(currentUser?.email!);

    if (!exists) {

      const displayedName = currentUser?.displayName?.split(' ');

      userInfo = {
        id: currentUser?.uid,
        firstName: displayedName === undefined ? "" : displayedName[0],
        lastName: displayedName === undefined ? "" : displayedName[1],
        email: currentUser?.email,
        phoneNumber: currentUser?.phoneNumber,
        notificationToken: null,
        cityId: null,
        photoURL: currentUser?.photoURL,
        cityName: null,
      }

      await addLoggedUser(currentUser?.uid!, userInfo);

      dispatch(setUserInfo(userInfo));
    } else {

      const loggedUser = await getLoggedUser(currentUser?.uid!);

      userInfo = {
        id: currentUser?.uid,
        firstName: loggedUser?.firstName,
        lastName: loggedUser?.lastName,
        email: loggedUser?.email,
        phoneNumber: loggedUser?.phoneNumber,
        notificationToken: loggedUser?.notificationToken,
        cityId: loggedUser?.cityId,
        photoURL: loggedUser?.photoURL,
        cityName: loggedUser?.cityName
      }

      dispatch(setUserInfo(userInfo));
    }

    dispatch(setIsLoggedIn(true));

    if (!exists
        || userInfo?.phoneNumber === null
        || userInfo?.phoneNumber === undefined
        || userInfo?.phoneNumber === "") {
      router.navigate('/after-login-setup');
    } else {
      router.navigate('/home')
    }

    setIsLoggedUserLoading(false);
  }

  async function getLoggedUser(id: string) {

    setIsLoggedUserLoading(true);

    try {

      const user: UserInterface | null = await getUser(id);

      setIsLoggedUserLoading(false);

      return user;
    } catch (e) {
      console.error("Error getting logged user: ", e);
      setIsLoggedUserLoading(false);
    } finally {
      setIsLoggedUserLoading(false);
    }
  }

  const loadLanguage = async () => {
    const languageCode = await AsyncStorage.getItem('LANGUAGE');
    const lngCode = "rs" === languageCode ? "rs" : "en";
    setChosenLanguage(lngCode);
  }

  async function onGoogleButtonPress() {

    try {

      setIsLoggedUserLoading(true);

      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const signInResult = await GoogleSignin.signIn();

      const user = signInResult.data;

      if (!user?.idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(user?.idToken);

      const t = await auth().signInWithCredential(googleCredential);
      return t
    } catch (e) {
      console.error("Error continue with google: ", e)
      setIsLoggedUserLoading(false);

    }
  }

  async function addLoggedUser(id: string, user: UserInfo) {

    try {
      const userData: CreateUserInterface = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        cityId: user.cityId,
        notificationToken: user.notificationToken,
        cityName: user.cityName
      };

      await addUser(id, userData);
    } catch (e) {
      console.error("Error adding logged user: ", e);
    }
  }

  return (
      <Container style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <IconButton
              onPress={showLanguageModal}
              icon={({size, color}) => {
                return <Icon name="language" size={size} color={color}/>
              }}
          />
        </View>
        <View style={{height: '40%', justifyContent: 'center'}}>
          <Text variant='displayLarge' style={{textAlign: 'center'}}>Quick Mate</Text>
        </View>
        <View style={{alignItems: 'center', width: '100%'}}>
          <Button
              loading={isLoggedUserLoading}
              mode='contained-tonal'
              icon={() => (
                  <Image source={require('../assets/icon/google-icon.png')}
                         style={{width: 20, height: 20,}}
                  />
              )}
              contentStyle={{flexDirection: 'row-reverse'}}
              onPress={() => {
                onGoogleButtonPress();
              }}>{t("continueWith")}</Button>
        </View>

        <Portal>
          <Dialog visible={isLanguageModalShowing} onDismiss={hideLanguageModal}>
            <Dialog.Title>{t("chooseLanguage")}</Dialog.Title>
            <Dialog.Actions
                style={{
                  padding: 4,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
              <Button
                  style={{flex: 1}}
                  mode={chosenLanguage === "rs" ? 'contained' : 'outlined'}
                  onPress={() => changeLanguageLocalization("rs")}>
                {t("serbian")}</Button>
            </Dialog.Actions>
            <Dialog.Actions
                style={{
                  padding: 4,
                  justifyContent: 'center',
                  alignContent: 'center'
                }}>
              <Button
                  style={{flex: 1}}
                  mode={chosenLanguage === "en" ? 'contained' : 'outlined'}
                  onPress={() => changeLanguageLocalization("en")}>
                {t("english")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Container>
  )
}

export default LoginScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 16,
    }
  })
}
