import {FlatList, Platform, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {Button, Card, Dialog, FAB, MD3Theme, Portal, Text, useTheme} from "react-native-paper";
import {HOME_ITEMS} from "@/constants/HomeItems";
import {router} from "expo-router";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const HomeScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

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
                      key={`${item.id}`}
                      onPress={() => router.push(`/posts/${item.id}`)}
                      style={{marginHorizontal: 16, marginBottom: 8, marginTop: 8}}
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
                          <Text variant={"bodyLarge"}>{t("deadline")}</Text>
                          <Text variant={"bodyLarge"}>16:20h 25.11.2024</Text>
                        </View>
                        <View style={{alignItems: "flex-end"}}>
                          <Text variant={"bodyLarge"}>{t("service")}</Text>
                          <Text variant={"bodyLarge"}>{item.price} KM</Text>
                          <Text variant={"bodyLarge"}>{t("plusAccompanyingCosts")}</Text>
                        </View>
                      </View>
                    </Card.Actions>
                    <Card.Actions>
                      <Button
                          mode="contained-tonal"
                          onPress={() => showDialog()}
                          style={{width: '100%'}}
                          uppercase={true}
                      >{t("accept").toUpperCase()}</Button>
                    </Card.Actions>
                  </Card>
              )}/>
        </Container>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{t("confirmation")}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{t("confirmObligation")}</Text>
            </Dialog.Content>
            <Dialog.Content>
              <Text variant="bodyMedium">{t("jobTitle")}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>{t("accept").toUpperCase()}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => {
              router.navigate('/posts')
            }}

        />
      </View>

  )
}

export default HomeScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })
}
