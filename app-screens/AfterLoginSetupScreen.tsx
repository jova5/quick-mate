import {Platform, ScrollView, StyleSheet, View} from "react-native";
import {Button, HelperText, MD3Theme, TextInput, useTheme} from "react-native-paper";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectUser, setUserPhoneAndCity} from "@/redux/user-slice/userSlice";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";
import React, {useEffect, useState} from "react";
import {selectCity, setSelectedCityId, setSelectedCityName} from "@/redux/city-slice/citySlice";
import {updateUserPhoneNumberAndCityId} from "@/db/collections/users";
import {SafeAreaView} from "react-native-safe-area-context";
import {Controller, SubmitHandler, useForm} from "react-hook-form";

type AfterLoginFormData = {
  contactPhoneNumber: string,
  city: string,
}

const REGEX = {
  numbers: /^[0-9]+$/,
}

const AfterLoginSetupScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const {selectedCityId, selectedCityName} = useAppSelector(selectCity);
  const {user} = useAppSelector(selectUser);

  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<AfterLoginFormData>({
    mode: "onSubmit",
  });

  const submit: SubmitHandler<AfterLoginFormData> = async (data: AfterLoginFormData) => {

    setIsUserUpdating(true)

    try {
      await updateUserPhoneNumberAndCityId(user?.id!, data.contactPhoneNumber, selectedCityId!, selectedCityName!);

      dispatch(setUserPhoneAndCity({
        phoneNumber: data.contactPhoneNumber,
        cityId: selectedCityId,
        cityName: selectedCityName
      }));

      setIsUserUpdating(false);

      router.navigate('/home');
    } catch (e) {
      console.error("Error updating user phone number and city: ", e);
      setIsUserUpdating(false);
    } finally {
      setIsUserUpdating(false);
    }
  }

  useEffect(() => {
    setValue('city', selectedCityName!, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [selectedCityName, control]);

  useEffect(() => {

    dispatch(setSelectedCityId(undefined));
    dispatch(setSelectedCityName(undefined));
    return () => {
      dispatch(setSelectedCityId(undefined));
      dispatch(setSelectedCityName(undefined));
    }
  }, []);

  return (
      <Container style={styles.container}>
        <Controller
            control={control}
            defaultValue={selectedCityName}
            name="city"
            rules={{
              required: {value: selectedCityName !== undefined, message: t('fieldRequired')},
            }}
            render={({field: {onChange, onBlur, value}}) => (
                <>
                  <TextInput
                      outlineColor={errors.city ? theme.colors.error : undefined}
                      activeOutlineColor={errors.city ? theme.colors.error : undefined}
                      style={{color: theme.colors.error}}
                      mode="outlined"
                      label={t("city")}
                      value={selectedCityName ?? value}
                      onPress={() => {
                        router.push('/city?mode=AFTER_LOGIN')
                      }}
                  />
                  <HelperText type="error">{errors.city?.message}</HelperText>
                </>
            )}
        />
        <Controller
            control={control}
            defaultValue={""}
            name="contactPhoneNumber"
            rules={{
              required: {value: true, message: t('fieldRequired')},
              pattern: {message: t('phoneNumberInvalid'), value: REGEX.numbers},
            }}
            render={({field: {onChange, onBlur, value}}) => (
                <>
                  <TextInput
                      outlineColor={errors.contactPhoneNumber ? theme.colors.error : undefined}
                      activeOutlineColor={errors.contactPhoneNumber ? theme.colors.error : undefined}
                      style={{color: theme.colors.error}}
                      mode="outlined"
                      label={t("contactPhone")}
                      placeholder="06x123456"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={(value) => onChange(value)}
                  />
                  <HelperText type="error">{errors.contactPhoneNumber?.message}</HelperText>
                </>
            )}
        />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
              mode='contained'
              loading={isUserUpdating}
              onPress={() => {
                if (selectedCityName === undefined) {
                  dispatch(setSelectedCityName(""));
                }
                handleSubmit(submit)();
              }}
          >{t('next').toUpperCase()}</Button>
        </View>
      </Container>
  )
}

export default AfterLoginSetupScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 12
    }
  })
}
