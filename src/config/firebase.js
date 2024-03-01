import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMZYn917XfwOs1zce95kH8aVuCG-L5evo",
  authDomain: "wildbase-3a94b.firebaseapp.com",
  databaseURL: "https://wildbase-3a94b-default-rtdb.firebaseio.com",
  projectId: "wildbase-3a94b",
  storageBucket: "wildbase-3a94b.appspot.com",
  messagingSenderId: "353626884464",
  appId: "1:353626884464:web:9a281984480e2bef4667b5",
  measurementId: "G-EK84D2XJRS",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storedb = getFirestore(app);
