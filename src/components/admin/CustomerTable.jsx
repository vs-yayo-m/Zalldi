// src/components/admin/CustomerTable.jsx

import { motion } from 'framer-motion'
import { formatDate, formatCurrency, formatRelativeTime } from '@utils/formatters'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { User, Mail, Phone, ShoppingBag, DollarSign, Calendar, Eye, Trash2, Clock } from 'lucide-react'

export default function CustomerTable({ users, onViewDetails, onDelete }) {
  const getActivityStatus = (lastOrderDate) => {
    if (!lastOrderDate) return { label: 'New', color: 'blue' }
    
    const daysSince = (new Date() - lastOrderDate) / (1000 * 60 * 60 * 24)
    if (daysSince <= 7) return { label: 'Very Active', color: 'green' }
    if (daysSince <= 30) return { label: 'Active', color: 'emerald' }
    if (daysSince <= 90) return { label: 'Inactive', color: 'amber' }
    return { label: 'Dormant', color: 'red' }
  }
  
  return (
    <div className="space-y-3">
      {users.map((user, index) => {
        const activityStatus = getActivityStatus(user.lastOrderDate)
        
        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-lg">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-800">
                          {user.displayName || 'Unnamed User'}
                        </h3>
                        <Badge variant={activityStatus.color} size="sm">
                          {activityStatus.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        {user.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                        )}
                        {user.phoneNumber && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Orders</p>
                        <p className="font-semibold text-neutral-800">{user.orderCount || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Total Spent</p>
                        <p className="font-semibold text-neutral-800">
                          {formatCurrency(user.totalSpent || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Joined</p>
                        <p className="font-semibold text-neutral-800 text-xs">
                          {formatDate(user.createdAt?.toDate(), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Last Order</p>
                        <p className="font-semibold text-neutral-800 text-xs">
                          {user.lastOrderDate ? formatRelativeTime(user.lastOrderDate) : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.addresses && user.addresses.length > 0 && (
                    <div className="mb-3 p-2 bg-neutral-50 rounded-lg">
                      <p className="text-xs text-neutral-500 mb-1">Primary Address</p>
                      <p className="text-sm text-neutral-700">
                        Ward {user.addresses[0].ward}, {user.addresses[0].area}
                        {user.addresses[0].landmark && ` - Near ${user.addresses[0].landmark}`}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(user)}
                      icon={Eye}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(user)}
                      icon={Trash2}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}