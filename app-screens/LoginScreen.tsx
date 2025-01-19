import {Image, Platform, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Button, Dialog, IconButton, MD3Theme, Portal, useTheme} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useTranslation} from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import {changeI18NLanguage} from "@/assets/localization/i18n";
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {selectUser, setIsLoggedUserLoading} from "@/redux/user-slice/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {isLoggedUserLoading} = useAppSelector(selectUser);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const [isLanguageModalShowing, setIsLanguageModalShowing] = useState(false);
  const [chosenLanguage, setChosenLanguage] = useState<"rs" | "en" | undefined>(undefined);

  const hideLanguageModal = () => setIsLanguageModalShowing(false);
  const showLanguageModal = () => setIsLanguageModalShowing(true);

  const changeLanguageLocalization = (languageCode: "rs" | "en") => {

    changeI18NLanguage(languageCode);
    setChosenLanguage(languageCode);
    hideLanguageModal();
  }

  async function onGoogleButtonPress() {

    try {
      dispatch(setIsLoggedUserLoading(true));

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
      dispatch(setIsLoggedUserLoading(false));
    }
  }

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const languageCode = await AsyncStorage.getItem('LANGUAGE');
    const lngCode = "rs" === languageCode ? "rs" : "en";
    setChosenLanguage(lngCode);
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
        <View style={{height: '40%', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../assets/images/splash-icon.png')}
                 style={{width: 200, height: 200, borderRadius: 150}}
          />
        </View>
        <View style={{alignItems: 'center'}}>
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
