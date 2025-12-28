// src/components/admin/SupplierVerification.jsx

import { useState } from 'react'
import { formatDate } from '@utils/formatters'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { Store, User, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function SupplierVerification({ supplier, onApprove, onReject, onClose }) {
  const [processing, setProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionForm, setShowRejectionForm] = useState(false)

  const handleApprove = async () => {
    setProcessing(true)
    await onApprove()
    setProcessing(false)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return
    }
    setProcessing(true)
    await onReject(rejectionReason)
    setProcessing(false)
  }

  const verificationChecklist = [
    {
      label: 'Business Name Provided',
      checked: !!supplier.businessName,
      required: true
    },
    {
      label: 'Valid Email Address',
      checked: !!supplier.email && supplier.email.includes('@'),
      required: true
    },
    {
      label: 'Phone Number Provided',
      checked: !!supplier.phoneNumber,
      required: true
    },
    {
      label: 'Business Address Provided',
      checked: !!supplier.businessAddress,
      required: true
    },
    {
      label: 'Profile Photo Uploaded',
      checked: !!supplier.photoURL,
      required: false
    }
  ]

  const allRequiredChecked = verificationChecklist
    .filter(item => item.required)
    .every(item => item.checked)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
            {supplier.photoURL ? (
              <img
                src={supplier.photoURL}
                alt={supplier.businessName}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <Store className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-1">
              {supplier.businessName || 'Unnamed Business'}
            </h3>
            <p className="text-neutral-600">
              Owner: {supplier.displayName || 'Unknown'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{supplier.email || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{supplier.phoneNumber || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">
              Joined {formatDate(supplier.createdAt?.toDate(), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{supplier.businessAddress || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Verification Checklist
        </h4>
        <div className="space-y-2">
          {verificationChecklist.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                item.checked ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.checked ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm ${item.checked ? 'text-green-800' : 'text-red-800'}`}>
                  {item.label}
                </span>
              </div>
              <div>
                {item.required && (
                  <Badge variant={item.checked ? 'green' : 'red'} size="sm">
                    {item.required ? 'Required' : 'Optional'}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Verification Guidelines</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify all required information is accurate and complete</li>
              <li>Check business legitimacy if possible</li>
              <li>Ensure contact information is valid</li>
              <li>Approve only if you're confident about the supplier's authenticity</li>
            </ul>
          </div>
        </div>
      </div>

      {showRejectionForm ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Rejection Reason (Required)
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>
      ) : null}

      <div className="flex gap-3">
        {!showRejectionForm ? (
          <>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRejectionForm(true)}
              icon={XCircle}
              className="flex-1 text-red-600 hover:bg-red-50"
              disabled={processing}
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              icon={CheckCircle}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={processing || !allRequiredChecked}
            >
              {processing ? 'Approving...' : 'Approve Supplier'}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionForm(false)
                setRejectionReason('')
              }}
              className="flex-1"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              icon={XCircle}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </>
        )}
      </div>

      {!allRequiredChecked && !showRejectionForm && (
        <p className="text-sm text-amber-600 text-center mt-3">
          ⚠️ Cannot approve: Some required information is missing
        </p>
      )}
    </div>
  )
}