import { initializeApp } from "firebase/app";   
import {getFirestore} from "@firebase/firestore";
import{getStorage} from "firebase/storage"



const firebaseConfig = {
  apiKey: "AIzaSyCOR8ZZs4jMfCBadsnjVQ_mgR6HNO-HXD0",
  authDomain: "first-firebase-project-c70f6.firebaseapp.com",
  projectId: "first-firebase-project-c70f6",
  storageBucket: "first-firebase-project-c70f6.firebasestorage.app",
  messagingSenderId: "532632797195",
  appId: "1:532632797195:web:9bbbad7eb035c8429d070e",
  measurementId: "G-3WV2WQZMNK"
};

  const app= initializeApp(firebaseConfig)
  
  export const db= getFirestore(app)
  export const storage=getStorage(app)