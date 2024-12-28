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
  useTheme
} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {useState} from "react";
import InProgressPosts from "@/app/(tabs)/profile-components/InProgressPosts";
import YourPosts from "@/app/(tabs)/profile-components/YourPosts";
import CompletedPosts from "@/app/(tabs)/profile-components/CompletedPosts";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {hideCompleteDialog, selectPost} from "@/redux/post-slice/postSlice";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const saveLanguageData = async (languageCode: "rs" | "en") => {
  try {
    await AsyncStorage.setItem('LANGUAGE', languageCode);
  } catch {
    console.log('err in saving language data');
  }
};

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const [value, setValue] = useState('in-progress-posts');
  const dispatch = useAppDispatch();
  const {isCompleteDialogShowing} = useAppSelector(selectPost)
  const hideDialog = () => dispatch(hideCompleteDialog());
  const [isLanguageModalShowing, setLanguageModalShowing] = useState(false);
  const hideLanguageModal = () => setLanguageModalShowing(false);
  const showLanguageModal = () => setLanguageModalShowing(true);

  const changeLanguageLocalization = (languageCode: "rs" | "en") => {

    i18next.changeLanguage(languageCode);// it will change the language through out the app.
    saveLanguageData(languageCode);

    hideLanguageModal();
  }

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return (
      <Container style={styles.container}>
        <View style={
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}>
          <Avatar.Text size={40} label="XD"/>
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
              <Text variant="bodyMedium">{t("jobTitle")}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>{t("accept").toUpperCase()}</Button>
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
