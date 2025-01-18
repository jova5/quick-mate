import {useLocalSearchParams, useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, MD3Theme, useTheme} from "react-native-paper";
import {Platform, ScrollView, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch} from "@/redux/hooks";
import {setExistingPostLoading, setExistingPostNotLoading} from "@/redux/post-slice/postSlice";
import {getPost, PostInterface} from "@/db/collections/posts";
import EditPostScreen from "@/app-screens/EditPostScreen";
import {useTranslation} from "react-i18next";

const EditPostPage = () => {

  const params = useLocalSearchParams();
  const {id} = params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<any>(undefined);
  const {t} = useTranslation();

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  async function getExistingPost(id: string) {

    dispatch(setExistingPostLoading());

    try {
      const post: PostInterface | null = await getPost(id);

      navigation.setOptions({title: `${t('editPost')}: ${post?.title}`});

      setPost(post);

      dispatch(setExistingPostNotLoading());
      setIsLoading(false);
    } catch (e) {
      console.error("Error getting info about existing post: ", e);
      setIsLoading(false);
      dispatch(setExistingPostNotLoading());
    } finally {
      setIsLoading(false);
      dispatch(setExistingPostNotLoading());
    }
  }

  useEffect(() => {
    getExistingPost(id as string);
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
      <EditPostScreen post={post}/>
  )
}

export default EditPostPage;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      flex: 1,
    }
  })
}
