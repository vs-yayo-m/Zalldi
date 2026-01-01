// src/components/customer/AddressList.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Home, Briefcase, MoreVertical, Edit, Trash2, Check } from 'lucide-react'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import AddressForm from './AddressForm'
import EmptyState from '@components/shared/EmptyState'
import { useAuth } from '@hooks/useAuth'
import { useUser } from '@hooks/useUsers'
import { formatAddress } from '@utils/formatters'
import toast from 'react-hot-toast'

export default function AddressList({
  selectedAddress,
  onSelectAddress
}) {
  const { user } = useAuth()
  const { deleteAddress, setDefaultAddress } = useUser(user?.uid)
  
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [showMenu, setShowMenu] = useState(null)
  
  const addresses = user?.addresses || []
  
  const addressIcons = {
    home: Home,
    work: Briefcase,
    other: MapPin
  }
  
  const handleEdit = (address) => {
    setEditingAddress(address)
    setShowEditModal(true)
    setShowMenu(null)
  }
  
  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    
    const success = await deleteAddress(addressId)
    if (success && selectedAddress?.id === addressId) {
      onSelectAddress(null)
    }
    setShowMenu(null)
  }
  
  const handleSetDefault = async (addressId) => {
    await setDefaultAddress(addressId)
    setShowMenu(null)
  }
  
  if (addresses.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No saved addresses"
        message="Add your first delivery address to continue"
      />
    )
  }
  
  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {addresses.map((address, index) => {
            const Icon = addressIcons[address.type] || MapPin
            const isSelected = selectedAddress?.id === address.id

            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className={`
                  relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-neutral-200 hover:border-orange-200 hover:shadow-md'
                  }
                `}
                onClick={() => onSelectAddress(address)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-orange-100' : 'bg-neutral-100'}
                  `}>
                    <Icon className={`
                      w-6 h-6
                      ${isSelected ? 'text-orange-600' : 'text-neutral-500'}
                    `} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`
                          font-semibold capitalize
                          ${isSelected ? 'text-orange-600' : 'text-neutral-800'}
                        `}>
                          {address.type}
                        </h3>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-caption font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu(showMenu === address.id ? null : address.id)
                          }}
                          className="p-1 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-neutral-500" />
                        </button>

                        <AnimatePresence>
                          {showMenu === address.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowMenu(null)
                                }}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-20"
                              >
                                {!address.isDefault && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSetDefault(address.id)
                                    }}
                                    className="w-full px-4 py-2 text-left text-body-sm hover:bg-neutral-50 flex items-center space-x-3"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>Set as Default</span>
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(address)
                                  }}
                                  className="w-full px-4 py-2 text-left text-body-sm hover:bg-neutral-50 flex items-center space-x-3"
                                >
                                  <Edit className="w-4 h-4 text-orange-600" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(address.id)
                                  }}
                                  className="w-full px-4 py-2 text-left text-body-sm hover:bg-neutral-50 flex items-center space-x-3 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <p className="text-body text-neutral-600 leading-relaxed">
                      {formatAddress(address)}
                    </p>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="selected-border"
                    className="absolute inset-0 border-2 border-orange-500 rounded-xl pointer-events-none"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingAddress(null)
        }}
        title="Edit Address"
      >
        <AddressForm
          initialData={editingAddress}
          onSuccess={() => {
            setShowEditModal(false)
            setEditingAddress(null)
          }}
          onCancel={() => {
            setShowEditModal(false)
            setEditingAddress(null)
          }}
        />
      </Modal>
    </>
  )
}