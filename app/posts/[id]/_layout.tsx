import {useLocalSearchParams, useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, MD3Theme, useTheme} from "react-native-paper";
import {Platform, ScrollView, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch} from "@/redux/hooks";
import {setExistingPostLoading, setExistingPostNotLoading} from "@/redux/post-slice/postSlice";
import Post from "@/app/posts/[id]/PostScreen";
import {getPost, PostInterface} from "@/db/collections/posts";

const Layout = () => {
  const params = useLocalSearchParams();
  const {id, mode} = params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<any>(undefined);

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  async function getExistingPost(id: string) {

    dispatch(setExistingPostLoading());

    try {
      const post: PostInterface | null = await getPost(id);

      console.log("post");
      console.log(post);
      navigation.setOptions({title: post?.title});

      setIsLoading(false);
      setPost(post);
      dispatch(setExistingPostNotLoading());
    } catch (e) {
      console.log(e);
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
      <Post post={post} mode={mode}/>
  )
}

export default Layout;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      flex: 1,
    }
  })
}
