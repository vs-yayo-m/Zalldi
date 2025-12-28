// src/components/admin/UserManagement.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatDate, formatRelativeTime, formatCurrency } from '@utils/formatters'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Modal from '@components/ui/Modal'
import Pagination from '@components/ui/Pagination'
import EmptyState from '@components/shared/EmptyState'
import CustomerTable from './CustomerTable'
import { Search, Filter, Download, Users, ShoppingBag, DollarSign, Calendar, UserX, UserCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function UserManagement({ userType = 'customer' }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  })

  const itemsPerPage = 20

  useEffect(() => {
    loadUsers()
  }, [statusFilter, sortBy, currentPage, userType])

  useEffect(() => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (statusFilter !== 'all') params.status = statusFilter
    if (sortBy !== 'recent') params.sort = sortBy
    setSearchParams(params)
  }, [searchTerm, statusFilter, sortBy])

  const loadUsers = async () => {
    try {
      setLoading(true)
      
      let q = query(
        collection(db, 'users'),
        where('role', '==', userType),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      let allUsers = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          const userData = { id: userDoc.id, ...userDoc.data() }
          
          const ordersSnap = await getDocs(
            query(collection(db, 'orders'), where('customerId', '==', userDoc.id))
          )
          
          const orders = ordersSnap.docs.map(doc => doc.data())
          const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
          const lastOrder = orders.length > 0 
            ? orders.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())[0]
            : null

          return {
            ...userData,
            orderCount: orders.length,
            totalSpent,
            lastOrderDate: lastOrder?.createdAt?.toDate() || null
          }
        })
      )

      if (statusFilter !== 'all') {
        allUsers = allUsers.filter(user => {
          if (statusFilter === 'active') {
            const daysSinceLastOrder = user.lastOrderDate 
              ? (new Date() - user.lastOrderDate) / (1000 * 60 * 60 * 24)
              : Infinity
            return daysSinceLastOrder <= 30
          } else {
            const daysSinceLastOrder = user.lastOrderDate 
              ? (new Date() - user.lastOrderDate) / (1000 * 60 * 60 * 24)
              : Infinity
            return daysSinceLastOrder > 30
          }
        })
      }

      if (sortBy === 'orders') {
        allUsers.sort((a, b) => b.orderCount - a.orderCount)
      } else if (sortBy === 'spending') {
        allUsers.sort((a, b) => b.totalSpent - a.totalSpent)
      } else if (sortBy === 'name') {
        allUsers.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''))
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        allUsers = allUsers.filter(user =>
          user.displayName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phoneNumber?.includes(term)
        )
      }

      const total = allUsers.length
      const pages = Math.ceil(total / itemsPerPage)
      const startIndex = (currentPage - 1) * itemsPerPage
      const paginatedUsers = allUsers.slice(startIndex, startIndex + itemsPerPage)

      setUsers(paginatedUsers)
      setTotalPages(pages)

      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const activeUsers = allUsers.filter(user => {
        const daysSinceLastOrder = user.lastOrderDate 
          ? (new Date() - user.lastOrderDate) / (1000 * 60 * 60 * 24)
          : Infinity
        return daysSinceLastOrder <= 30
      }).length

      const newThisMonth = allUsers.filter(user => 
        user.createdAt?.toDate() >= firstDayOfMonth
      ).length

      setStats({
        total,
        active: activeUsers,
        inactive: total - activeUsers,
        newThisMonth
      })
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Join Date', 'Orders', 'Total Spent', 'Last Order'].join(','),
      ...users.map(user => [
        user.displayName || '',
        user.email || '',
        user.phoneNumber || '',
        formatDate(user.createdAt?.toDate()),
        user.orderCount,
        user.totalSpent,
        user.lastOrderDate ? formatDate(user.lastOrderDate) : 'Never'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${userType}s-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Data exported successfully')
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteDoc(doc(db, 'users', selectedUser.id))
      toast.success('User deleted successfully')
      setShowDeleteModal(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active (Last 30 days)' },
    { value: 'inactive', label: 'Inactive' }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'orders', label: 'Most Orders' },
    { value: 'spending', label: 'Highest Spending' },
    { value: 'name', label: 'Name (A-Z)' }
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
            {userType === 'customer' ? 'Customer Management' : 'Supplier Management'}
          </h1>
          <p className="text-neutral-600">
            Manage and monitor all {userType}s
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: stats.total, color: 'blue', icon: Users },
            { label: 'Active', value: stats.active, color: 'green', icon: UserCheck },
            { label: 'Inactive', value: stats.inactive, color: 'amber', icon: UserX },
            { label: 'New This Month', value: stats.newThisMonth, color: 'purple', icon: Calendar }
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
                placeholder={`Search by name, email, or phone...`}
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                icon={Filter}
                className="min-w-[160px]"
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

        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try adjusting your filters or search criteria"
          />
        ) : (
          <>
            <CustomerTable
              users={users}
              onViewDetails={(user) => navigate(`/admin/${userType}s/${user.id}`)}
              onDelete={(user) => {
                setSelectedUser(user)
                setShowDeleteModal(true)
              }}
            />

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        title="Delete User"
      >
        <div className="p-6">
          <p className="text-neutral-700 mb-6">
            Are you sure you want to delete <strong>{selectedUser?.displayName}</strong>?
            This action cannot be undone and will remove all associated data.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}