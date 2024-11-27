import {Stack} from "expo-router";

const HomeScreens = () => {
  return(
      <Stack>
        <Stack.Screen name="home" options={{headerShown: false}}/>
      </Stack>
  )
}

export default HomeScreens;
