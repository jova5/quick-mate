import {FlatList, Platform, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Button, Card, Dialog, FAB, MD3Theme, Portal, Text, useTheme} from "react-native-paper";
import {HOME_ITEMS} from "@/constants/HomeItems";
import {router} from "expo-router";
import {useState} from "react";

const HomeScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
      <View style={{flex: 1}}>
        <Container style={styles.container}>
          <FlatList
              data={HOME_ITEMS}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, _) => `${item.id}`}
              renderItem={({item}) => (
                  <Card
                      // onPress={() => { router.push({pathname:"/post", params: {id: 1}})
                      onPress={() => router.push(`/posts/${item.id}`)}
                      style={{marginHorizontal: 16, marginBottom: 8}}
                  >
                    <Card.Title
                        style={{marginTop: 0, paddingTop: 0, width: '100%'}}
                        titleStyle={{marginTop: 0, paddingVertical: 4, textAlign: 'center'}}
                        title={item.title.toUpperCase()}
                        titleNumberOfLines={2}
                        titleVariant={"titleLarge"}
                    />
                    <Card.Content>
                      <Text
                          variant="bodyLarge"
                          numberOfLines={5}>{item.description}</Text>
                    </Card.Content>
                    <Card.Actions>
                      <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
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
                    </Card.Actions>
                    <Card.Actions>
                      <Button
                          mode="contained-tonal"
                          onPress={() => showDialog()}
                          style={{width: '100%'}}
                          uppercase={true}
                      >prihvati</Button>
                    </Card.Actions>
                  </Card>
              )}/>
        </Container>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Potvrda</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Potvrdite obavezu izvrsavanja sledeceg zadatka:</Text>
            </Dialog.Content>
            <Dialog.Content>
              <Text variant="bodyMedium">Nazvi posla</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>ACCPET</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
        />
      </View>

  )
}

export default HomeScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      paddingTop: 8
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })
}
