import {StyleSheet, View} from "react-native";
import {Button, HelperText, MD3Theme, TextInput, useTheme} from "react-native-paper";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectUser, setIsLoggedIn, setUserInfo} from "@/redux/user-slice/userSlice";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {updateUserData} from "@/db/collections/users";
import {Controller, SubmitHandler, useForm} from "react-hook-form";

type ProfileFormData = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string
}

const REGEX = {
  personalName: /^[a-z ,.'-]+$/i,
  email: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
}

const ProfileInfoScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const {user} = useAppSelector(selectUser);

  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ProfileFormData>({
    mode: "onChange",
  });

  const submit: SubmitHandler<ProfileFormData> = async (data: ProfileFormData) => {

    setIsUserUpdating(true)

    try {

      await updateUserData(user?.id!, data.firstName, data.lastName, data.email, data.phoneNumber);

      dispatch(setUserInfo(
          {
            ...user!,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber
          }
      ));

      setIsUserUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUserUpdating(false);
    } finally {
      setIsUserUpdating(false);
    }
  }

  return (
      <View style={styles.container}>
        <View>
          <Controller
              control={control}
              defaultValue={user?.firstName!}
              name="firstName"
              rules={{
                required: {value: true, message: t('fieldRequired')},
                pattern: {message: t('firstNameInvalid'), value: REGEX.personalName},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                  <>
                    <TextInput
                        outlineColor={errors.firstName ? theme.colors.error : undefined}
                        activeOutlineColor={errors.firstName ? theme.colors.error : undefined}
                        style={{color: theme.colors.error}}
                        mode="outlined"
                        label={t("firstName")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    <HelperText type="error">{errors.firstName?.message}</HelperText>
                  </>
              )}
          />
          <Controller
              control={control}
              defaultValue={user?.lastName!}
              name="lastName"
              rules={{
                required: {value: true, message: t('fieldRequired')},
                pattern: {message: t('lastNameInvalid'), value: REGEX.personalName},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                  <>
                    <TextInput
                        outlineColor={errors.lastName ? theme.colors.error : undefined}
                        activeOutlineColor={errors.lastName ? theme.colors.error : undefined}
                        mode="outlined"
                        label={t("lastName")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    <HelperText type="error">{errors.lastName?.message}</HelperText>
                  </>
              )}
          />
          <Controller
              control={control}
              defaultValue={user?.email!}
              name="email"
              rules={{
                required: {value: true, message: t('fieldRequired')},
                pattern: {message: t('notValidEmail'), value: REGEX.email},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                  <>
                    <TextInput
                        outlineColor={errors.email ? theme.colors.error : undefined}
                        activeOutlineColor={errors.email ? theme.colors.error : undefined}
                        mode="outlined"
                        label={t("email")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    <HelperText type="error">{errors.email?.message}</HelperText>
                  </>
              )}
          />
          <Controller
              control={control}
              defaultValue={user?.phoneNumber!}
              name="phoneNumber"
              rules={{
                required: {value: true, message: t('fieldRequired')}
              }}
              render={({field: {onChange, onBlur, value}}) => (
                  <>
                    <TextInput
                        outlineColor={errors.phoneNumber ? theme.colors.error : undefined}
                        activeOutlineColor={errors.phoneNumber ? theme.colors.error : undefined}
                        mode="outlined"
                        label={t("phoneNumber")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    <HelperText type="error">{errors.phoneNumber?.message}</HelperText>
                  </>
              )}
          />
          <Button
              loading={isUserUpdating}
              mode="outlined"
              onPress={() => {
                handleSubmit(submit)();
              }}
          >{t('save')}</Button>
        </View>
        <Button
            mode="contained"
            onPress={() => {
              dispatch(setIsLoggedIn(false));
              dispatch(setUserInfo(undefined));
            }}>{t('logOut')}</Button>
      </View>
  )
}

export default ProfileInfoScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 12,
      justifyContent: "space-between"
    },
    inputError: {
      borderColor: theme.colors.error
    }
  })
}
