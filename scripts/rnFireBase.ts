import messaging from "@react-native-firebase/messaging";
import {PermissionsAndroid} from "react-native";

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
    console.log(e)
    return false
  }
};

export const subscribeToTopic = async (topic: string) => {
  messaging()
  .subscribeToTopic(topic)
  .then(() => {})
  .catch((e) => {
    console.log(e);
  });
};

export const unsubscribeFromTopic = async (topic: string) => {
  messaging()
  .unsubscribeFromTopic(topic)
  .then(() => {})
  .catch((e) => {
    console.log(e);
  });
};
