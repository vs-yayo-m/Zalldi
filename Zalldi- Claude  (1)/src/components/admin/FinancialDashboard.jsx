// src/components/admin/FinancialDashboard.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatCurrency, formatDate } from '@utils/formatters'
import { calculateRevenue, calculateCommission, calculateSupplierPayout } from '@utils/calculations'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Select from '@components/ui/Select'
import RevenueAnalytics from './RevenueAnalytics'
import TransactionLogs from './TransactionLogs'
import PayoutManagement from './PayoutManagement'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Users, Download, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function FinancialDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    platformRevenue: 0,
    supplierPayouts: 0,
    pendingPayouts: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    revenueGrowth: 0
  })
  const [revenueData, setRevenueData] = useState([])
  
  useEffect(() => {
    loadFinancialData()
  }, [timeRange])
  
  const loadFinancialData = async () => {
    try {
      setLoading(true)
      
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)
      
      const previousStartDate = new Date(startDate)
      previousStartDate.setDate(previousStartDate.getDate() - days)
      
      const [currentOrdersSnap, previousOrdersSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, 'orders'),
            where('createdAt', '>=', startDate),
            where('status', '==', 'delivered'),
            orderBy('createdAt', 'asc')
          )
        ),
        getDocs(
          query(
            collection(db, 'orders'),
            where('createdAt', '>=', previousStartDate),
            where('createdAt', '<', startDate),
            where('status', '==', 'delivered')
          )
        )
      ])
      
      const currentOrders = currentOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const previousOrders = previousOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      const totalRevenue = calculateRevenue(currentOrders)
      const previousRevenue = calculateRevenue(previousOrders)
      const revenueGrowth = previousRevenue > 0 ?
        ((totalRevenue - previousRevenue) / previousRevenue) * 100 :
        0
      
      const commissionRate = 10
      const platformRevenue = currentOrders.reduce((sum, order) => {
        return sum + calculateCommission(order.total, commissionRate)
      }, 0)
      
      const supplierPayouts = currentOrders.reduce((sum, order) => {
        return sum + calculateSupplierPayout(order.total, commissionRate)
      }, 0)
      
      const pendingOrdersSnap = await getDocs(
        query(
          collection(db, 'orders'),
          where('status', 'in', ['pending', 'confirmed', 'picking', 'packing', 'out_for_delivery'])
        )
      )
      
      const pendingPayouts = pendingOrdersSnap.docs.reduce((sum, doc) => {
        const order = doc.data()
        return sum + calculateSupplierPayout(order.total, commissionRate)
      }, 0)
      
      const averageOrderValue = currentOrders.length > 0 ?
        totalRevenue / currentOrders.length :
        0
      
      setMetrics({
        totalRevenue,
        platformRevenue,
        supplierPayouts,
        pendingPayouts,
        completedOrders: currentOrders.length,
        averageOrderValue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10
      })
      
      const dateMap = {}
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const key = date.toISOString().split('T')[0]
        dateMap[key] = {
          date: key,
          revenue: 0,
          orders: 0,
          platformRevenue: 0
        }
      }
      
      currentOrders.forEach(order => {
        const orderDate = order.createdAt.toDate()
        const key = orderDate.toISOString().split('T')[0]
        
        if (dateMap[key]) {
          dateMap[key].revenue += order.total
          dateMap[key].orders += 1
          dateMap[key].platformRevenue += calculateCommission(order.total, commissionRate)
        }
      })
      
      const chartData = Object.values(dateMap).map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(day.revenue),
        platformRevenue: Math.round(day.platformRevenue),
        orders: day.orders
      }))
      
      setRevenueData(chartData)
    } catch (error) {
      console.error('Error loading financial data:', error)
      toast.error('Failed to load financial data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleExportReport = () => {
    const csv = [
      ['Financial Report', formatDate(new Date())].join(','),
      [''],
      ['Metric', 'Value'].join(','),
      ['Total Revenue', formatCurrency(metrics.totalRevenue)].join(','),
      ['Platform Revenue (10%)', formatCurrency(metrics.platformRevenue)].join(','),
      ['Supplier Payouts', formatCurrency(metrics.supplierPayouts)].join(','),
      ['Pending Payouts', formatCurrency(metrics.pendingPayouts)].join(','),
      ['Completed Orders', metrics.completedOrders].join(','),
      ['Average Order Value', formatCurrency(metrics.averageOrderValue)].join(','),
      ['Revenue Growth', `${metrics.revenueGrowth}%`].join(',')
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-report-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Report exported successfully')
  }
  
  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
              Financial Dashboard
            </h1>
            <p className="text-neutral-600">
              Monitor revenue, payouts, and financial metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={timeRangeOptions}
              icon={Calendar}
              className="min-w-[150px]"
            />
            <Button
              variant="outline"
              onClick={handleExportReport}
              icon={Download}
            >
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Revenue',
              value: formatCurrency(metrics.totalRevenue),
              change: metrics.revenueGrowth,
              icon: DollarSign,
              color: 'green',
              trend: metrics.revenueGrowth >= 0 ? 'up' : 'down'
            },
            {
              label: 'Platform Revenue',
              value: formatCurrency(metrics.platformRevenue),
              subtitle: '10% Commission',
              icon: CreditCard,
              color: 'blue'
            },
            {
              label: 'Supplier Payouts',
              value: formatCurrency(metrics.supplierPayouts),
              subtitle: 'Completed',
              icon: Users,
              color: 'purple'
            },
            {
              label: 'Pending Payouts',
              value: formatCurrency(metrics.pendingPayouts),
              subtitle: 'In Process',
              icon: TrendingUp,
              color: 'amber'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
                <h3 className="text-neutral-600 text-sm font-medium mb-1">
                  {stat.label}
                </h3>
                <p className="text-2xl font-bold text-neutral-800 mb-1">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-neutral-500">{stat.subtitle}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <RevenueAnalytics data={revenueData} timeRange={timeRange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionLogs />
          <PayoutManagement />
        </div>
      </div>
    </div>
  )
}