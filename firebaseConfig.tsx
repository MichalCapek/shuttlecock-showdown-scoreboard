// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyApC5P1P657M7vch5rae_bTCXwxYLhyd_M",
    authDomain: "badminton-benatky-scoreboard.firebaseapp.com",
    projectId: "badminton-benatky-scoreboard",
    storageBucket: "badminton-benatky-scoreboard.firebasestorage.app",
    messagingSenderId: "886310193358",
    appId: "1:886310193358:web:00bc39ac6b32e92aad689f",
    measurementId: "G-4WF74L0NS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);