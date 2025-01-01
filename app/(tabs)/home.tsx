import {FlatList, Platform, RefreshControl, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  FAB,
  MD3Theme,
  Portal,
  Text,
  useTheme
} from "react-native-paper";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {acceptPost, getAllOpenPostsByCityId, PostInterface} from "@/db/collections/posts";
import {formatDate} from "@/assets/functions/dateFormater";

const HomeScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;


  const [availablePosts, setAvailablePosts] = useState<PostInterface[] | null>(null);

  const [visible, setVisible] = useState(false);
  const [isPostAccepting, setIsPostAccepting] = useState<boolean>(false);
  const [arePostsLoading, setArePostsLoading] = useState<boolean>(false);
  const [selectedPostForAccepting, setSelectedPostForAccepting] = useState<PostInterface | null>(null);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  async function acceptSelectedPost(docId: string, workerUserId: string) {

    setIsPostAccepting(true);

    try {
      await acceptPost(docId, workerUserId);
      setIsPostAccepting(false);
      hideDialog()
      getAllOpenPosts("123");
    } catch (e) {
      console.log(e);
      setIsPostAccepting(false);
      hideDialog()
    } finally {
      setIsPostAccepting(false);
      hideDialog()
    }
  }

  async function getAllOpenPosts(cityId: string) {

    setArePostsLoading(true);
    setAvailablePosts(null);

    try {
      const result = await getAllOpenPostsByCityId(cityId);
      const posts: PostInterface[] = result.docs.map((d): PostInterface => ({
        ...d.data() as PostInterface,
        id: d.id
      }))
      setAvailablePosts(posts);
      setArePostsLoading(false);
    } catch (e) {
      console.log(e);
      setArePostsLoading(false);
    } finally {
      setArePostsLoading(false);
    }
  }

  useEffect(() => {
    getAllOpenPosts("123");
  }, []);

  return (
      <View style={{flex: 1}}>
        <Container style={styles.container}>
          <FlatList
              data={availablePosts}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, _) => `${item.id}`}

              contentContainerStyle={{flex: 1}}
              ListEmptyComponent={() => {
                if (arePostsLoading) {
                  return <ActivityIndicator style={{flex: 1}} size="large" animating={true}/>
                }
                return <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
                  <Text style={{textAlign: 'center'}}>{t("thereAreNoPosts")}</Text>
                </View>;
              }}

              refreshControl={
                <RefreshControl
                    colors={[theme.colors.primary, theme.colors.primaryContainer]}
                    refreshing={arePostsLoading}
                    progressViewOffset={arePostsLoading ? -200 : 0}
                    onRefresh={() => getAllOpenPosts("123")}
                />
              }

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
                          <Text variant={"bodyLarge"}>
                            {formatDate(item.dueDateTime.toDate().toString())}
                          </Text>
                        </View>
                        <View style={{alignItems: "flex-end"}}>
                          <Text variant={"bodyLarge"}>{t("service")}</Text>
                          <Text variant={"bodyLarge"}>{item.price} KM</Text>
                          <Text variant={"bodyLarge"}>{t("plusAdditionalCost")}</Text>
                        </View>
                      </View>
                    </Card.Actions>
                    <Card.Actions>
                      <Button
                          mode="contained-tonal"
                          onPress={() => {
                            setSelectedPostForAccepting(item);
                            showDialog()
                          }}
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
              <Text variant="bodyMedium">{selectedPostForAccepting?.title}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                  loading={isPostAccepting}
                  onPress={() => acceptSelectedPost(selectedPostForAccepting?.id!, "qwe")}
              >{t("accept").toUpperCase()}</Button>
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
