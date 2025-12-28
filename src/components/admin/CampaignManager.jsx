// src/components/admin/CampaignManager.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@config/firebase'
import { formatDate } from '@utils/formatters'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Modal from '@components/ui/Modal'
import { Plus, Edit, Trash2, Calendar, Users, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    targetAudience: 'all',
    discount: 0,
    active: true
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, 'campaigns'))
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCampaigns(campaignsData)
    } catch (error) {
      console.error('Error loading campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingCampaign) {
        await updateDoc(doc(db, 'campaigns', editingCampaign.id), {
          ...formData,
          updatedAt: new Date()
        })
        toast.success('Campaign updated successfully')
      } else {
        await addDoc(collection(db, 'campaigns'), {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        toast.success('Campaign created successfully')
      }
      
      setShowModal(false)
      setEditingCampaign(null)
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        targetAudience: 'all',
        discount: 0,
        active: true
      })
      loadCampaigns()
    } catch (error) {
      console.error('Error saving campaign:', error)
      toast.error('Failed to save campaign')
    }
  }

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      name: campaign.name,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetAudience: campaign.targetAudience,
      discount: campaign.discount,
      active: campaign.active
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    
    try {
      await deleteDoc(doc(db, 'campaigns', id))
      toast.success('Campaign deleted successfully')
      loadCampaigns()
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign')
    }
  }

  const getCampaignStatus = (campaign) => {
    const now = new Date()
    const start = new Date(campaign.startDate)
    const end = new Date(campaign.endDate)
    
    if (!campaign.active) return { label: 'Inactive', color: 'neutral' }
    if (now < start) return { label: 'Scheduled', color: 'blue' }
    if (now > end) return { label: 'Ended', color: 'red' }
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
          Marketing Campaigns
        </h3>
        <Button onClick={() => setShowModal(true)} icon={Plus}>
          Create Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600">No campaigns yet</p>
          <Button
            variant="outline"
            onClick={() => setShowModal(true)}
            className="mt-4"
            icon={Plus}
          >
            Create First Campaign
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign, index) => {
            const status = getCampaignStatus(campaign)
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-neutral-800">
                        {campaign.name}
                      </h4>
                      <Badge variant={status.color} size="sm">
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {campaign.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(campaign)}
                      icon={Edit}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(campaign.id)}
                      icon={Trash2}
                      className="text-red-600 hover:bg-red-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-700">
                      {formatDate(new Date(campaign.startDate), 'MMM d')} - {formatDate(new Date(campaign.endDate), 'MMM d')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-700 capitalize">
                      {campaign.targetAudience}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-700">
                      {campaign.discount}% discount
                    </span>
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
          setEditingCampaign(null)
          setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            targetAudience: 'all',
            discount: 0,
            active: true
          })
        }}
        title={editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <Input
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="new">New Customers</option>
                <option value="returning">Returning Customers</option>
                <option value="vip">VIP Customers</option>
              </select>
            </div>

            <Input
              label="Discount Percentage"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
              required
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-neutral-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="active" className="text-sm text-neutral-700">
                Campaign Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingCampaign(null)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingCampaign ? 'Update' : 'Create'} Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}