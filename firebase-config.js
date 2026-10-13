// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqW1eltZJ_Xo0ks3_eF9tpJsfCny0oUGg",
  authDomain: "shareu-96e84.firebaseapp.com",
  projectId: "shareu-96e84",
  storageBucket: "shareu-96e84.firebasestorage.app",
  messagingSenderId: "552313986658",
  appId: "1:552313986658:web:b337efb3028b33371bfb3b",
  measurementId: "G-X6J37P0WDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
