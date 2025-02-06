import {StyleSheet, View} from "react-native";
import {Button, HelperText, MD3Theme, TextInput, useTheme} from "react-native-paper";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectUser, setIsLoggedIn, setUserInfo} from "@/redux/user-slice/userSlice";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {updateUserData} from "@/db/collections/users";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {setSelectedCityId, setSelectedCityName} from "@/redux/city-slice/citySlice";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

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
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

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
      console.error("Error updating user info: ", e);
      setIsUserUpdating(false);
    } finally {
      setIsUserUpdating(false);
    }
  }

  const handleSignOut = async () => {

    setIsLoggingOut(true);

    signOut().then(() => {
      dispatch(setIsLoggedIn(false));
      dispatch(setSelectedCityId(undefined));
      dispatch(setSelectedCityName(undefined));
      dispatch(setUserInfo(undefined));
    });
  }

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

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
                        mode="outlined"
                        label={t("firstName")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    {
                        errors.firstName?.message &&
                        <HelperText type="error">{errors.firstName?.message}</HelperText>
                    }
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
                        style={!errors.firstName?.message && {marginTop: 4}}
                        outlineColor={errors.lastName ? theme.colors.error : undefined}
                        activeOutlineColor={errors.lastName ? theme.colors.error : undefined}
                        mode="outlined"
                        label={t("lastName")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    {
                        errors.lastName?.message &&
                        <HelperText type="error">{errors.lastName?.message}</HelperText>
                    }
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
                        style={!errors.lastName?.message && {marginTop: 4}}
                        outlineColor={errors.email ? theme.colors.error : undefined}
                        activeOutlineColor={errors.email ? theme.colors.error : undefined}
                        mode="outlined"
                        label={t("email")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    {
                        errors.email?.message &&
                        <HelperText type="error">{errors.email?.message}</HelperText>
                    }
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
                        style={!errors.email?.message && {marginTop: 4}}
                        outlineColor={errors.phoneNumber ? theme.colors.error : undefined}
                        activeOutlineColor={errors.phoneNumber ? theme.colors.error : undefined}
                        mode="outlined"
                        label={t("phoneNumber")}
                        value={value}
                        onChangeText={(value) => onChange(value)}
                    />
                    {
                        errors.phoneNumber?.message &&
                        <HelperText type="error">{errors.phoneNumber?.message}</HelperText>
                    }
                  </>
              )}
          />
          <View style={{marginTop: 8}}>
            <Button
                loading={isUserUpdating}
                mode="outlined"
                onPress={() => {
                  handleSubmit(submit)();
                }}
            >{t('save')}</Button>
          </View>
        </View>
        <Button
            loading={isLoggingOut}
            mode="contained"
            onPress={() => handleSignOut()}
        >{t('logOut')}</Button>
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
