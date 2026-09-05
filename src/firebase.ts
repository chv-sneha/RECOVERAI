import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCxrM-DEvqgNhcVeFra6kqGTUkEH8PEKBg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "recoverai-30b76.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "recoverai-30b76",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "recoverai-30b76.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "615846612263",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:615846612263:web:0f60fdc1978bec0355ad02"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  type FirebaseUser
};
