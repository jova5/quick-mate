import {Platform, ScrollView, StyleSheet, View} from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  IconButton,
  MD3Theme,
  Portal,
  SegmentedButtons,
  Text,
  TouchableRipple,
  useTheme
} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState} from "react";
import InProgressPosts from "@/app/profile-components/InProgressPosts";
import YourPosts from "@/app/profile-components/YourPosts";
import CompletedPosts from "@/app/profile-components/CompletedPosts";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {hideCompleteDialog, selectPost} from "@/redux/post-slice/postSlice";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import {useTranslation} from "react-i18next";
import {changeI18NLanguage} from "@/assets/localization/i18n";
import {selectUser} from "@/redux/user-slice/userSlice";
import {completePost} from "@/db/collections/posts";

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const [value, setValue] = useState('in-progress-posts');
  const [isLanguageModalShowing, setIsLanguageModalShowing] = useState(false);
  const [isPostCompleting, setIsPostCompleting] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {isCompleteDialogShowing, postForCompletionId, postForCompletionTitle} = useAppSelector(selectPost)
  const {user} = useAppSelector(selectUser);

  const hideDialog = () => dispatch(hideCompleteDialog());
  const hideLanguageModal = () => setIsLanguageModalShowing(false);
  const showLanguageModal = () => setIsLanguageModalShowing(true);

  const changeLanguageLocalization = (languageCode: "rs" | "en") => {

    changeI18NLanguage(languageCode);

    hideLanguageModal();
  }

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  async function completeSelectedPost(docId: string) {

    setIsPostCompleting(true);

    try {
      await completePost(docId);
      setIsPostCompleting(false);
      hideDialog()
    } catch (e) {
      console.log(e);
      setIsPostCompleting(false);
      hideDialog()
    } finally {
      setIsPostCompleting(false);
      hideDialog()
    }
  }

  return (
      <Container style={styles.container}>
        <View style={
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}>
          <TouchableRipple
              onPress={() => router.navigate("/profile-info")}
              rippleColor="rgba(0, 0, 0, .32)"
          >
            <Avatar.Image source={{ uri: user!.photoURL! }} size={40}/>
          </TouchableRipple>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Button mode='outlined' onPress={() => {
              router.push('/city', {})
            }}>{t("city")}</Button>
            <IconButton
                onPress={showLanguageModal}
                icon={({size, color}) => {
                  return <Icon name="language" size={size} color={color}/>
                }}
            />
          </View>
        </View>
        <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={[
              {
                value: 'in-progress-posts',
                label: t("inProgress"),
              },
              {
                value: 'posts',
                label: t("yourPosts"),
              },
              {
                value: 'completed-posts',
                label: t("completed")
              },
            ]}
        />
        <View style={{
          backgroundColor: theme.colors.background,
          flex: 1
        }}>
          {(() => {
            switch (value) {
              case 'in-progress-posts':
                return <InProgressPosts/>;
              case 'posts':
                return <YourPosts/>;
              case 'completed-posts':
                return <CompletedPosts/>;
              default:
                return null; // Or a fallback component/message
            }
          })()}
        </View>

        <Portal>
          <Dialog visible={isCompleteDialogShowing} onDismiss={hideDialog}>
            <Dialog.Title>{t("confirmation")}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{t("confirmCompletion")}</Text>
            </Dialog.Content>
            <Dialog.Content>
              <Text variant="bodyMedium">{postForCompletionTitle}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                  loading={isPostCompleting}
                  onPress={() => completeSelectedPost(postForCompletionId!)}
              >{t("confirm").toUpperCase()}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={isLanguageModalShowing} onDismiss={hideLanguageModal}>
            <Dialog.Title>{t("chooseLanguage")}</Dialog.Title>
            <Dialog.Actions
                style={{
                  padding: 4,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
              <Button
                  style={{flex: 1}}
                  mode={'outlined'}
                  onPress={() => changeLanguageLocalization("rs")}>
                {t("serbian")}</Button>
            </Dialog.Actions>
            <Dialog.Actions
                style={{
                  padding: 4,
                  justifyContent: 'center',
                  alignContent: 'center'
                }}>
              <Button
                  style={{flex: 1}}
                  mode={'outlined'}
                  onPress={() => changeLanguageLocalization("en")}>
                {t("english")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Container>
  )
};

export default ProfileScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      flex: 1
    },
    surface: {
      padding: 8,
      margin: 8,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 16
    },
  })
}
