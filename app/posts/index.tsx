import {Platform, ScrollView, StyleSheet} from "react-native";
import {MD3Theme, Text, useTheme} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";

const NewPost = () => {

  const theme = useTheme();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const styles = createStyles(theme);

  return (
      <Container style={styles.container}>
        <Text>NEW POST</Text>
      </Container>
  )
}

export default NewPost;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 16
    }
  })
}
