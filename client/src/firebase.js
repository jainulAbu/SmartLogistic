import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUfpGw2CL-fb-2FYa5HzPfy2h-z71QAwo",
  authDomain: "logisticgoods-33357.firebaseapp.com",
  projectId: "logisticgoods-33357",
  storageBucket: "logisticgoods-33357.firebasestorage.app",
  messagingSenderId: "828659117695",
  appId: "1:828659117695:web:6a6dc192a03b55e5c8994a",
  measurementId: "G-2W1VVZ3WL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 