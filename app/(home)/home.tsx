import {FlatList, Platform, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {Button, Card, MD3Theme, Text, useTheme} from "react-native-paper";
import {HOME_ITEMS} from "@/constants/HomeItems";

const HomeScreen = () => {

  const theme = useTheme();
  const styles = createStyles(theme);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return (
      <Container style={styles.container}>
        <FlatList
            data={HOME_ITEMS}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 12}}/>}
            renderItem={({item}) => (
            <Card
                onPress={() => {
            }}>
              <Card.Title
                  style={{marginTop: 0,  paddingTop: 0, width: '100%'}}
                  titleStyle={{ marginTop: 0, paddingVertical: 4,alignSelf: 'center'}}
                  title={item.title}
                  titleNumberOfLines={2}
              />
              <Card.Content>
                <Text variant="bodyMedium" numberOfLines={5}>{item.description}</Text>
              </Card.Content>
              <Card.Actions>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between'

                }}>

                  <View style={{justifyContent: 'space-evenly'}}>
                    <Text>Rok</Text>
                    <Text>16:20h 25.11.2024</Text>

                  </View>
                  <View style={{alignItems: "flex-end"}}>
                    <Text>Usluga</Text>
                    <Text>{item.price} KM</Text>
                    <Text>+ prateci troskovi</Text>
                  </View>
                </View>
              </Card.Actions>
              <Card.Actions>
                {/*<View style={{*/}
                {/*  flex: 1,*/}
                {/*  flexDirection: 'row',*/}
                {/*  justifyContent: 'space-between'*/}

                {/*}}>*/}

                {/*  <View style={{justifyContent: 'space-evenly'}}>*/}
                {/*    <Text>Rok</Text>*/}
                {/*    <Text>16:20h 25.11.2024</Text>*/}

                {/*  </View>*/}
                {/*  <View style={{alignItems: "flex-end"}}>*/}
                {/*    <Text>Usluga</Text>*/}
                {/*    <Text>{item.price} KM</Text>*/}
                {/*    <Text>+ prateci troskovi</Text>*/}
                {/*  </View>*/}
                {/*</View>*/}
                <Button
                    mode="contained-tonal"
                    onPress={() => {}}
                    style={{width: '100%'}}
                >Prihvati</Button>
              </Card.Actions>
            </Card>
        )}/>
      </Container>
  )
}

export default HomeScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 16
    }
  })
}
