import {StyleSheet, Platform, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Text, Button, Checkbox, MD3Theme, useTheme} from "react-native-paper";
import {router} from "expo-router";
import {useState} from "react";

const App = () => {

  const theme = useTheme();
  const styles = createStyles(theme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const [checked, setChecked] = useState(false);

  return (
      <Container style={styles.container}>
        <Text>LOGIN SCREEN</Text>
        {/*<Button*/}
        {/*    mode='contained'*/}
        {/*    onPress={() => {*/}
        {/*      router.navigate('/profile')*/}
        {/*    }}>*/}
        {/*  PROFILE SCREEN</Button>*/}
        <Button
            mode='outlined'
            onPress={() => {
              router.navigate('/home')
            }}>
          HOME SCREEN</Button>
        <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
        />
      </Container>
  )
}

export default App;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 16
    }
  })
}
