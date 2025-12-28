// src/components/admin/SupplierManagement.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatDate, formatCurrency } from '@utils/formatters'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Modal from '@components/ui/Modal'
import SupplierTable from './SupplierTable'
import SupplierVerification from './SupplierVerification'
import { Search, Filter, Download, Store, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SupplierManagement() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [verificationFilter, setVerificationFilter] = useState(searchParams.get('verified') || 'all')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  })

  useEffect(() => {
    loadSuppliers()
  }, [statusFilter, verificationFilter])

  useEffect(() => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (statusFilter !== 'all') params.status = statusFilter
    if (verificationFilter !== 'all') params.verified = verificationFilter
    setSearchParams(params)
  }, [searchTerm, statusFilter, verificationFilter])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      
      let q = query(
        collection(db, 'users'),
        where('role', '==', 'supplier'),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      let allSuppliers = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          const userData = { id: userDoc.id, ...userDoc.data() }
          
          const [productsSnap, ordersSnap] = await Promise.all([
            getDocs(query(collection(db, 'products'), where('supplierId', '==', userDoc.id))),
            getDocs(query(collection(db, 'orders'), where('items', 'array-contains', { supplierId: userDoc.id })))
          ])
          
          const totalRevenue = ordersSnap.docs.reduce((sum, doc) => {
            const order = doc.data()
            const supplierItems = order.items?.filter(item => item.supplierId === userDoc.id) || []
            return sum + supplierItems.reduce((itemSum, item) => itemSum + item.total, 0)
          }, 0)

          const activeProducts = productsSnap.docs.filter(doc => doc.data().active !== false).length

          return {
            ...userData,
            productCount: productsSnap.size,
            activeProducts,
            orderCount: ordersSnap.size,
            totalRevenue
          }
        })
      )

      if (verificationFilter !== 'all') {
        allSuppliers = allSuppliers.filter(supplier => {
          if (verificationFilter === 'verified') return supplier.verified === true
          if (verificationFilter === 'pending') return !supplier.verified && !supplier.rejected
          if (verificationFilter === 'rejected') return supplier.rejected === true
          return true
        })
      }

      if (statusFilter === 'active') {
        allSuppliers = allSuppliers.filter(s => s.activeProducts > 0)
      } else if (statusFilter === 'inactive') {
        allSuppliers = allSuppliers.filter(s => s.activeProducts === 0)
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        allSuppliers = allSuppliers.filter(supplier =>
          supplier.displayName?.toLowerCase().includes(term) ||
          supplier.businessName?.toLowerCase().includes(term) ||
          supplier.email?.toLowerCase().includes(term)
        )
      }

      setSuppliers(allSuppliers)

      setStats({
        total: allSuppliers.length,
        verified: allSuppliers.filter(s => s.verified === true).length,
        pending: allSuppliers.filter(s => !s.verified && !s.rejected).length,
        rejected: allSuppliers.filter(s => s.rejected === true).length
      })
    } catch (error) {
      console.error('Error loading suppliers:', error)
      toast.error('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySupplier = async (supplierId, approved) => {
    try {
      await updateDoc(doc(db, 'users', supplierId), {
        verified: approved,
        rejected: !approved,
        verifiedAt: new Date(),
        updatedAt: new Date()
      })

      toast.success(approved ? 'Supplier verified successfully' : 'Supplier verification rejected')
      setShowVerificationModal(false)
      setSelectedSupplier(null)
      loadSuppliers()
    } catch (error) {
      console.error('Error verifying supplier:', error)
      toast.error('Failed to update supplier verification')
    }
  }

  const handleExport = () => {
    const csv = [
      ['Business Name', 'Owner', 'Email', 'Status', 'Products', 'Orders', 'Revenue', 'Join Date'].join(','),
      ...suppliers.map(supplier => [
        supplier.businessName || '',
        supplier.displayName || '',
        supplier.email || '',
        supplier.verified ? 'Verified' : supplier.rejected ? 'Rejected' : 'Pending',
        supplier.productCount,
        supplier.orderCount,
        supplier.totalRevenue,
        formatDate(supplier.createdAt?.toDate())
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suppliers-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Suppliers exported successfully')
  }

  const statusOptions = [
    { value: 'all', label: 'All Suppliers' },
    { value: 'active', label: 'Active (Has Products)' },
    { value: 'inactive', label: 'Inactive (No Products)' }
  ]

  const verificationOptions = [
    { value: 'all', label: 'All Verification' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' }
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
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
            Supplier Management
          </h1>
          <p className="text-neutral-600">
            Manage and verify platform suppliers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Suppliers', value: stats.total, color: 'blue', icon: Store },
            { label: 'Verified', value: stats.verified, color: 'green', icon: CheckCircle },
            { label: 'Pending Review', value: stats.pending, color: 'amber', icon: Clock },
            { label: 'Rejected', value: stats.rejected, color: 'red', icon: XCircle }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by business name, owner, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                icon={Filter}
                className="min-w-[180px]"
              />
              <Select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                options={verificationOptions}
                icon={Filter}
                className="min-w-[180px]"
              />
              <Button
                variant="outline"
                onClick={handleExport}
                icon={Download}
              >
                Export
              </Button>
            </div>
          </div>
        </Card>

        <SupplierTable
          suppliers={suppliers}
          onViewDetails={(supplier) => navigate(`/admin/suppliers/${supplier.id}`)}
          onVerify={(supplier) => {
            setSelectedSupplier(supplier)
            setShowVerificationModal(true)
          }}
        />
      </div>

      <Modal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false)
          setSelectedSupplier(null)
        }}
        title="Supplier Verification"
        size="lg"
      >
        {selectedSupplier && (
          <SupplierVerification
            supplier={selectedSupplier}
            onApprove={() => handleVerifySupplier(selectedSupplier.id, true)}
            onReject={() => handleVerifySupplier(selectedSupplier.id, false)}
            onClose={() => {
              setShowVerificationModal(false)
              setSelectedSupplier(null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}