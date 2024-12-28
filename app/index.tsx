import {Image, Platform, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Button, Dialog, IconButton, MD3Theme, Portal, Text, useTheme} from "react-native-paper";
import {router} from "expo-router";
import React, {useState} from "react";
import {useAppDispatch} from "@/redux/hooks";
import {useTranslation} from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import {changeI18NLanguage} from "@/assets/localization/i18n";

const LoginScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const [isLanguageModalShowing, setIsLanguageModalShowing] = useState(false);
  const hideLanguageModal = () => setIsLanguageModalShowing(false);
  const showLanguageModal = () => setIsLanguageModalShowing(true);

  const changeLanguageLocalization = (languageCode: "rs" | "en") => {

    changeI18NLanguage(languageCode);

    hideLanguageModal();
  }

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

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
              mode='contained-tonal'
              icon={() => (
                  <Image source={require('../assets/icon/unnamed.png')}
                         style={{width: 20, height: 20,}}
                  />
              )}
              contentStyle={{flexDirection: 'row-reverse'}}
              onPress={() => {
                router.navigate('/home')
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
