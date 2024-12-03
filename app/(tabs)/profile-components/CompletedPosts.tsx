import {FlatList, StyleSheet, View} from "react-native";
import {HOME_ITEMS} from "@/constants/HomeItems";
import {Chip, MD3Theme, Surface, Text, useTheme} from "react-native-paper";

const CompletedPosts = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return(
      <View style={{flexDirection: 'column', flex: 1}}>
        <Text>COMPLETED POSTS</Text>
        <FlatList
            data={HOME_ITEMS}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, _) => `${item.id}`}
            renderItem={({item}) => (
                <Surface style={styles.surface} elevation={4}>
                  <View style={{width: '100%', marginBottom: 4}}>
                    <Text variant='titleLarge' style={{textAlign: 'center'}} numberOfLines={2}>
                      {item.title}</Text>
                  </View>
                  <View style={{width: '100%'}}>
                    <Text
                        variant="bodyLarge"
                        numberOfLines={5}>{item.description}</Text>
                  </View>
                  <View style={{
                    width: "100%",
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 4
                  }}
                  >
                    <View style={{justifyContent: 'space-evenly'}}>
                      <Text variant={"bodyLarge"}>Rok</Text>
                      <Text variant={"bodyLarge"}>16:20h 25.11.2024</Text>
                    </View>
                    <View style={{alignItems: "flex-end"}}>
                      <Text variant={"bodyLarge"}>Usluga</Text>
                      <Text variant={"bodyLarge"}>{item.price} KM</Text>
                      <Text variant={"bodyLarge"}>+ prateci troskovi</Text>
                    </View>
                  </View>
                  <Chip
                      style={{width: '100%', justifyContent: 'center', alignSelf: 'center'}}
                      textStyle={{width: '100%', textAlign: 'center'}}
                  >Completed</Chip>
                </Surface>
            )}/>
      </View>
  )
}

export default CompletedPosts;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1
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
