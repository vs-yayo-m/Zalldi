// src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* 🔹 Firebase configuration */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/* 🔹 Initialize Firebase app */
const app = initializeApp(firebaseConfig);

/* 🔹 EXPORT THESE (THIS FIXES YOUR ERROR) */
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/* 🔹 Firestore collection names */
export const firestoreCollections = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  REVIEWS: "reviews",
  CATEGORIES: "categories",
  ADDRESSES: "addresses",
  CARTS: "carts",
  WISHLISTS: "wishlists",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
  ANALYTICS: "analytics",
};

/* 🔹 Storage root folders */
export const storageRoots = {
  PRODUCTS: "products",
  USERS: "users",
  ORDERS: "orders",
  REVIEWS: "reviews",
  BANNERS: "banners",
};




/* 🔹 Default export (optional but useful) */
export default app;
