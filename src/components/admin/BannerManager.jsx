// src/components/admin/BannerManager.jsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@config/firebase'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Modal from '@components/ui/Modal'
import { Plus, Edit, Trash2, Image as ImageIcon, Link as LinkIcon, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function BannerManager() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'home-hero',
    active: true,
    order: 0
  })

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, 'banners'))
      const bannersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.order - b.order)
      setBanners(bannersData)
    } catch (error) {
      console.error('Error loading banners:', error)
      toast.error('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingBanner) {
        await updateDoc(doc(db, 'banners', editingBanner.id), {
          ...formData,
          updatedAt: new Date()
        })
        toast.success('Banner updated successfully')
      } else {
        await addDoc(collection(db, 'banners'), {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        toast.success('Banner created successfully')
      }
      
      setShowModal(false)
      setEditingBanner(null)
      resetForm()
      loadBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('Failed to save banner')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'home-hero',
      active: true,
      order: 0
    })
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      position: banner.position,
      active: banner.active,
      order: banner.order
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      await deleteDoc(doc(db, 'banners', id))
      toast.success('Banner deleted successfully')
      loadBanners()
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Failed to delete banner')
    }
  }

  const toggleActive = async (banner) => {
    try {
      await updateDoc(doc(db, 'banners', banner.id), {
        active: !banner.active,
        updatedAt: new Date()
      })
      toast.success(`Banner ${!banner.active ? 'activated' : 'deactivated'}`)
      loadBanners()
    } catch (error) {
      console.error('Error toggling banner:', error)
      toast.error('Failed to update banner')
    }
  }

  const positions = [
    { value: 'home-hero', label: 'Home Hero' },
    { value: 'home-secondary', label: 'Home Secondary' },
    { value: 'shop-top', label: 'Shop Top' },
    { value: 'category-top', label: 'Category Top' }
  ]

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-neutral-200 rounded"></div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">
          Website Banners
        </h3>
        <Button onClick={() => setShowModal(true)} icon={Plus}>
          Add Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600">No banners created yet</p>
          <Button
            variant="outline"
            onClick={() => setShowModal(true)}
            className="mt-4"
            icon={Plus}
          >
            Create First Banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="border border-neutral-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
            >
              <div className="relative aspect-video bg-neutral-100">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-neutral-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant={banner.active ? 'green' : 'red'} size="sm">
                    {banner.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-neutral-800 mb-1">
                  {banner.title}
                </h4>
                <p className="text-sm text-neutral-600 mb-2">
                  {banner.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                  <span className="capitalize">{banner.position.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>Order: {banner.order}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(banner)}
                    icon={banner.active ? EyeOff : Eye}
                  >
                    {banner.active ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(banner)}
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(banner.id)}
                    icon={Trash2}
                    className="text-red-600 hover:bg-red-50"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingBanner(null)
          resetForm()
        }}
        title={editingBanner ? 'Edit Banner' : 'Create Banner'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <Input
              label="Banner Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                rows={2}
              />
            </div>

            <Input
              label="Image URL"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/banner.jpg"
              icon={ImageIcon}
              required
            />

            <Input
              label="Link URL (Optional)"
              type="url"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="https://example.com/page"
              icon={LinkIcon}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {positions.map(pos => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Display Order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="banner-active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-neutral-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="banner-active" className="text-sm text-neutral-700">
                Banner Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingBanner(null)
                resetForm()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingBanner ? 'Update' : 'Create'} Banner
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}