// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGiRaP-FX3Gxkl-6JlU5J5QS0QxC3tBMc",
  authDomain: "sungwon-travel-app.firebaseapp.com",
  projectId: "sungwon-travel-app",
  storageBucket: "sungwon-travel-app.firebasestorage.app",
  messagingSenderId: "671258169410",
  appId: "1:671258169410:web:4e89e8b0c784df1d0a5ddb",
  measurementId: "G-X4K8QSPT54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);