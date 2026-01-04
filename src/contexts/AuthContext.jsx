// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

export const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.displayName,
              photoURL: firebaseUser.photoURL || userData.photoURL,
              phoneNumber: firebaseUser.phoneNumber || userData.phoneNumber,
              role: userData.role || 'customer',
              ...userData
            })
          } else {
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || null,
              phoneNumber: firebaseUser.phoneNumber || '',
              role: 'customer',
              addresses: [],
              wishlist: [],
              orderCount: 0,
              totalSpent: 0,
              walletBalance: 0,
              notifications: {
                email: true,
                push: true,
                sms: false
              },
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            await setDoc(userDocRef, newUserData)
            setUser({ uid: firebaseUser.uid, ...newUserData })
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'customer'
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    
    return unsubscribe
  }, [])
  
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const userDocRef = doc(db, 'users', result.user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || userData.displayName,
          role: userData.role || 'customer',
          ...userData
        }
      }
      
      return result.user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  
  const register = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      await updateProfile(result.user, { displayName })
      
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName,
        photoURL: null,
        phoneNumber: '',
        role: 'customer',
        addresses: [],
        wishlist: [],
        orderCount: 0,
        totalSpent: 0,
        walletBalance: 0,
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(doc(db, 'users', result.user.uid), userData)
      
      return result.user
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }
  
  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }
  
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }
  
  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUser({
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName || userData.displayName,
            photoURL: auth.currentUser.photoURL || userData.photoURL,
            phoneNumber: auth.currentUser.phoneNumber || userData.phoneNumber,
            role: userData.role || 'customer',
            ...userData
          })
        }
      } catch (error) {
        console.error('Error refreshing user:', error)
      }
    }
  }
  
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    refreshUser
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}