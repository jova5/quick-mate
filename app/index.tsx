import React, {useEffect} from "react";
import LoginScreen from "@/app-screens/LoginScreen";
import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth";
import {
  selectUser,
  setIsLoggedIn,
  setIsLoggedUserLoading,
  setUserInfo,
  UserInfo
} from "@/redux/user-slice/userSlice";
import {createNotificationChannel} from "@/assets/scripts/rnFireBase";
import * as SplashScreen from "expo-splash-screen";
import {
  addUser,
  checkUserByEmail,
  CreateUserInterface,
  getUser,
  UserInterface
} from "@/db/collections/users";
import {useNavigation} from "expo-router";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {CommonActions} from "@react-navigation/native";

const LoginPage = () => {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const {isLoggedIn} = useAppSelector(selectUser);

  useEffect(() => {

    auth().onAuthStateChanged((currentUser) => {

      if (currentUser) {
        handleLoggedInUser(currentUser);
      } else {
        dispatch(setIsLoggedIn(false));
      }
    });

    createNotificationChannel();
  }, []);

  const handleLoggedInUser = async (currentUser: FirebaseAuthTypes.User | null) => {

    let userInfo;

    const exists = await checkUserByEmail(currentUser?.email!);

    if (!exists) {

      const displayedName = currentUser?.displayName?.split(' ');

      userInfo = {
        id: currentUser?.uid,
        firstName: displayedName === undefined ? "" : displayedName[0],
        lastName: displayedName === undefined ? "" : displayedName[1],
        email: currentUser?.email,
        phoneNumber: currentUser?.phoneNumber,
        notificationToken: null,
        cityId: null,
        photoURL: currentUser?.photoURL,
        cityName: null,
      }

      await addLoggedUser(currentUser?.uid!, userInfo);

      dispatch(setUserInfo(userInfo));
    } else {

      const loggedUser = await getLoggedUser(currentUser?.uid!);

      userInfo = {
        id: currentUser?.uid,
        firstName: loggedUser?.firstName,
        lastName: loggedUser?.lastName,
        email: loggedUser?.email,
        phoneNumber: loggedUser?.phoneNumber,
        notificationToken: loggedUser?.notificationToken,
        cityId: loggedUser?.cityId,
        photoURL: loggedUser?.photoURL,
        cityName: loggedUser?.cityName
      }

      dispatch(setUserInfo(userInfo));
    }

    dispatch(setIsLoggedIn(true));

    if (!exists
        || userInfo?.phoneNumber === null
        || userInfo?.phoneNumber === undefined
        || userInfo?.phoneNumber === "") {
      navigation.dispatch(CommonActions.reset({
        routes: [{key: "after-login-setup", name: "after-login-setup"}]
      }))
    } else {
      navigation.dispatch(CommonActions.reset({
        routes: [{key: "(tabs)", name: "(tabs)"}]
      }))
    }

    dispatch(setIsLoggedUserLoading(false));
  }

  async function getLoggedUser(id: string) {

    dispatch(setIsLoggedUserLoading(true));

    try {

      const user: UserInterface | null = await getUser(id);

      dispatch(setIsLoggedUserLoading(false));

      return user;
    } catch (e) {
      console.error("Error getting logged user: ", e);
      dispatch(setIsLoggedUserLoading(false));
    } finally {
      dispatch(setIsLoggedUserLoading(false));
    }
  }

  async function addLoggedUser(id: string, user: UserInfo) {

    try {
      const userData: CreateUserInterface = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        cityId: user.cityId,
        notificationToken: user.notificationToken,
        cityName: user.cityName
      };

      await addUser(id, userData);
    } catch (e) {
      console.error("Error adding logged user: ", e);
    }
  }

  if (isLoggedIn === false) {
    SplashScreen.hideAsync();
    return <LoginScreen/>
  }
}

export default LoginPage;
