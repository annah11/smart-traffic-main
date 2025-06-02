import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyA7kKF-GOtYqZTTSxAMbN66fcK1r8SDjck",
  authDomain: "smarttrafficweb-b8527.firebaseapp.com",
  projectId: "smarttrafficweb-b8527",
  storageBucket: "smarttrafficweb-b8527.appspot.com",
  messagingSenderId: "101283314046",
  appId: "1:101283314046:web:0189580949abdc9f3c1b2f",
  measurementId: "G-1GWRSTLLSS",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
