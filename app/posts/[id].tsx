import {router, Stack, useLocalSearchParams, useNavigation} from "expo-router";
import {Platform, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";

const PostTest = () => {
  const params = useLocalSearchParams();
  const {id, other} = params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState(undefined);

  const theme = useTheme();
  const styles = createStyles(theme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate some data
      const post = HOME_ITEMS.find(item => item.id.toString() === id)

      navigation.setOptions({title: post?.title});
      setPost(post);
    }, 5000); // 5 seconds

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
              titleStyle={{marginTop: 0, paddingVertical: 4, alignSelf: 'center'}}
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
                <Text variant={"bodyLarge"}>Rok</Text>
                <Text variant={"bodyLarge"}>16:20h 25.11.2024</Text>

              </View>
              <View style={{alignItems: "flex-end"}}>
                <Text variant={"bodyLarge"}>Usluga</Text>
                <Text variant={"bodyLarge"}>{post.price} KM</Text>
                <Text variant={"bodyLarge"}>+ prateci troskovi</Text>
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
            <Text>Contact: </Text>
          </Card.Content>
          <Card.Actions>
            <Button
                mode="contained-tonal"
                onPress={() => {
                }}
                style={{width: '100%'}}
                uppercase={true}
            >prihvati</Button>
          </Card.Actions>
        </Card>
      </Container>
  )
}

import {ActivityIndicator, Button, Card, MD3Theme, Text, useTheme} from "react-native-paper";
import {useEffect, useState} from "react";
import {HOME_ITEMS} from "@/constants/HomeItems";

export default PostTest;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    }
  })
}
