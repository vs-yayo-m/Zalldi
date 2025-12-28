// src/hooks/useUsers.js

import { useState, useEffect } from 'react'
import { userService } from '@services/user.service'
import toast from 'react-hot-toast'

export function useUsers(filters = {}) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchUsers()
  }, [JSON.stringify(filters)])
  
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getAllCustomers(filters)
      setUsers(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }
  
  const searchUsers = async (searchTerm) => {
    try {
      setLoading(true)
      const data = await userService.searchCustomers(searchTerm)
      setUsers(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to search users')
    } finally {
      setLoading(false)
    }
  }
  
  const updateUser = async (userId, userData) => {
    try {
      await userService.updateUser(userId, userData)
      await fetchUsers()
      toast.success('User updated successfully')
      return true
    } catch (err) {
      toast.error('Failed to update user')
      return false
    }
  }
  
  const deleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      toast.success('User deleted successfully')
      return true
    } catch (err) {
      toast.error('Failed to delete user')
      return false
    }
  }
  
  return {
    users,
    loading,
    error,
    fetchUsers,
    searchUsers,
    updateUser,
    deleteUser
  }
}

export function useUser(userId) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])
  
  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUser(userId)
      setUser(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load user')
    } finally {
      setLoading(false)
    }
  }
  
  const updateProfile = async (profileData) => {
    try {
      await userService.updateProfile(userId, profileData)
      await fetchUser()
      toast.success('Profile updated successfully')
      return true
    } catch (err) {
      toast.error('Failed to update profile')
      return false
    }
  }
  
  const addAddress = async (address) => {
    try {
      const newAddress = await userService.addAddress(userId, address)
      await fetchUser()
      toast.success('Address added successfully')
      return newAddress
    } catch (err) {
      toast.error('Failed to add address')
      return null
    }
  }
  
  const updateAddress = async (addressId, addressData) => {
    try {
      await userService.updateAddress(userId, addressId, addressData)
      await fetchUser()
      toast.success('Address updated successfully')
      return true
    } catch (err) {
      toast.error('Failed to update address')
      return false
    }
  }
  
  const deleteAddress = async (addressId) => {
    try {
      await userService.deleteAddress(userId, addressId)
      await fetchUser()
      toast.success('Address deleted successfully')
      return true
    } catch (err) {
      toast.error('Failed to delete address')
      return false
    }
  }
  
  const setDefaultAddress = async (addressId) => {
    try {
      await userService.setDefaultAddress(userId, addressId)
      await fetchUser()
      toast.success('Default address updated')
      return true
    } catch (err) {
      toast.error('Failed to set default address')
      return false
    }
  }
  
  return {
    user,
    loading,
    error,
    fetchUser,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  }
}