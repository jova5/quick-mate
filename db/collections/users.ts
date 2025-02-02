import firestore from '@react-native-firebase/firestore';

export interface CreateUserInterface {
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string | null | undefined,
  phoneNumber: string | null | undefined,
  notificationToken: string | null | undefined,
  cityId: string | null | undefined,
  photoURL: string | null | undefined,
  cityName: string | null | undefined
}

export interface UserInterface extends CreateUserInterface {
  id: string | null | undefined
}

const usersCollection = firestore().collection('users');

export async function addUser(id: string, user: CreateUserInterface) {

  const userDocRef = usersCollection.doc(id);

  return await userDocRef.set(user);
}

export async function getUser(docId: string): Promise<UserInterface | null> {

  const docRef = usersCollection.doc(docId);

  try {
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.error(`Document with ID ${docId} does not exist.`);
      return null;
    }

    const userData = docSnapshot.data();

    return {
      id: docSnapshot.id,
      firstName: userData?.firstName as string,
      lastName: userData?.lastName as string,
      email: userData?.email as string,
      phoneNumber: userData?.phoneNumber as string,
      notificationToken: userData?.notificationToken as string,
      cityId: userData?.cityId as string,
      photoURL: userData?.photoURL as string,
      cityName: userData?.cityName as string,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function checkUserByEmail(email: string): Promise<boolean> {
  try {
    const querySnapshot = await usersCollection.where('email', '==', email).get();

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error while checking user by email: ', error);
    return false;
  }
}

export async function updateUserPhoneNumberAndCityId(
    docId: string,
    phoneNumber: string,
    cityId: string,
    cityName: string
) {
  try {
    const userDocRef = usersCollection.doc(docId);

    await userDocRef.update({
      phoneNumber: phoneNumber,
      cityId: cityId,
      cityName: cityName,
    });
  } catch (error) {
    console.error('Error updating user phone number and city ID: ', error);
  }
}

export async function updateUserCity(docId: string, cityId: string, cityName: string) {
  try {
    const userDocRef = usersCollection.doc(docId);

    await userDocRef.update({
      cityId: cityId,
      cityName: cityName,
    });
  } catch (error) {
    console.error('Error updating user city: ', error);
  }
}

export async function updateUserNotificationToken(docId: string, notificationToken: string) {
  try {
    const userDocRef = usersCollection.doc(docId);

    await userDocRef.update({
      notificationToken: notificationToken,
    });
  } catch (error) {
    console.error('Error updating user notification token: ', error);
  }
}

export async function updateUserData(
    docId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
) {
  try {
    const userDocRef = usersCollection.doc(docId);

    await userDocRef.update({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
    });
  } catch (error) {
    console.error('Error updating user data: ', error);
  }
}
