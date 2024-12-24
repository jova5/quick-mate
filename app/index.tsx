import {Image, Platform, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Button, MD3Theme, Text, useTheme} from "react-native-paper";
import {router} from "expo-router";
import React from "react";
import {useAppDispatch} from "@/redux/hooks";

const LoginScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return (
      <Container style={styles.container}>
        <View style={{height: '45%', justifyContent: 'center'}}>
          <Text variant='displayLarge' style={{textAlign: 'center'}}>Quick Mate</Text>
        </View>
        <View style={{alignItems: 'center', width: '100%'}}>
          <Button
              mode='contained-tonal'
              icon={() => (
                  <Image source={require('../assets/icon/unnamed.png')}
                         style={{width: 20, height: 20,}}
                  />
              )}
              contentStyle={{flexDirection: 'row-reverse'}}
              onPress={() => {
                router.navigate('/home')
              }}>
            Continue with</Button>
        </View>
      </Container>
  )
}

export default LoginScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 16,
    }
  })
}
