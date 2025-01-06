import {View} from "react-native";
import {Button} from "react-native-paper";
import {useAppDispatch} from "@/redux/hooks";
import {setIsLoggedIn} from "@/redux/user-slice/userSlice";
import {useTranslation} from "react-i18next";

const ProfileInfo = () => {

  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  return (
      <View>
        <Button onPress={() => dispatch(setIsLoggedIn(false))}>{t('logOut')}</Button>
      </View>
  )
}

export default ProfileInfo;
