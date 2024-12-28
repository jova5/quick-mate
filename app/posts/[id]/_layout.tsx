import {useLocalSearchParams, useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, MD3Theme, useTheme} from "react-native-paper";
import {Platform, ScrollView, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {HOME_ITEMS} from "@/constants/HomeItems";
import {useAppDispatch} from "@/redux/hooks";
import {setExistingPostLoading, setExistingPostNotLoading} from "@/redux/post-slice/postSlice";
import Post from "@/app/posts/[id]/PostScreen";

const Layout = () => {
  const params = useLocalSearchParams();
  const {id, other} = params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<any>(undefined);

  const theme = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  useEffect(() => {

    dispatch(setExistingPostLoading());

    const timer = setTimeout(() => {
      setIsLoading(false);

      // Simulate some data
      const post = HOME_ITEMS.find(item => item.id.toString() === id)
      navigation.setOptions({title: post?.title});

      setPost(post);
      dispatch(setExistingPostNotLoading());
    }, 1000); // 5 seconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
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
      <Post post={post}/>
  )
}

export default Layout;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    }
  })
}
