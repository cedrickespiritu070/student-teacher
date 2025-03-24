
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCO8DJ0LRnyYzPhozvt-YrynqTBrQgyhCI", // Replace with your actual API key
  authDomain: "commonsense-9c0d1.firebaseapp.com", // Replace with your actual auth domain
  databaseURL: "https://commonsense-9c0d1-default-rtdb.firebaseio.com", // Your database URL
  projectId: "commonsense-9c0d1", // Replace with your actual project ID
  storageBucket: "commonsense-9c0d1.appspot.com", // Your storage bucket URL
  messagingSenderId: "585230915074", // Your sender ID
  appId: "1:585230915074:android:d1075032d8592b06b1f91b",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };

