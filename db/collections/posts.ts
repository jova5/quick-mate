import {
  addDoc,
  collection,
  doc,
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
