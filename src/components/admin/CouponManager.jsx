// src/components/admin/CouponManager.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatDate, formatCurrency } from '@utils/formatters'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Modal from '@components/ui/Modal'
import { Plus, Edit, Trash2, Ticket, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CouponManager() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 0,
    expiryDate: '',
    active: true
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, 'coupons'))
      const couponsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        usedCount: doc.data().usedCount || 0
      }))
      setCoupons(couponsData)
    } catch (error) {
      console.error('Error loading coupons:', error)
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const couponData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: Number(formData.maxDiscount),
        usageLimit: Number(formData.usageLimit)
      }

      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), {
          ...couponData,
          updatedAt: new Date()
        })
        toast.success('Coupon updated successfully')
      } else {
        await addDoc(collection(db, 'coupons'), {
          ...couponData,
          usedCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        toast.success('Coupon created successfully')
      }
      
      setShowModal(false)
      setEditingCoupon(null)
      resetForm()
      loadCoupons()
    } catch (error) {
      console.error('Error saving coupon:', error)
      toast.error('Failed to save coupon')
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      usageLimit: 0,
      expiryDate: '',
      active: true
    })
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      expiryDate: coupon.expiryDate,
      active: coupon.active
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    
    try {
      await deleteDoc(doc(db, 'coupons', id))
      toast.success('Coupon deleted successfully')
      loadCoupons()
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast.error('Failed to delete coupon')
    }
  }

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Coupon code copied!')
  }

  const getCouponStatus = (coupon) => {
    if (!coupon.active) return { label: 'Inactive', color: 'neutral' }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { label: 'Expired', color: 'red' }
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return { label: 'Limit Reached', color: 'red' }
    }
    return { label: 'Active', color: 'green' }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-neutral-200 rounded"></div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">
          Discount Coupons
        </h3>
        <Button onClick={() => setShowModal(true)} icon={Plus}>
          Create Coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600">No coupons created yet</p>
          <Button
            variant="outline"
            onClick={() => setShowModal(true)}
            className="mt-4"
            icon={Plus}
          >
            Create First Coupon
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon, index) => {
            const status = getCouponStatus(coupon)
            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-4 py-2 bg-orange-100 rounded-lg font-mono font-bold text-orange-600 flex items-center gap-2">
                        {coupon.code}
                        <button
                          onClick={() => copyCouponCode(coupon.code)}
                          className="hover:text-orange-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <Badge variant={status.color} size="sm">
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      {coupon.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(coupon)}
                      icon={Edit}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(coupon.id)}
                      icon={Trash2}
                      className="text-red-600 hover:bg-red-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">Discount</p>
                    <p className="font-semibold text-neutral-800">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}%` 
                        : formatCurrency(coupon.discountValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">Min Order</p>
                    <p className="font-semibold text-neutral-800">
                      {formatCurrency(coupon.minOrderValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">Usage</p>
                    <p className="font-semibold text-neutral-800">
                      {coupon.usedCount}/{coupon.usageLimit || '∞'}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs mb-1">Expires</p>
                    <p className="font-semibold text-neutral-800">
                      {coupon.expiryDate ? formatDate(new Date(coupon.expiryDate), 'MMM d, yyyy') : 'Never'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingCoupon(null)
          resetForm()
        }}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Get 20% off on all orders"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <Input
                label="Discount Value"
                type="number"
                min="0"
                step="0.01"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Order Value"
                type="number"
                min="0"
                step="0.01"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="0"
              />

              <Input
                label="Max Discount (Optional)"
                type="number"
                min="0"
                step="0.01"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="0 for unlimited"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Usage Limit"
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="0 for unlimited"
              />

              <Input
                label="Expiry Date (Optional)"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="coupon-active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-neutral-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="coupon-active" className="text-sm text-neutral-700">
                Coupon Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingCoupon(null)
                resetForm()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingCoupon ? 'Update' : 'Create'} Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}