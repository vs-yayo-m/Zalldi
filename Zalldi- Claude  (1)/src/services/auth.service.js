// src/services/auth.service.js

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { USER_ROLES } from '@/utils/constants'

class AuthService {
  async createUser(email, password, displayName, role = USER_ROLES.CUSTOMER) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const { user } = userCredential
      
      await firebaseUpdateProfile(user, { displayName })
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: null,
        role,
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
      
      await setDoc(doc(db, 'users', user.uid), userData)
      await sendEmailVerification(user)
      
      return { success: true, user: userData }
    } catch (error) {
      throw error
    }
  }
  
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      
      return {
        success: true,
        user: {
          ...userCredential.user,
          ...userDoc.data()
        }
      }
    } catch (error) {
      throw error
    }
  }
  
  async signOut() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (error) {
      throw error
    }
  }
  
  async updateUserData(uid, updates) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  async updateProfile(updates) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('No user logged in')
      
      if (updates.displayName || updates.photoURL) {
        await firebaseUpdateProfile(currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        })
      }
      
      await this.updateUserData(currentUser.uid, updates)
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  async updateUserEmail(newEmail) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('No user logged in')
      
      await updateEmail(currentUser, newEmail)
      await sendEmailVerification(currentUser)
      
      await this.updateUserData(currentUser.uid, { email: newEmail })
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  async updateUserPassword(newPassword) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('No user logged in')
      
      await updatePassword(currentUser, newPassword)
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  async sendVerificationEmail() {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('No user logged in')
      
      await sendEmailVerification(currentUser)
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  async deleteAccount() {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('No user logged in')
      
      await deleteDoc(doc(db, 'users', currentUser.uid))
      await deleteUser(currentUser)
      
      return { success: true }
    } catch (error) {
      throw error
    }
  }
  
  getCurrentUser() {
    return auth.currentUser
  }
  
  isAuthenticated() {
    return !!auth.currentUser
  }
}

export default new AuthService()