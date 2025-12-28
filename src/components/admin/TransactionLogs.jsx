// src/components/admin/TransactionLogs.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency, formatRelativeTime } from '@utils/formatters'
import Card from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import Button from '@components/ui/Button'
import { FileText, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function TransactionLogs() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    loadTransactions()
  }, [filter])
  
  const loadTransactions = async () => {
    try {
      setLoading(true)
      
      let q = query(
        collection(db, 'orders'),
        where('status', '==', 'delivered'),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
      
      const snapshot = await getDocs(q)
      const txns = snapshot.docs.map(doc => {
        const order = doc.data()
        const commission = order.total * 0.1
        const supplierPayout = order.total - commission
        
        return {
          id: doc.id,
          orderId: order.orderNumber,
          type: 'order',
          amount: order.total,
          commission,
          supplierPayout,
          status: 'completed',
          timestamp: order.createdAt?.toDate(),
          customerName: order.customerName,
          paymentMethod: order.paymentMethod
        }
      })
      
      setTransactions(txns)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'order':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />
      case 'refund':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />
      default:
        return <DollarSign className="w-4 h-4 text-blue-600" />
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-neutral-800">
            Recent Transactions
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'orders' ? 'primary' : 'outline'}
            onClick={() => setFilter('orders')}
          >
            Orders
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {transactions.map((txn, index) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  {getTransactionIcon(txn.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 text-sm">
                    {txn.orderId}
                  </h3>
                  <p className="text-xs text-neutral-600">
                    {txn.customerName}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatRelativeTime(txn.timestamp)}
                  </p>
                </div>
              </div>
              <Badge variant="green" size="sm">
                {txn.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-neutral-100">
              <div>
                <p className="text-xs text-neutral-500">Total</p>
                <p className="text-sm font-semibold text-neutral-800">
                  {formatCurrency(txn.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Commission</p>
                <p className="text-sm font-semibold text-orange-600">
                  {formatCurrency(txn.commission)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Payout</p>
                <p className="text-sm font-semibold text-green-600">
                  {formatCurrency(txn.supplierPayout)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <Button variant="ghost" size="sm" className="w-full">
          View All Transactions
        </Button>
      </div>
    </Card>
  )
}