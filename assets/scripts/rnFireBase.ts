import messaging from "@react-native-firebase/messaging";
import {PermissionsAndroid} from "react-native";
import * as Notifications from 'expo-notifications';

export const requestUserPermission = async () => {

  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
    }

    return enabled;
  } catch (e) {
    console.error("Error in requesting users permissions: ", e);
    return false
  }
};

export const createNotificationChannel = async () => {
  try {
    await Notifications.setNotificationChannelAsync("quick-mate-default", {
      name: "Quick Mate Default Channel",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  } catch (e) {
    console.error("Error creating notification channel: ", e);
  }
};

export const subscribeToTopic = async (topic: string) => {
  messaging()
  .subscribeToTopic(topic)
  .then(() => {
    console.log("Successfully subscribed to topic: ", topic)
  })
  .catch((e) => {
    console.error("Error subscribing to topic: ", e);
  });
};

export const unsubscribeFromTopic = async (topic: string) => {
  messaging()
  .unsubscribeFromTopic(topic)
  .then(() => {
    console.log("Successfully unsubscribed from topic: ", topic)
  })
  .catch((e) => {
    console.error("Error unsubscribing from topic: ", e);
  });
};
