// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-estate-7adeb.firebaseapp.com",
  projectId: "mern-estate-7adeb",
  storageBucket: "mern-estate-7adeb.appspot.com",
  messagingSenderId: "741514713106",
  appId: "1:741514713106:web:16aab28f4feecb354720cb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);