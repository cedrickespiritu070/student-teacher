
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBaaWXiLmDAUbSDUb-ThvD-_IyU7Mg6m4M", // Replace with your actual API key
  authDomain: "my-application--kainos.firebaseapp.com", // Replace with your actual auth domain
  databaseURL: "https://my-application--kainos-default-rtdb.firebaseio.com", // Your database URL
  projectId: "my-application--kainos", // Replace with your actual project ID
  storageBucket: "my-application--kainos.appspot.com", // Your storage bucket URL
  messagingSenderId: "1004543669813", // Your sender ID
  appId: "1:1004543669813:android:34c9dc9e92a48638f2e37c",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };

