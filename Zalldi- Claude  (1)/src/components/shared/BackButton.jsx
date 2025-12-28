// src/components/shared/BackButton.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function BackButton({ to, label = 'Back', className = '' }) {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={className}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}