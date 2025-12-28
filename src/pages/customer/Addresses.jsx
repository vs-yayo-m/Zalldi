// src/pages/customer/Addresses.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import AddressList from '@components/customer/AddressList'
import AddressForm from '@components/customer/AddressForm'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import LoadingScreen from '@components/shared/LoadingScreen'
import { updateUserAddresses } from '@services/user.service'
import toast from 'react-hot-toast'
import { Plus, ArrowLeft } from 'lucide-react'

export default function Addresses() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAddress, setDeletingAddress] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/customer/addresses', { replace: true })
    }
  }, [user, authLoading, navigate])
  
  if (authLoading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return null
  }
  
  const addresses = user.addresses || []
  
  const handleAddSuccess = () => {
    setShowAddForm(false)
    setEditingAddress(null)
  }
  
  const handleEdit = (address) => {
    setEditingAddress(address)
    setShowAddForm(true)
  }
  
  const handleDeleteClick = (address) => {
    setDeletingAddress(address)
    setShowDeleteModal(true)
  }
  
  const handleDeleteConfirm = async () => {
    if (!deletingAddress) return
    
    setIsDeleting(true)
    try {
      const updatedAddresses = addresses.filter(a => a.id !== deletingAddress.id)
      
      if (deletingAddress.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true
      }
      
      await updateUserAddresses(user.uid, updatedAddresses)
      await refreshUser()
      
      toast.success('Address deleted successfully')
      setShowDeleteModal(false)
      setDeletingAddress(null)
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Failed to delete address')
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-50 py-8 sm:py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            className="mb-4"
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900">
              Delivery Addresses
            </h1>
            {!showAddForm && (
              <Button
                onClick={() => {
                  setEditingAddress(null)
                  setShowAddForm(true)
                }}
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Add New
              </Button>
            )}
          </div>
          <p className="text-neutral-600">
            Manage your saved delivery addresses
          </p>
        </motion.div>

        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <AddressForm
              address={editingAddress}
              onSuccess={handleAddSuccess}
              onCancel={() => {
                setShowAddForm(false)
                setEditingAddress(null)
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AddressList
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingAddress(null)
        }}
        title="Delete Address"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
          {deletingAddress && (
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="font-semibold text-neutral-900">{deletingAddress.street}</p>
              <p className="text-sm text-neutral-600">
                {deletingAddress.area}, Ward {deletingAddress.ward}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setDeletingAddress(null)
              }}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              loading={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}