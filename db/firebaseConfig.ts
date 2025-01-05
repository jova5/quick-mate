// import {initializeApp} from 'firebase/app';
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyBlaq7X3owtJRwpy4WLJ4KMdM2uw5vUDD4",
  authDomain: "quick-mate.firebaseapp.com",
  projectId: "quick-mate",
  storageBucket: "quick-mate.firebasestorage.app",
  messagingSenderId: "394706700488",
  appId: "1:394706700488:web:4e25dc12a0885b32837dfd"
};

const app = firebase.initializeApp(firebaseConfig);

export default app;
