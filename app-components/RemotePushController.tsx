import messaging from "@react-native-firebase/messaging";
import {useEffect} from "react";
import {requestUserPermission, subscribeToTopic} from "@/scripts/rnFireBase";
import {useAppSelector} from "@/redux/hooks";
import {selectUser} from "@/redux/user-slice/userSlice";
import {updateUserNotificationToken} from "@/db/collections/users";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";
import {replacePlaceholder} from "@/assets/functions/replacePlaceholder";
import * as Notifications from 'expo-notifications';

const RemotePushController = () => {

  const {user} = useAppSelector(selectUser);
  const {t} = useTranslation();

  // Display a notification using expo notifications
  const displayNotification = async (message: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t(message.data?.title) || "Notification",
        body: replacePlaceholder(message.data?.body, t) || "New post in your city.",
        data: message.data,  // Attach the data to be used when the notification is clicked
      },
      trigger: null, // This immediately triggers the notification
    });
  };

// Handle notification press actions
  const handleNotificationPress = (postId: string) => {
    if (postId) {
      console.log(`Navigating to post: ${postId}`);
      router.push(`/posts/${postId}`, {}) // Adjust the route name as per your app
    }
  };

  // Handle foreground events
  const handleForegroundNotification = async () => {
    Notifications.addNotificationReceivedListener(({ request }) => {
      const { data } = request.content;
      if (data?.postId) {
        handleNotificationPress(data.postId);
      }
    });

    Notifications.addNotificationResponseReceivedListener(({ notification }) => {
      const data = notification.request.content.data;
      if (data?.postId) {
        handleNotificationPress(data.postId);
      }
    });
  };

  useEffect(() => {
    const setupFCM = async () => {
      try {
        // Request notification permissions
        const enabled = await requestUserPermission();

        if (enabled) {

          // Get FCM token
          const token = await messaging().getToken();

          if (user?.id && token) {
            // Update the user's notification token in the backend
            await updateUserNotificationToken(user.id, token);
          }

          // Handle foreground notifications
          const unsubscribeOnMessage = messaging().onMessage(async (message) => {
            console.log("Notification received in foreground:", message);
            // await displayNotification(message);
          });

          // Handle background/killed state notifications
          messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log("Notification received in background:", remoteMessage);
            await displayNotification(remoteMessage);
          });

          // Handle notification press in foreground
          await handleForegroundNotification();

          // Handle notification press when app is opened via notification
          const unsubscribeOnNotificationOpenedApp =
              messaging().onNotificationOpenedApp((remoteMessage) => {
                if (remoteMessage?.data?.postId) {
                  handleNotificationPress(remoteMessage.data.postId as string);
                }
              });

          // Check if the app was opened via a notification when killed
          const initialNotification = await messaging().getInitialNotification();
          if (initialNotification?.data?.postId) {
            handleNotificationPress(initialNotification.data.postId as string);
          }

          if (user?.cityId) {
            await subscribeToTopic(user.cityId);
          }

          // Cleanup listeners on unmount
          return () => {
            unsubscribeOnMessage();
            unsubscribeOnNotificationOpenedApp();
          };
        } else {
          console.log("Notifications not enabled by user.");
        }
      } catch (e) {
        console.error("Error setting up FCM:", e);
      }
    };

    if (user) {
      setupFCM();
    }
  }, [user]);

  return null;
};

export default RemotePushController;
