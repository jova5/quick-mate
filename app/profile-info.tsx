import {View} from "react-native";
import {Button} from "react-native-paper";
import {useAppDispatch} from "@/redux/hooks";
import {setIsLoggedIn} from "@/redux/user-slice/userSlice";

const ProfileInfo = () => {

  const dispatch = useAppDispatch();

  return (
      <View>
        <Button onPress={() => dispatch(setIsLoggedIn(false))}>Log out</Button>
      </View>
  )
}

export default ProfileInfo;
