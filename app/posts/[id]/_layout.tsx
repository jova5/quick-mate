import {Stack} from "expo-router";
import {useTheme} from "react-native-paper";

const Layout = () => {

  const theme = useTheme();

  return (
      <Stack>
        <Stack.Screen name="index" options={
          {
            headerShown: true,
            headerStyle: {backgroundColor: theme.colors.surfaceVariant},
            headerShadowVisible: false,
            headerTitleStyle: {color: theme.colors.onSurfaceVariant},
            headerTintColor: theme.colors.onSurfaceVariant
          }}/>
      </Stack>
  )
}

export default Layout;
