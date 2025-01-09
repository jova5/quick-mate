import {Linking, Platform, StyleSheet, View} from "react-native";
import {Button, Card, Dialog, MD3Theme, Portal, Text, useTheme} from "react-native-paper";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {acceptPost, completePost, GeoLocation, PostInterface} from "@/db/collections/posts";
import {formatDate} from "@/assets/functions/dateFormater";
import {router} from "expo-router";
import {useAppSelector} from "@/redux/hooks";
import {selectUser} from "@/redux/user-slice/userSlice";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";

const Post = ({post, mode}:{post: PostInterface, mode: string | undefined | string[]}) => {

  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const {user} = useAppSelector(selectUser);

  const [visible, setVisible] = useState(false);
  const [isPostAccepting, setIsPostAccepting] = useState<boolean>(false);
  const [isPostCompleting, setIsPostCompleting] = useState<boolean>(false);
  const [isCompleteDialogShowing, setIsCompleteDialogShowing] = useState<boolean>(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  async function acceptSelectedPost(docId: string, workerUserId: string) {

    setIsPostAccepting(true);

    try {
      await acceptPost(docId, workerUserId);
      setIsPostAccepting(false);
      hideDialog()
      router.back();
    } catch (e) {
      console.log(e);
      setIsPostAccepting(false);
      hideDialog()
    } finally {
      setIsPostAccepting(false);
      hideDialog()
    }
  }

  async function completeSelectedPost(docId: string) {

    setIsPostCompleting(true);

    try {
      await completePost(docId);
      setIsPostCompleting(false);
      setIsCompleteDialogShowing(false);
    } catch (e) {
      console.log(e);
      setIsPostCompleting(false);
      setIsCompleteDialogShowing(false);
    } finally {
      setIsPostCompleting(false);
      setIsCompleteDialogShowing(false);
    }
  }

  const openGoogleMaps = (destination: GeoLocation) => {

    // Create the URL to open Google Maps
    const url = Platform.select({
      ios: `comgooglemaps://?q=${destination.latitude},${destination.longitude}`, // URL for iOS
      android: `geo:${destination.latitude},${destination.longitude}?q=${destination.latitude},${destination.longitude}` // URL for Android
    });

    // Open the map using Linking API
    if (typeof url === "string") {
      Linking.openURL(url).catch(err => console.error('Error opening map:', err));
    }
  };

  return (
      <View style={styles.container}>
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
          <Card.Actions>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'

            }}>

              <View style={{justifyContent: 'space-evenly'}}>
                <Text variant={"bodyLarge"}>{t("deadline")}</Text>
                <Text variant={"bodyLarge"}>
                  {formatDate(post.dueDateTime.toDate().toString())}
                </Text>

              </View>
              <View style={{alignItems: "flex-end"}}>
                <Text variant={"bodyLarge"}>{t("service")}</Text>
                <Text variant={"bodyLarge"}>{post.price} KM</Text>
                <Text variant={"bodyLarge"}>{t("plusAdditionalCosts")}</Text>
              </View>
            </View>
          </Card.Actions>
          <Card.Content>
            <View style={{
              marginVertical: 12,
              height: 300,
              width: '100%'
            }}>
              <MapView
                  onPress={() => openGoogleMaps(post.destination)}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude: 43.9,
                    longitude: 17.7,
                    latitudeDelta: 2.8,
                    longitudeDelta: 2.8,
                  }}
              >
                {post.destination.longitude !== null && (
                    <Marker
                        coordinate={
                          {
                            latitude: post.destination.latitude,
                            longitude: post.destination.longitude
                          }
                        }
                    />
                )}
              </MapView>
            </View>
            <Text>{t("contact")} {post.contactPhoneNumber}</Text>
          </Card.Content>
          <Card.Actions>
            {
              post.status === "OPEN" ? (
                  <Button
                      disabled={post.createdBy === user!.id}
                      mode="contained-tonal"
                      onPress={() => showDialog()}
                      style={{width: '100%'}}
                      uppercase={true}
                  >{t("accept")}</Button>
                ) : (
                  <Button
                      disabled={mode === undefined || mode !== "IN_PROGRESS"}
                      mode="contained-tonal"
                      style={{width: '100%'}}
                      uppercase={true}
                      onPress={() => setIsCompleteDialogShowing(true)}
                  >{t(post.status)}</Button>
              )
            }

          </Card.Actions>
        </Card>

        <Portal>
          <Dialog visible={isCompleteDialogShowing} onDismiss={() => setIsCompleteDialogShowing(false)}>
            <Dialog.Title>{t("confirmation")}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{t("confirmCompletion")}</Text>
            </Dialog.Content>
            <Dialog.Content>
              <Text variant="bodyMedium">{post.title}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                  loading={isPostCompleting}
                  onPress={() => completeSelectedPost(post.id)}
              >{t("confirm").toUpperCase()}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

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
              <Button
                  loading={isPostAccepting}
                  onPress={() => acceptSelectedPost(post.id, "qwe")}
              >{t("accept").toUpperCase()}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
  )
}

export default Post;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  })
}
