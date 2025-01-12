import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "@firebase/firestore";
import db from "@/db/firestore";


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

const usersCollection = collection(db, 'users')

export async function addUser(id: string, user: CreateUserInterface) {

  const userDocRef = doc(usersCollection, id);

  return await setDoc(userDocRef, user);
}

export async function getUser(docId: string): Promise<UserInterface | null> {

  const docRef = doc(usersCollection, docId);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    console.error(`Document with ID ${docId} does not exist.`);
    return null;
  }

  const userData = docSnapshot.data();

  return {
    id: docSnapshot.id,
    firstName: userData.firstName as string,
    lastName: userData.lastName as string,
    email: userData.email as string,
    phoneNumber: userData.phoneNumber as string,
    notificationToken: userData.notificationToken as string,
    cityId: userData.cityId as string,
    photoURL: userData.photoURL as string,
    cityName: userData.cityName as string,
  };
}

export async function checkUserByEmail(email: string) {

  try {
    const users = query(
        usersCollection,
        where('email', '==', email)
    );

    const querySnapshot = await getDocs(users);

    if (querySnapshot.empty) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Greška pri provjeri korisnika:', error);
    return false;
  }
}

export async function updateUserPhoneNumberAndCityId(docId: string, phoneNumber: string, cityId: string, cityName: string) {

  const userDocRef = doc(usersCollection, docId);

  return await updateDoc(userDocRef, {phoneNumber: phoneNumber, cityId: cityId, cityName: cityName})
}

export async function updateUserCity(docId: string, cityId: string, cityName: string) {

  const userDocRef = doc(usersCollection, docId);

  return await updateDoc(userDocRef, {cityId: cityId, cityName: cityName})
}

export async function updateUserNotificationToken(docId: string, notificationToken: string) {

  const userDocRef = doc(usersCollection, docId);

  return await updateDoc(userDocRef, {notificationToken: notificationToken})
}
