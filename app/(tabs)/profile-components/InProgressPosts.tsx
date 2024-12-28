import {FlatList, StyleSheet, View} from "react-native";
import {HOME_ITEMS} from "@/constants/HomeItems";
import {Chip, MD3Theme, Surface, Text, TouchableRipple, useTheme} from "react-native-paper";
import {useAppDispatch} from "@/redux/hooks";
import {showCompleteDialog} from "@/redux/post-slice/postSlice";
import {router} from "expo-router";
import {useTranslation} from "react-i18next";

const InProgressPosts = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const dispatch = useAppDispatch();

  return (
      <View style={{flexDirection: 'column', flex: 1}}>
        <FlatList
            data={HOME_ITEMS.filter(item => item.status === "IN_PROGRESS")}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, _) => `${item.id}`}
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
                    }}>
                      <View style={{justifyContent: 'space-evenly'}}>
                        <Text variant={"bodyLarge"}>{t("deadline")}</Text>
                        <Text variant={"bodyLarge"}>16:20h 25.11.2024</Text>
                      </View>
                      <View style={{alignItems: "flex-end", justifyContent: 'space-evenly'}}>
                        <Text variant={"bodyLarge"}>{t("service")}</Text>
                        <Text variant={"bodyLarge"}>{item.price} KM</Text>
                        <Text variant={"bodyLarge"}>{t("plusAdditionalCost")}</Text>
                      </View>
                    </View>
                    {item.status === "IN_PROGRESS" ? (
                        <Chip
                            onPress={() => dispatch(showCompleteDialog())}
                            style={{width: '100%', justifyContent: 'center', alignSelf: 'center'}}
                            textStyle={{width: '100%', textAlign: 'center'}}
                        >{t(item.status).toUpperCase()}</Chip>
                    ):(
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

export default InProgressPosts;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    surface: {
      padding: 8,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 16
    },
  })
}
