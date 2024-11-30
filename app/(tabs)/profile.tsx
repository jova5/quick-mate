import {Platform, ScrollView, StyleSheet, View} from "react-native";
import {MD3Theme, Text, useTheme} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return (
      <Container style={styles.container}>
        <Text>PROFILE</Text>
      </Container>
  )
};

export default ProfileScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 16
    }
  })
}
