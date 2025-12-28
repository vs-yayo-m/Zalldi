// src/components/customer/AddressList.jsx

import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import AddressCard from './AddressCard'
import EmptyState from '@components/shared/EmptyState'
import { MapPin } from 'lucide-react'

export default function AddressList({ selectedId, onSelect, onEdit, onDelete }) {
  const { user } = useAuth()
  const addresses = user?.addresses || []
  
  if (addresses.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No addresses saved"
        description="Add a delivery address to continue"
      />
    )
  }
  
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault) return -1
    if (b.isDefault) return 1
    return 0
  })
  
  return (
    <div className="space-y-3">
      {sortedAddresses.map((address, index) => (
        <motion.div
          key={address.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AddressCard
            address={address}
            isSelected={selectedId === address.id}
            onSelect={() => onSelect(address)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  )
}