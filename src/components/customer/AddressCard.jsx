// src/components/customer/AddressCard.jsx

import { motion } from 'framer-motion'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { MapPin, Home, Briefcase, Edit2, Trash2, Check } from 'lucide-react'

const addressIcons = {
  home: Home,
  work: Briefcase,
  other: MapPin
}

export default function AddressCard({ address, isSelected = false, onSelect, onEdit, onDelete }) {
  const Icon = addressIcons[address.type] || MapPin
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`
        bg-white rounded-2xl shadow-card p-6 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary-500' : ''}
      `}
      onClick={() => onSelect?.(address)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${isSelected ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-600'}
          `}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-neutral-900 capitalize">
                {address.type}
              </p>
              {address.isDefault && (
                <Badge variant="success" size="sm">
                  Default
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-neutral-900">{address.street}</p>
        <p className="text-neutral-600">{address.area}</p>
        <p className="text-neutral-600">Ward {address.ward}, Butwal</p>
        {address.landmark && (
          <p className="text-neutral-500 text-sm">Near {address.landmark}</p>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 pt-4 border-t border-neutral-200">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Edit2 className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation()
                onEdit(address)
              }}
              className="flex-1"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(address)
              }}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}