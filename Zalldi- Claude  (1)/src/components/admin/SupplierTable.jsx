// src/components/admin/SupplierTable.jsx

import { motion } from 'framer-motion'
import { formatDate, formatCurrency } from '@utils/formatters'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { Store, Mail, Phone, Package, ShoppingBag, DollarSign, Calendar, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function SupplierTable({ suppliers, onViewDetails, onVerify }) {
  const getVerificationStatus = (supplier) => {
    if (supplier.verified) return { label: 'Verified', color: 'green', icon: CheckCircle }
    if (supplier.rejected) return { label: 'Rejected', color: 'red', icon: XCircle }
    return { label: 'Pending', color: 'amber', icon: Clock }
  }
  
  const getPerformanceRating = (supplier) => {
    if (supplier.rating >= 4.5) return { label: 'Excellent', color: 'green' }
    if (supplier.rating >= 4.0) return { label: 'Good', color: 'blue' }
    if (supplier.rating >= 3.5) return { label: 'Fair', color: 'amber' }
    return { label: 'Poor', color: 'red' }
  }
  
  return (
    <div className="space-y-3">
      {suppliers.map((supplier, index) => {
        const verificationStatus = getVerificationStatus(supplier)
        const performanceRating = supplier.rating ? getPerformanceRating(supplier) : null
        
        return (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                  {supplier.photoURL ? (
                    <img
                      src={supplier.photoURL}
                      alt={supplier.businessName}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <Store className="w-8 h-8 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-neutral-800">
                          {supplier.businessName || 'Unnamed Business'}
                        </h3>
                        <Badge
                          variant={verificationStatus.color}
                          size="sm"
                          icon={verificationStatus.icon}
                        >
                          {verificationStatus.label}
                        </Badge>
                        {performanceRating && (
                          <Badge variant={performanceRating.color} size="sm">
                            ⭐ {supplier.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">
                        Owner: {supplier.displayName || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        {supplier.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{supplier.email}</span>
                          </div>
                        )}
                        {supplier.phoneNumber && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{supplier.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Products</p>
                        <p className="font-semibold text-neutral-800">
                          {supplier.activeProducts}/{supplier.productCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Orders</p>
                        <p className="font-semibold text-neutral-800">{supplier.orderCount || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Revenue</p>
                        <p className="font-semibold text-neutral-800">
                          {formatCurrency(supplier.totalRevenue || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Calendar className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Joined</p>
                        <p className="font-semibold text-neutral-800 text-xs">
                          {formatDate(supplier.createdAt?.toDate(), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {supplier.businessAddress && (
                    <div className="mb-3 p-3 bg-neutral-50 rounded-lg">
                      <p className="text-xs text-neutral-500 mb-1">Business Address</p>
                      <p className="text-sm text-neutral-700">{supplier.businessAddress}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(supplier)}
                      icon={Eye}
                    >
                      View Details
                    </Button>
                    {!supplier.verified && !supplier.rejected && (
                      <Button
                        size="sm"
                        onClick={() => onVerify(supplier)}
                        icon={CheckCircle}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Review Verification
                      </Button>
                    )}
                    {supplier.rejected && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onVerify(supplier)}
                        className="text-amber-600 hover:bg-amber-50"
                      >
                        Re-review
                      </Button>
                    )}
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