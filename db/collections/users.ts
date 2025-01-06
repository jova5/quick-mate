import {collection, doc, getDoc, getDocs, query, setDoc, where} from "@firebase/firestore";
import db from "@/db/firestore";


export interface CreateUserInterface {
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string | null | undefined,
  phoneNumber: string | null | undefined,
  notifyPhoneId: string | null | undefined,
  cityId: string | null | undefined,
  photoURL: string | null | undefined
}

export interface UserInterface extends CreateUserInterface {
  id: string | null | undefined
}

const usersCollection = collection(db, 'users')

export async function addUser(id: string, user: CreateUserInterface) {

  const userDocRef = doc(usersCollection, id);

  return await setDoc(userDocRef, user);
}
// ISKORISTITI ZA AZURIRANJE KORISNIKA
// export async function acceptPost(docId: string, workerUserId: string) {
//
//   const docRef = doc(postsCollection, docId);
//
//   const userDocRef = doc(usersCollection, id);
//   await setDoc(userDocRef, user);
//
//   return await updateDoc(docRef, {workerUserId: workerUserId, status: PostStatus.IN_PROGRESS})
// }

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
    notifyPhoneId: userData.notifyPhoneId as string,
    cityId: userData.cityId as string,
    photoURL: userData.photoURL as string,
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
