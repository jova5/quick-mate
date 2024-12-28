import {useLocalSearchParams, useNavigation} from "expo-router";
import {Platform, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  MD3Theme,
  Portal,
  Text,
  useTheme
} from "react-native-paper";
import {useEffect, useState} from "react";
import {HOME_ITEMS} from "@/constants/HomeItems";
import {useTranslation} from "react-i18next";

const PostTest = () => {
  const params = useLocalSearchParams();
  const {id, other} = params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState(undefined);

  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate some data
      const post = HOME_ITEMS.find(item => item.id.toString() === id)

      navigation.setOptions({title: post?.title});
      setPost(post);
    }, 1000); // 5 seconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);

    // if (id) {
    //   const post = HOME_ITEMS.find(item => item.id.toString() === id)
    //
    //   navigation.setOptions({ title: post?.title});
    //
    //   setIsLoading(true);
    // }
  }, [id, navigation]);

  if (isLoading) {
    return (
        // TODO ADD skeleton loading
        <Container style={styles.container}>
          <ActivityIndicator size="large" animating={true}/>
        </Container>
    )
  }

  return (
      <Container style={styles.container}>
        <Card
            style={{marginHorizontal: 16, marginBottom: 8, marginTop: 16}}
        >
          <Card.Title
              style={{marginTop: 0, paddingTop: 0, width: '100%'}}
              titleStyle={{marginTop: 0, paddingVertical: 4, textAlign: 'center'}}
              title={post.title.toUpperCase()}
              titleVariant={"titleLarge"}
          />
          <Card.Content>
            <Text variant="bodyLarge">{post.description}</Text>
          </Card.Content>
          <Card.Content>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'

            }}>

              <View style={{justifyContent: 'space-evenly'}}>
                <Text variant={"bodyLarge"}>{t("deadline")}</Text>
                <Text variant={"bodyLarge"}>16:20h 25.11.2024</Text>

              </View>
              <View style={{alignItems: "flex-end"}}>
                <Text variant={"bodyLarge"}>{t("service")}</Text>
                <Text variant={"bodyLarge"}>{post.price} KM</Text>
                <Text variant={"bodyLarge"}>{t("plusAccompanyingCosts")}</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Content>
            <View style={{
              marginVertical: 12,
              backgroundColor: 'blue',
              height: 300,
              width: '100%'
            }}></View>
            <Text>{t("contact")} 065123456</Text>
          </Card.Content>
          <Card.Actions>
            {
              post.status === "OPEN" ? (
                  <Button
                      mode="contained-tonal"
                      onPress={() => showDialog()}
                      style={{width: '100%'}}
                      uppercase={true}
                  >{t("accept").toUpperCase()}</Button>
                ) : (
                  <Button
                      mode="contained-tonal"
                      style={{width: '100%'}}
                      uppercase={true}
                  >{post.status}</Button>
              )
            }

          </Card.Actions>
        </Card>

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
      </Container>
  )
}

export default PostTest;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    }
  })
}
