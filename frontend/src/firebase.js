// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaeoLGq9vaakFD5t8jJ_EENxFzxOQYI_s",
    authDomain: "hsm-monitor-d05b5.firebaseapp.com",
    projectId: "hsm-monitor-d05b5",
    storageBucket: "hsm-monitor-d05b5.firebasestorage.app",
    messagingSenderId: "973529608900",
    appId: "1:973529608900:web:e763fb2654ac50a9e0cf91",
    measurementId: "G-PDYW1ZDNXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
