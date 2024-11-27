import {Stack} from "expo-router";

const ProfileScreens = () => {
  return(
      <Stack>
        <Stack.Screen name="profile" options={{headerShown: false}}/>
      </Stack>
  )
}

export default ProfileScreens;
