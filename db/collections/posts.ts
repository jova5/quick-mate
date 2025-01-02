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
  workerUserId: string
//   TODO, dodaj pratece troskove
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
      ...doc.data() as PostInterface,
      id: doc.id,
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
      ...doc.data() as PostInterface,
      id: doc.id,
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
      ...doc.data() as PostInterface,
      id: doc.id,
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
  };
}
