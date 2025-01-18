import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where
} from "@firebase/firestore";
import db from "@/db/firestore";

export enum PostStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export interface GeoLocation {
  latitude: number,
  longitude: number
}

export interface CreatePostInterface {
  title: string,
  description: string,
  price: number,
  dueDateTime: Timestamp,
  destination: GeoLocation,
  contactPhoneNumber: string,
  cityId: string,
  status: PostStatus,
  createdBy: string,
  workerUserId: string,
  cowerAdditionalCost: boolean,
  address: string,
  cityName: string,
}

export interface PostInterface extends CreatePostInterface {
  id: string
}

const postsCollection = collection(db, 'posts')

export async function addPost(post: CreatePostInterface) {

  const dbData = {
    createdAt: Timestamp.now(),
    ...post
  }

  return await addDoc(postsCollection, dbData);
}

export async function acceptPost(docId: string, workerUserId: string) {

  const docRef = doc(postsCollection, docId);

  return await updateDoc(docRef, {workerUserId: workerUserId, status: PostStatus.IN_PROGRESS})
}

export async function getAllOpenPostsByCityId(cityId: string) {

  const posts = query(
      postsCollection,
      where("cityId", "==", cityId),
      where("status", "==", PostStatus.OPEN)
  );

  return await getDocs(posts);
}

export async function getAllCompletedPostsByUserId(userId: string): Promise<PostInterface[]> {

  const posts = query(
      postsCollection,
      where("workerUserId", "==", userId),
      where("status", "==", PostStatus.COMPLETED)
  );

  const t = await getDocs(posts);
  return t.docs.map(doc => {
    return {
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      price: doc.data().price,
      dueDateTime: doc.data().dueDateTime,
      destination: doc.data().destination as GeoLocation,
      contactPhoneNumber: doc.data().contactPhoneNumber,
      cityId: doc.data().cityId,
      status: doc.data().status as PostStatus,
      createdBy: doc.data().createdBy,
      workerUserId: doc.data().workerUserId,
      cowerAdditionalCost: doc.data().cowerAdditionalCost,
      address: doc.data().address,
      cityName: doc.data().cityName,
    }
  });
}

export async function getAllInProgressPostsByUserId(userId: string): Promise<PostInterface[]> {

  const posts = query(
      postsCollection,
      where("workerUserId", "==", userId),
      where("status", "==", PostStatus.IN_PROGRESS)
  );

  const t = await getDocs(posts);
  return t.docs.map(doc => {
    return {
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      price: doc.data().price,
      dueDateTime: doc.data().dueDateTime,
      destination: doc.data().destination as GeoLocation,
      contactPhoneNumber: doc.data().contactPhoneNumber,
      cityId: doc.data().cityId,
      status: doc.data().status as PostStatus,
      createdBy: doc.data().createdBy,
      workerUserId: doc.data().workerUserId,
      cowerAdditionalCost: doc.data().cowerAdditionalCost,
      address: doc.data().address,
      cityName: doc.data().cityName,
    }
  });
}

export async function getAllUserPostsByUserId(userId: string): Promise<PostInterface[]> {

  const posts = query(
      postsCollection,
      where("createdBy", "==", userId)
  );

  const t = await getDocs(posts);
  return t.docs.map(doc => {
    return {
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      price: doc.data().price,
      dueDateTime: doc.data().dueDateTime,
      destination: doc.data().destination as GeoLocation,
      contactPhoneNumber: doc.data().contactPhoneNumber,
      cityId: doc.data().cityId,
      status: doc.data().status as PostStatus,
      createdBy: doc.data().createdBy,
      workerUserId: doc.data().workerUserId,
      cowerAdditionalCost: doc.data().cowerAdditionalCost,
      address: doc.data().address,
      cityName: doc.data().cityName,
    }
  });
}

export async function getPost(docId: string): Promise<PostInterface | null> {

  const docRef = doc(postsCollection, docId);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    console.error(`Document with ID ${docId} does not exist.`);
    return null;
  }

  const postData = docSnapshot.data();

  return {
    id: docSnapshot.id,
    title: postData.title as string,
    description: postData.description as string,
    price: postData.price as number,
    dueDateTime: postData.dueDateTime as Timestamp,
    destination: {
      latitude: postData.destination.latitude as number,
      longitude: postData.destination.longitude as number,
    } as GeoLocation,
    contactPhoneNumber: postData.contactPhoneNumber as string,
    cityId: postData.cityId as string,
    status: postData.status as PostStatus,
    createdBy: postData.createdBy as string,
    workerUserId: postData.workerUserId as string,
    cowerAdditionalCost: postData.cowerAdditionalCost as boolean,
    address: postData.address as string,
    cityName: postData.cityName as string
  };
}

export async function completePost(docId: string) {

  const docRef = doc(postsCollection, docId);

  return await updateDoc(docRef, {status: PostStatus.COMPLETED})
}

export async function editPost(docId: string, editedPost: CreatePostInterface) {

  const docRef = doc(postsCollection, docId);

  return await updateDoc(docRef, {...editedPost})
}
