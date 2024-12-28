import {Button, MD3Theme, useTheme} from "react-native-paper";
import {FlatList, Platform, ScrollView, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {HOME_ITEMS} from "@/constants/HomeItems";

const CityScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return(
      <Container style={styles.container}>
        <FlatList
            data={HOME_ITEMS}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, _) => `${item.id}`}
            renderItem={({item}) => {
              return (
                  <Button onPress={() => {
                    console.log(item.id)}} style={{margin: 4}} mode='contained-tonal'>{item.title}</Button>
              )
            }}
        />
      </Container>
  )
}

export default CityScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    surface: {
      padding: 8,
      margin: 8,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 16
    },
  })
}
