// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "avinya-realesate.firebaseapp.com",
  projectId: "avinya-realesate",
  storageBucket: "avinya-realesate.appspot.com",
  messagingSenderId: "859420929386",
  appId: "1:859420929386:web:e3e001b5ed1c6d16cbc913",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
