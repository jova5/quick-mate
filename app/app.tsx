import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useTheme} from "react-native-paper";

const App = () => {

  const colorScheme = useColorScheme();
  const theme = useTheme();

  return(
      <>
        <Stack>
          {/*LOGIN SCREEN*/}
          <Stack.Screen name="index" options={{headerShown: false}}/>
          {/*HOME SCREENS*/}
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
          <Stack.Screen name="posts/[id]" options={
            {
              headerShown: true,
              headerStyle: {backgroundColor: theme.colors.surfaceVariant},
              headerShadowVisible: false,
              headerTitleStyle: {color: theme.colors.onSurfaceVariant},
              headerTintColor: theme.colors.onSurfaceVariant
            }}/>
          <Stack.Screen name="+not-found"/>
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>
      </>
  )
}

export default App;
