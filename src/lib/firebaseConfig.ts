import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDMgu_RL10W846PrMIxRVQkBHayW-TzSQ4",
  authDomain: "smarttrafficmanagementsy-10f82.firebaseapp.com",
  databaseURL: "https://smarttrafficmanagementsy-10f82-default-rtdb.firebaseio.com",
  projectId: "smarttrafficmanagementsy-10f82",
  storageBucket: "smarttrafficmanagementsy-10f82.firebasestorage.app",
  messagingSenderId: "702096872193",
  appId: "1:702096872193:web:f89f2a07f25ac93bbb0100",
  measurementId: "G-HXDTP2FLGM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);