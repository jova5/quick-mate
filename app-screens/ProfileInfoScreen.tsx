import {StyleSheet, View} from "react-native";
import {Button, MD3Theme, TextInput, useTheme} from "react-native-paper";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectUser, setIsLoggedIn, setUserInfo} from "@/redux/user-slice/userSlice";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {updateUserData} from "@/db/collections/users";

const ProfileInfoScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const {user} = useAppSelector(selectUser);

  const [isUserUpdating, setIsUserUpdating] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);

  const updateUserDataInfo = async () => {

    setIsUserUpdating(true)

    try {

      const tempFirstName = firstName ?? user?.firstName!;
      const tempLastName = lastName ?? user?.lastName!;
      const tempEmail = email ?? user?.email!;
      const tempPhoneNumber = phoneNumber ?? user?.phoneNumber!;

      await updateUserData(user?.id!, tempFirstName, tempLastName, tempEmail, tempPhoneNumber);

      dispatch(setUserInfo(
          {
            ...user!,
            firstName: tempFirstName,
            lastName: tempLastName,
            email: tempEmail,
            phoneNumber: tempPhoneNumber
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
          <TextInput
              mode="outlined"
              label={t("firstName")}
              value={firstName ?? user?.firstName!}
              onChangeText={text => setFirstName(text)}
          />
          <TextInput
              mode="outlined"
              label={t("lastName")}
              value={lastName ?? user?.lastName!}
              onChangeText={text => setLastName(text)}
          />
          <TextInput
              mode="outlined"
              label={t("email")}
              value={email ?? user?.email!}
              onChangeText={text => setEmail(text)}
          />
          <TextInput
              style={{marginBottom: 6}}
              mode="outlined"
              label={t("phoneNumber")}
              value={phoneNumber ?? user?.phoneNumber!}
              onChangeText={text => setPhoneNumber(text)}
          />
          <Button
              loading={isUserUpdating}
              mode="outlined"
              onPress={() => updateUserDataInfo()}
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
    }
  })
}
