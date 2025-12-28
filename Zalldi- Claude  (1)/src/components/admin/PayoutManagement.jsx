// src/components/admin/PayoutManagement.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency, formatDate } from '@utils/formatters'
import { calculateSupplierPayout } from '@utils/calculations'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Modal from '@components/ui/Modal'
import { Users, CheckCircle, Clock, DollarSign, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function PayoutManagement() {
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadPendingPayouts()
  }, [])

  const loadPendingPayouts = async () => {
    try {
      setLoading(true)
      
      const suppliersSnap = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'supplier'), where('verified', '==', true))
      )

      const payoutData = await Promise.all(
        suppliersSnap.docs.map(async (supplierDoc) => {
          const supplier = { id: supplierDoc.id, ...supplierDoc.data() }
          
          const ordersSnap = await getDocs(
            query(
              collection(db, 'orders'),
              where('status', '==', 'delivered')
            )
          )

          const supplierOrders = ordersSnap.docs.filter(doc => {
            const order = doc.data()
            return order.items?.some(item => item.supplierId === supplier.id)
          })

          const totalEarnings = supplierOrders.reduce((sum, doc) => {
            const order = doc.data()
            const supplierItems = order.items?.filter(item => item.supplierId === supplier.id) || []
            const orderTotal = supplierItems.reduce((s, item) => s + item.total, 0)
            return sum + calculateSupplierPayout(orderTotal, 10)
          }, 0)

          const paidAmount = supplier.totalPaid || 0
          const pendingAmount = totalEarnings - paidAmount

          return {
            supplierId: supplier.id,
            supplierName: supplier.businessName || supplier.displayName,
            supplierEmail: supplier.email,
            totalEarnings,
            paidAmount,
            pendingAmount,
            orderCount: supplierOrders.length,
            lastPayout: supplier.lastPayoutDate?.toDate() || null
          }
        })
      )

      const filtered = payoutData.filter(p => p.pendingAmount > 0)
      setPayouts(filtered.sort((a, b) => b.pendingAmount - a.pendingAmount))
    } catch (error) {
      console.error('Error loading payouts:', error)
      toast.error('Failed to load payout data')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPayout = async () => {
    if (!selectedPayout) return

    try {
      setProcessing(true)
      
      await updateDoc(doc(db, 'users', selectedPayout.supplierId), {
        totalPaid: (selectedPayout.paidAmount || 0) + selectedPayout.pendingAmount,
        lastPayoutDate: new Date(),
        lastPayoutAmount: selectedPayout.pendingAmount
      })

      toast.success('Payout processed successfully')
      setShowConfirmModal(false)
      setSelectedPayout(null)
      loadPendingPayouts()
    } catch (error) {
      console.error('Error processing payout:', error)
      toast.error('Failed to process payout')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-neutral-200 rounded"></div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-neutral-800">
              Pending Payouts
            </h2>
            {payouts.length > 0 && (
              <Badge variant="amber">{payouts.length}</Badge>
            )}
          </div>
        </div>

        {payouts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-neutral-600">No pending payouts</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {payouts.map((payout, index) => (
                <motion.div
                  key={payout.supplierId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {payout.supplierName}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1">
                        {payout.supplierEmail}
                      </p>
                    </div>
                    <Badge variant="amber" icon={Clock}>
                      Pending
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-neutral-500">Total Earned</p>
                      <p className="text-sm font-semibold text-neutral-800">
                        {formatCurrency(payout.totalEarnings)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Already Paid</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(payout.paidAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Pending</p>
                      <p className="text-sm font-semibold text-orange-600">
                        {formatCurrency(payout.pendingAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-600">
                      {payout.orderCount} completed orders
                      {payout.lastPayout && ` • Last payout: ${formatDate(payout.lastPayout, 'MMM d')}`}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPayout(payout)
                        setShowConfirmModal(true)
                      }}
                      icon={DollarSign}
                    >
                      Process
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Total Pending</span>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(payouts.reduce((sum, p) => sum + p.pendingAmount, 0))}
                </span>
              </div>
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setSelectedPayout(null)
        }}
        title="Confirm Payout"
      >
        {selectedPayout && (
          <div className="p-6">
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Confirm payout details</p>
                  <p>Please verify the information before processing the payout.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Supplier</span>
                <span className="font-semibold text-neutral-800">
                  {selectedPayout.supplierName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Email</span>
                <span className="font-semibold text-neutral-800">
                  {selectedPayout.supplierEmail}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Completed Orders</span>
                <span className="font-semibold text-neutral-800">
                  {selectedPayout.orderCount}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Total Earnings</span>
                <span className="font-semibold text-neutral-800">
                  {formatCurrency(selectedPayout.totalEarnings)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Already Paid</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(selectedPayout.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between py-3 bg-orange-50 px-3 rounded-lg">
                <span className="font-semibold text-neutral-800">Amount to Pay</span>
                <span className="text-xl font-bold text-orange-600">
                  {formatCurrency(selectedPayout.pendingAmount)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmModal(false)
                  setSelectedPayout(null)
                }}
                className="flex-1"
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcessPayout}
                disabled={processing}
                icon={CheckCircle}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {processing ? 'Processing...' : 'Confirm Payout'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}