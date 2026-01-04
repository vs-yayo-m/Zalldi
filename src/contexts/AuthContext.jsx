// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { USER_ROLES } from '@/utils/constants'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          const userData = userDoc.exists() ? userDoc.data() : null
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            ...userData
          })
        } catch (err) {
          console.error('Error fetching user data:', err)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            role: USER_ROLES.CUSTOMER
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    
    return unsubscribe
  }, [])
  
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
        photoURL: null,
        role: USER_ROLES.CUSTOMER,
        phoneNumber: null,
        addresses: [],
        wishlist: [],
        orderCount: 0,
        totalSpent: 0,
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      
      await sendEmailVerification(firebaseUser)
      
      return { success: true }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  
  const login = async (email, password) => {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      return { success: true }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  
  const resetPassword = async (email) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  
  const updateUserProfile = async (updates) => {
    try {
      setError(null)
      if (!user) throw new Error('No user logged in')
      
      if (updates.displayName || updates.photoURL) {
        await updateProfile(auth.currentUser, updates)
      }
      
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  
  const resendVerificationEmail = async () => {
    try {
      setError(null)
      if (!auth.currentUser) throw new Error('No user logged in')
      await sendEmailVerification(auth.currentUser)
      return { success: true }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    resendVerificationEmail,
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

function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection'
  }
  
  return errorMessages[errorCode] || 'An error occurred. Please try again'
}