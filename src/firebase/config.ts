// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBF7aSgMgVSi1yOo4oef-BGZmkcrxCkCeM",
  authDomain: "smart-traffic-891c8.firebaseapp.com",
  projectId: "smart-traffic-891c8",
  storageBucket: "smart-traffic-891c8.firebasestorage.app",
  messagingSenderId: "209587941479",
  appId: "1:209587941479:web:624e62abdccc35036da4c2",
  measurementId: "G-J4YWHSPXPZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);

if (typeof window !== "undefined") {
  getAnalytics(app);
}
