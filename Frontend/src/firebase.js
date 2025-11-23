// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

    apiKey: "AIzaSyDUWmLw5oFmEXB9hyK0IaiYttWuqy9QyoU",

    authDomain: "diabetestii-d2e65.firebaseapp.com",

    projectId: "diabetestii-d2e65",

    storageBucket: "diabetestii-d2e65.firebasestorage.app",

    messagingSenderId: "886634705634",

    appId: "1:886634705634:web:378b4596114dbe5c8f64bb",

    measurementId: "G-H4E5RTJ714"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
// Inicializar Firebase
export const db = getFirestore(app);