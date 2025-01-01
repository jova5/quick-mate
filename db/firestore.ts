import {getFirestore} from "firebase/firestore";
import app from "@/db/firebaseConfig";

const db = getFirestore(app);

export default db;
