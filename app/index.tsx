import {Image, Platform, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Button, Dialog, IconButton, MD3Theme, Portal, Text, useTheme} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useTranslation} from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import {changeI18NLanguage} from "@/assets/localization/i18n";
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firebase from "firebase/compat";
import {selectUser, setIsLoggedIn, setUserInfo, UserInfo} from "@/redux/user-slice/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserCredential} from "@firebase/auth-types";
import {addUser, CreateUserInterface, getUser, UserInterface} from "@/db/collections/users";
import auth = firebase.auth;
import {router} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {addPost, CreatePostInterface, PostStatus} from "@/db/collections/posts";
import {Timestamp} from "@firebase/firestore";
import {formatToISODate, formatToISOTime} from "@/assets/functions/dateFormater";
import {setSelectedCityId, setSelectedCityName} from "@/redux/city-slice/citySlice";

const LoginScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const [isLanguageModalShowing, setIsLanguageModalShowing] = useState(false);


  const [isLoggedUserLoading, setIsLoggedUserLoading] = useState(false);
  const hideLanguageModal = () => setIsLanguageModalShowing(false);

  const showLanguageModal = () => setIsLanguageModalShowing(true);

  const changeLanguageLocalization = (languageCode: "rs" | "en") => {

    changeI18NLanguage(languageCode);
    hideLanguageModal();

  }

  useEffect(() => {

    // GoogleSignin.configure({
    //   webClientId: "394706700488-i46gnrvhq126vcvmcte9re19lcm3qaaa.apps.googleusercontent.com",
    // });


    checkIsLoggedIn().then(isLogged => {
      if (isLogged) {
        dispatch(setIsLoggedIn(true));

        let userInfo;

        getLoggedUser().then(loggedUser => {
          userInfo = {
            firstName: loggedUser?.firstName,
            lastName: loggedUser?.lastName,
            email: loggedUser?.email,
            phoneNumber: loggedUser?.phoneNumber,
            notifyPhoneId: null,
            cityId: null,
            photoURL: loggedUser?.photoURL,
          }

          dispatch(setUserInfo(userInfo));
        });

        router.navigate('/home');
        // dispatch(setIsLoggedIn(false));
      } else {
        dispatch(setIsLoggedIn(false));
      }
    });

    SplashScreen.hideAsync();
  }, []);

  const checkIsLoggedIn = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('AUTH_TOKEN');
      if (storedToken) {
        const credential = auth.GoogleAuthProvider.credential(storedToken);
        await auth().signInWithCredential(credential);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Greška pri provjeri prijave:', error);
      return false;
    }

  };

  async function getLoggedUser() {

    setIsLoggedUserLoading(true);

    try {

      const userId = GoogleSignin.getCurrentUser()?.user.id;

      const user: UserInterface | null = await getUser(userId!);

      setIsLoggedUserLoading(false);

      return user;
    } catch (e) {
      console.log(e);
      setIsLoggedUserLoading(false);
    } finally {
      setIsLoggedUserLoading(false);
    }
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

      const userCredential = await auth().signInWithCredential(googleCredential);

      const userI = userCredential.user;

      const userInfo = {
        firstName: user?.user.givenName,
        lastName: user?.user.familyName,
        email: user?.user.email,
        phoneNumber: userI?.phoneNumber,
        notifyPhoneId: null,
        cityId: null,
        photoURL: user?.user.photo,
      }

      dispatch(setUserInfo(userInfo));

      await addLoggedUser(user.user.id, userInfo);

      await AsyncStorage.setItem('AUTH_TOKEN', user?.idToken);
      dispatch(setIsLoggedIn(true));

      // navigiraj podesavanje telefonskog broja
      // navigiraj podesavanje grada

      router.navigate('/home')

      setIsLoggedUserLoading(false);

      return userCredential;
    } catch (e) {
      console.log("error: " + e)
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
        notifyPhoneId: user.notifyPhoneId
      };

      await addUser(id, userData);
    } catch (e) {
      console.log(e);
    } finally {
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
                  <Image source={require('../assets/icon/unnamed.png')}
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
                  mode={'outlined'}
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
                  mode={'outlined'}
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
