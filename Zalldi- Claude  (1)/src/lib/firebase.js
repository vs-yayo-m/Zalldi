// src/lib/firebase.js

import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { firebaseConfig } from '@config/firebase'

let app
let auth
let db
let storage
let analytics

export const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    
    if (typeof window !== 'undefined' && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analytics = getAnalytics(app)
    }
    
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      connectFirestoreEmulator(db, 'localhost', 8080)
      connectStorageEmulator(storage, 'localhost', 9199)
    }
  }
  
  return { app, auth, db, storage, analytics }
}

export const getFirebaseAuth = () => {
  if (!auth) {
    initializeFirebase()
  }
  return auth
}

export const getFirebaseDb = () => {
  if (!db) {
    initializeFirebase()
  }
  return db
}

export const getFirebaseStorage = () => {
  if (!storage) {
    initializeFirebase()
  }
  return storage
}

export const getFirebaseAnalytics = () => {
  if (!analytics && typeof window !== 'undefined') {
    initializeFirebase()
  }
  return analytics
}

export { auth, db, storage, analytics }
export default app