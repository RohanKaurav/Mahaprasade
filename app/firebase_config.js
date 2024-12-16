import { initializeApp } from "firebase/app";   
import {getFirestore} from "@firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyDXQe4PER8E9V8LW41-T1p3cvreN3-0TR4",
    authDomain: "mahaprasade-govinde.firebaseapp.com",
    projectId: "mahaprasade-govinde",
    storageBucket: "mahaprasade-govinde.firebasestorage.app",
    messagingSenderId: "965717201158",
    appId: "1:965717201158:web:32a4ee467df06e35210e87",
    measurementId: "G-6M2ER0R8KX"
  };

  const app= initializeApp(firebaseConfig)
  
  export const db= getFirestore(app)