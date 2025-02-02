import firestore, {Timestamp} from '@react-native-firebase/firestore';

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

const postsCollection = firestore().collection('posts')

export async function addPost(post: CreatePostInterface) {

  const dbData = {
    createdAt: Timestamp.now(), // Use the Firebase Timestamp from @react-native-firebase/firestore
    ...post
  };

  return await postsCollection.add(dbData);
}

export async function acceptPost(docId: string, workerUserId: string) {

  const docRef = postsCollection.doc(docId);

  return await docRef.update({
    workerUserId: workerUserId,
    status: PostStatus.IN_PROGRESS // Update the status
  });
}

export async function getAllOpenPostsByCityId(cityId: string) {

  const postsQuery = postsCollection
  .where('cityId', '==', cityId)
  .where('status', '==', PostStatus.OPEN);

  const querySnapshot = await postsQuery.get();

  return querySnapshot;
}

export async function getAllCompletedPostsByUserId(userId: string): Promise<PostInterface[]> {

  const postsQuery = postsCollection
  .where("workerUserId", "==", userId)
  .where("status", "==", PostStatus.COMPLETED);

  const querySnapshot = await postsQuery.get(); // Using `.get()` for React Native Firebase

  return querySnapshot.docs.map(doc => {
    const postData = doc.data();
    return {
      id: doc.id,
      title: postData.title,
      description: postData.description,
      price: postData.price,
      dueDateTime: postData.dueDateTime,
      destination: postData.destination as GeoLocation,
      contactPhoneNumber: postData.contactPhoneNumber,
      cityId: postData.cityId,
      status: postData.status as PostStatus,
      createdBy: postData.createdBy,
      workerUserId: postData.workerUserId,
      cowerAdditionalCost: postData.cowerAdditionalCost,
      address: postData.address,
      cityName: postData.cityName,
    };
  });
}

export async function getAllInProgressPostsByUserId(userId: string): Promise<PostInterface[]> {

  const postsQuery = postsCollection
  .where("workerUserId", "==", userId)
  .where("status", "==", PostStatus.IN_PROGRESS);

  const querySnapshot = await postsQuery.get(); // Using `.get()` for React Native Firebase

  return querySnapshot.docs.map(doc => {
    const postData = doc.data();
    return {
      id: doc.id,
      title: postData.title,
      description: postData.description,
      price: postData.price,
      dueDateTime: postData.dueDateTime,
      destination: postData.destination as GeoLocation,
      contactPhoneNumber: postData.contactPhoneNumber,
      cityId: postData.cityId,
      status: postData.status as PostStatus,
      createdBy: postData.createdBy,
      workerUserId: postData.workerUserId,
      cowerAdditionalCost: postData.cowerAdditionalCost,
      address: postData.address,
      cityName: postData.cityName,
    };
  });
}

export async function getAllUserPostsByUserId(userId: string): Promise<PostInterface[]> {

  const postsQuery = postsCollection
  .where("createdBy", "==", userId);

  const querySnapshot = await postsQuery.get(); // Using `.get()` for React Native Firebase

  return querySnapshot.docs.map(doc => {
    const postData = doc.data();
    return {
      id: doc.id,
      title: postData.title,
      description: postData.description,
      price: postData.price,
      dueDateTime: postData.dueDateTime,
      destination: postData.destination as GeoLocation,
      contactPhoneNumber: postData.contactPhoneNumber,
      cityId: postData.cityId,
      status: postData.status as PostStatus,
      createdBy: postData.createdBy,
      workerUserId: postData.workerUserId,
      cowerAdditionalCost: postData.cowerAdditionalCost,
      address: postData.address,
      cityName: postData.cityName,
    };
  });
}

export async function getPost(docId: string): Promise<PostInterface | null> {

  const docRef = postsCollection.doc(docId);
  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    console.error(`Document with ID ${docId} does not exist.`);
    return null;
  }

  const postData = docSnapshot.data();

  return {
    id: docSnapshot.id,
    title: postData?.title as string,
    description: postData?.description as string,
    price: postData?.price as number,
    dueDateTime: postData?.dueDateTime as Timestamp,
    destination: {
      latitude: postData?.destination.latitude as number,
      longitude: postData?.destination.longitude as number,
    } as GeoLocation,
    contactPhoneNumber: postData?.contactPhoneNumber as string,
    cityId: postData?.cityId as string,
    status: postData?.status as PostStatus,
    createdBy: postData?.createdBy as string,
    workerUserId: postData?.workerUserId as string,
    cowerAdditionalCost: postData?.cowerAdditionalCost as boolean,
    address: postData?.address as string,
    cityName: postData?.cityName as string,
  };
}

export async function completePost(docId: string) {

  const docRef = postsCollection.doc(docId);

  return await docRef.update({status: PostStatus.COMPLETED});
}

export async function editPost(docId: string, editedPost: CreatePostInterface) {

  const docRef = postsCollection.doc(docId);

  return await docRef.update({...editedPost});
}
