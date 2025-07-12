import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc ,query, where, getDocs, updateDoc, arrayUnion, doc ,documentId} from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";


const firebaseConfig = {
  apiKey: "",
  authDomain: "vayomitra.firebaseapp.com",
  projectId: "vayomitra",
  storageBucket: "vayomitra.firebasestorage.app",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
const db = getFirestore(app);

export { db, collection, addDoc ,query, where, getDocs, updateDoc, arrayUnion, doc ,documentId};
