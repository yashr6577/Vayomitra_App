// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBdQq5RUXb3XZSlThrr_o7eV2uMC4kRhlw",
//   authDomain: "vayomitra.firebaseapp.com",
//   projectId: "vayomitra",
//   storageBucket: "vayomitra.firebasestorage.app",
//   messagingSenderId: "268139890986",
//   appId: "1:268139890986:web:5bbc22d0541cab860cb653",
//   measurementId: "G-L2J0C0M23G"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc ,query, where, getDocs, updateDoc, arrayUnion, doc ,documentId} from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";


const firebaseConfig = {
  apiKey: "AIzaSyBdQq5RUXb3XZSlThrr_o7eV2uMC4kRhlw",
  authDomain: "vayomitra.firebaseapp.com",
  projectId: "vayomitra",
  storageBucket: "vayomitra.firebasestorage.app",
  messagingSenderId: "268139890986",
  appId: "1:268139890986:web:5bbc22d0541cab860cb653",
  measurementId: "G-L2J0C0M23G"
};

// const [request, response, promptAsync] = Google.useAuthRequest({
//   androidClientId: "YOUR_ANDROID_CLIENT_ID",
//   iosClientId: "YOUR_IOS_CLIENT_ID",
//   webClientId: "YOUR_WEB_CLIENT_ID",
//   redirectUri: AuthSession.getRedirectUrl(), // 👈 Ensure correct redirect URI
// });


// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
const db = getFirestore(app);

export { db, collection, addDoc ,query, where, getDocs, updateDoc, arrayUnion, doc ,documentId};