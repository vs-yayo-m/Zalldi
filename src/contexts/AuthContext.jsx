// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithCustomToken,
  signInAnonymously
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { USER_ROLES } from '@/utils/constants'

// RULE 1: Standardized Path and Global Variables
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // RULE 3: Initialize Auth FIRST
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.error("Auth Initialization Error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // RULE 1: Strict path for User Data
          const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.displayName,
              photoURL: firebaseUser.photoURL,
              ...userData
            });
          } else {
            // If document doesn't exist, provide a basic object with default role
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: USER_ROLES.CUSTOMER,
              displayName: firebaseUser.displayName
            });
          }
        } catch (err) {
          console.error('Error fetching user profile data:', err);
          // Fallback to minimal user object to prevent UI crash
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: USER_ROLES.CUSTOMER
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const register = async (email, password, displayName) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const { user: firebaseUser } = userCredential
      
      await updateProfile(firebaseUser, { displayName })
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName,
        role: USER_ROLES.CUSTOMER,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      // RULE 1: Save user to standardized path
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', firebaseUser.uid), userData)
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }
  
  const login = async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }
  
  const logout = () => signOut(auth)
  
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isCustomer: user?.role === USER_ROLES.CUSTOMER,
    isSupplier: user?.role === USER_ROLES.SUPPLIER,
    isAdmin: user?.role === USER_ROLES.ADMIN
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

