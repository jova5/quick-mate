import {Platform, ScrollView, StyleSheet, View} from "react-native";
import {MD3Theme, SegmentedButtons, useTheme} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {useState} from "react";
import InProgressPosts from "@/app/(tabs)/profile-components/InProgressPosts";
import YourPosts from "@/app/(tabs)/profile-components/YourPosts";
import CompletedPosts from "@/app/(tabs)/profile-components/CompletedPosts";

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [value, setValue] = useState('in-progress-posts');

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;

  return (
      <View style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: 16
      }}>
        <View style={{height: 60}}></View>
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
                return <InProgressPosts />;
              case 'posts':
                return <YourPosts />;
              case 'completed-posts':
                return <CompletedPosts />;
              default:
                return null; // Or a fallback component/message
            }
          })()}
        </Container>
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
