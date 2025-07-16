// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2pkQMf1HqEUx8rUhmgINZ7LugRgr3GNA",
  authDomain: "vital-b788d.firebaseapp.com",
  projectId: "vital-b788d",
  storageBucket: "vital-b788d.firebasestorage.app",
  messagingSenderId: "315906711499",
  appId: "1:315906711499:web:85b60dd65190b104c7604e",
  measurementId: "G-FPBF2RZH20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

console.log('✅ Firebase configured successfully');

// Export default for backward compatibility
export default { auth, db, analytics };