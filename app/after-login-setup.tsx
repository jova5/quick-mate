import {Platform, ScrollView, StyleSheet, View} from "react-native";
import {Button, MD3Theme, TextInput, useTheme} from "react-native-paper";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectUser, setUserPhoneAndCity} from "@/redux/user-slice/userSlice";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";
import React, {useState} from "react";
import {selectCity} from "@/redux/city-slice/citySlice";
import {updateUserPhoneNumberAndCityId} from "@/db/collections/users";
import {SafeAreaView} from "react-native-safe-area-context";

const AfterLoginSetup = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {selectedCityId, selectedCityName} = useAppSelector(selectCity);
  const {user} = useAppSelector(selectUser);

  const [contactNumber, setContactNumber] = useState<string>("");
  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const updateUserPhoneAndCity = async () => {

    setIsUserUpdating(true)

    try {
      await updateUserPhoneNumberAndCityId(user?.id!, contactNumber, selectedCityId, selectedCityName);

      dispatch(setUserPhoneAndCity({
        phoneNumber: contactNumber,
        cityId: selectedCityId,
        cityName: selectedCityName
      }));

      setIsUserUpdating(false);

      router.navigate('/home');
    } catch (e) {
      console.log(e);
      setIsUserUpdating(false);
    } finally {
      setIsUserUpdating(false);
    }
  }

  return (
      <Container style={styles.container}>
        <TextInput
            mode="outlined"
            label={t("city")}
            value={selectedCityName}
            onPress={() => {
              router.push('/city?mode=AFTER_LOGIN')
            }}
        />
        <TextInput
            mode="outlined"
            label={t("contactPhone")}
            placeholder="06x123456"
            value={contactNumber}
            onChangeText={text => setContactNumber(text)}
        />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
              mode='contained'
              loading={isUserUpdating}
              onPress={() => updateUserPhoneAndCity()}
          >{t('next')}</Button>
        </View>
      </Container>
  )
}

export default AfterLoginSetup;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 12
    }
  })
}
