import messaging from "@react-native-firebase/messaging";
import {useEffect} from "react";
import {requestUserPermission} from "@/scripts/rnFireBase";
import {useAppSelector} from "@/redux/hooks";
import {selectUser} from "@/redux/user-slice/userSlice";
import {updateUserNotificationToken} from "@/db/collections/users";


const RemotePushController = () => {

  const {user} = useAppSelector(selectUser);

  async function onMessageReceived(message: any) {
    console.log("Notification received");
    console.log(message);
    console.log(message.data);
  }

  try {

    //onMessage: Handles FCM messages when the application is alive/in the foreground.
    messaging().onMessage(onMessageReceived);
    //setBackgroundMessageHandler: Handles FCM messages when the app is in a killed state.
    messaging().setBackgroundMessageHandler(onMessageReceived);

  } catch (e) {
    console.log(e)
  }

  useEffect(() => {

    if (user !== undefined) {
      requestUserPermission().then(enabled => {
        if (enabled) {
          messaging()
          .getToken()
          .then(
              token => updateUserNotificationToken(user?.id!, token)
          );
        }
      })
    }

  }, [user]);

  return null;
};

export default RemotePushController;
