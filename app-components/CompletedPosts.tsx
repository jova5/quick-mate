import {FlatList, RefreshControl, StyleSheet, View} from "react-native";
import {
  ActivityIndicator,
  Chip,
  MD3Theme,
  Surface,
  Text,
  TouchableRipple,
  useTheme
} from "react-native-paper";
import {useAppDispatch} from "@/redux/hooks";
import {showCompleteDialog} from "@/redux/post-slice/postSlice";
import {router} from "expo-router";
import {useTranslation} from "react-i18next";
import {getAllCompletedPostsByUserId, PostInterface} from "@/db/collections/posts";
import {useEffect, useState} from "react";
import {formatDate} from "@/assets/scripts/dateFormater";

const CompletedPosts = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const dispatch = useAppDispatch();

  const [completedPosts, setCompletedPosts] = useState<PostInterface[] | null>(null);
  const [arePostsLoading, setArePostsLoading] = useState<boolean>(false);

  async function getAllCompletedPosts(userId: string) {

    setArePostsLoading(true);
    setCompletedPosts(null);

    try {
      const posts: PostInterface[] = await getAllCompletedPostsByUserId(userId);

      setCompletedPosts(posts);
      setArePostsLoading(false);
    } catch (e) {
      console.log(e);
      setArePostsLoading(false);
    } finally {
      setArePostsLoading(false);
    }
  }

  useEffect(() => {
    getAllCompletedPosts("321");
  }, []);

  return (
      <View style={{flexDirection: 'column', flex: 1}}>
        <FlatList
            data={completedPosts}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, _) => `${item.id}`}

            contentContainerStyle={[(arePostsLoading || completedPosts === null || completedPosts?.length === 0) && {flex: 1}]}
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
                  progressBackgroundColor={theme.colors.surfaceVariant}
                  colors={[theme.colors.primary, theme.colors.primaryContainer]}
                  refreshing={arePostsLoading}
                  progressViewOffset={arePostsLoading ? -200 : 0}
                  onRefresh={() => getAllCompletedPosts("321")}
              />
            }

            renderItem={({item}) => (
                <TouchableRipple
                    key={`${item.id}`}
                    style={{margin: 8, marginHorizontal: 16, borderRadius: 16}}
                    onPress={() => router.push(`/posts/${item.id}`, {})}
                >
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
                        <Text variant={"bodyLarge"}>{t("deadline")}</Text>
                        <Text
                            variant={"bodyLarge"}> {formatDate(item.dueDateTime.toDate().toString())}</Text>
                      </View>
                      <View style={{alignItems: "flex-end"}}>
                        <Text variant={"bodyLarge"}>{t("service")}</Text>
                        <Text variant={"bodyLarge"}>{item.price} KM</Text>
                        {
                            item.cowerAdditionalCost
                            && <Text variant={"bodyLarge"}>{t("plusAdditionalCosts")}</Text>
                        }
                      </View>
                    </View>
                    {item.status === "IN_PROGRESS" ? (
                        <Chip
                            onPress={() => dispatch(showCompleteDialog())}
                            style={{width: '100%', justifyContent: 'center', alignSelf: 'center'}}
                            textStyle={{width: '100%', textAlign: 'center'}}
                        >{t(item.status).toUpperCase()}</Chip>
                    ) : (
                        <Chip
                            style={{width: '100%', justifyContent: 'center', alignSelf: 'center'}}
                            textStyle={{width: '100%', textAlign: 'center'}}
                        >{t(item.status).toUpperCase()}</Chip>
                    )}
                  </Surface>
                </TouchableRipple>
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
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 16
    },
  })
}
