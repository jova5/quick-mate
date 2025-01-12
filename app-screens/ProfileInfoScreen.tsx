import {StyleSheet, View} from "react-native";
import {Button, MD3Theme, useTheme} from "react-native-paper";
import {useAppDispatch} from "@/redux/hooks";
import {setIsLoggedIn, setUserInfo} from "@/redux/user-slice/userSlice";
import {useTranslation} from "react-i18next";

const ProfileInfoScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  return (
      <View style={styles.container}>
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
      padding: 12
    }
  })
}
