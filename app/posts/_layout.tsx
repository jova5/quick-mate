import {Stack} from "expo-router";
import {useTheme} from "react-native-paper";
import {useTranslation} from "react-i18next";

const Layout = () => {

  const theme = useTheme();
  const {t} = useTranslation();

  return(
      <Stack>
        <Stack.Screen name="index"  options={
          {
            title: t("newPost"),
            headerShown: true,
            headerStyle: {backgroundColor: theme.colors.surfaceVariant},
            headerShadowVisible: false,
            headerTitleStyle: {color: theme.colors.onSurfaceVariant},
            headerTintColor: theme.colors.onSurfaceVariant
          }} />
        <Stack.Screen name="[id]" options={{headerShown: false, headerShadowVisible: false}}/>
      </Stack>
  )
}

export default Layout;
