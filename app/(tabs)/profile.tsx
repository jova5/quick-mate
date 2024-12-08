import {Platform, ScrollView, StyleSheet, View} from "react-native";
import {
  Avatar,
  Button,
  Dialog, IconButton,
  MD3Theme, Modal,
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

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [value, setValue] = useState('in-progress-posts');
  const dispatch = useAppDispatch();
  const {isCompleteDialogShowing} = useAppSelector(selectPost)
  const hideDialog = () => dispatch(hideCompleteDialog());
  const [isLanguageModalShowing, setLanguageModalShowing] = useState(false);
  const hideLanguageModal = () => setLanguageModalShowing(false);
  const showLanguageModal = () => setLanguageModalShowing(true);

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return (
      <View style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: 16
      }}>
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
              console.log('tests')
              router.push('/city', {})
            }}>Test</Button>
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
                label: 'In progress',
              },
              {
                value: 'posts',
                label: 'Your posts',
              },
              {value: 'completed-posts', label: 'Completed'},
            ]}
        />
        <Container style={styles.container}>
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
        </Container>

        <Portal>
          <Dialog visible={isCompleteDialogShowing} onDismiss={hideDialog}>
            <Dialog.Title>Potvrda</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Potvrdite kompletiranje sledeceg zadatka:</Text>
            </Dialog.Content>
            <Dialog.Content>
              <Text variant="bodyMedium">Nazvi posla</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>ACCPET</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={isLanguageModalShowing} onDismiss={hideLanguageModal}>
            <Dialog.Title>Izaberite jezik</Dialog.Title>
            <Dialog.Actions
                style={{
                  padding: 4,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
              <Button style={{flex: 1}} mode={'outlined'} onPress={hideLanguageModal}>Srpski</Button>
            </Dialog.Actions>
            <Dialog.Actions
                style={{
                  padding: 4,
                  justifyContent: 'center',
                  alignContent: 'center'
                }}>
              <Button style={{flex: 1}} mode={'outlined'} onPress={hideLanguageModal}>Engleski</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>

  )
};

export default ProfileScreen;

const createStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      marginTop: 4,
      borderRadius: 16
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
