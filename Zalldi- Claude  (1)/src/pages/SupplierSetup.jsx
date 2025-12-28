// src/pages/SupplierSetup.jsx
// TEMPORARY FILE - Use this once to create supplier, then delete this file

import { useState } from 'react'
import { auth, db } from '@config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import toast from 'react-hot-toast'

export default function SupplierSetup() {
  const [formData, setFormData] = useState({
    email: 'supplier@zalldi.com',
    password: 'Supplier@123456',
    displayName: 'Official Supplier',
    businessName: 'Zalldi Official Store',
    businessPhone: '+9779821072912',
    businessAddress: 'Ward 1, Butwal, Nepal'
  })
  const [loading, setLoading] = useState(false)
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const createSupplier = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = userCredential.user
      
      // Create supplier document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email,
        displayName: formData.displayName,
        role: 'supplier',
        phoneNumber: formData.businessPhone,
        photoURL: null,
        
        // Supplier specific fields
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        businessPhone: formData.businessPhone,
        businessEmail: formData.email,
        verified: true, // Set to true for official supplier
        rating: 5.0,
        reviewCount: 0,
        
        // Stats
        productsCount: 0,
        ordersCount: 0,
        totalRevenue: 0,
        
        // Settings
        notifications: {
          email: true,
          push: true,
          sms: true
        },
        
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      toast.success('✅ Supplier account created successfully!')
      
      alert(`
✅ Supplier Account Created Successfully! 

📧 Email: ${formData.email}
🔑 Password: ${formData.password}
🏪 Business: ${formData.businessName}
🆔 UID: ${user.uid}

Now you can:
1. Logout from admin account
2. Go to /login
3. Login with supplier credentials
4. Access supplier dashboard at /supplier/dashboard
5. Delete this SupplierSetup.jsx file
      `)
      
    } catch (error) {
      console.error('Error:', error)
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Try a different email.')
      } else {
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">🏪 Supplier Setup</h1>
          <p className="text-neutral-600">Create official supplier account</p>
          <p className="text-sm text-orange-600 mt-2">⚠️ Use this once, then delete this file</p>
        </div>

        <form onSubmit={createSupplier} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="supplier@zalldi.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Contact Person Name
            </label>
            <Input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Business Name
            </label>
            <Input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Store Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Business Phone
            </label>
            <Input
              type="tel"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleChange}
              placeholder="+977 98xxxxxxxx"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Business Address
            </label>
            <Input
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Ward, Area, Butwal"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating Supplier...' : '✅ Create Supplier Account'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-neutral-700 font-semibold mb-2">
            ✨ Supplier Features:
          </p>
          <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
            <li>Add and manage products</li>
            <li>Receive and fulfill orders</li>
            <li>Track inventory and stock</li>
            <li>View sales analytics</li>
            <li>Manage customer reviews</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-neutral-700 font-semibold mb-2">
            📋 After creating:
          </p>
          <ol className="text-sm text-neutral-600 space-y-1 list-decimal list-inside">
            <li>Save the credentials</li>
            <li>Logout from current account</li>
            <li>Go to /login</li>
            <li>Login as supplier</li>
            <li>Delete this file</li>
          </ol>
        </div>
      </div>
    </div>
  )
}