// src/components/shared/ImageUploader.jsx

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@components/ui/Button'
import { validateImageFile } from '@utils/validators'
import { formatFileSize } from '@utils/formatters'
import toast from 'react-hot-toast'

export default function ImageUploader({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  className = ''
}) {
  const [previews, setPreviews] = useState(value)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files)
    
    if (previews.length + fileArray.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`)
      return
    }
    
    const validFiles = []
    const newPreviews = []
    
    fileArray.forEach(file => {
      const error = validateImageFile(file)
      if (error) {
        toast.error(error)
        return
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size: ${formatFileSize(maxSize)}`)
        return
      }
      
      validFiles.push(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push({
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        })
        
        if (newPreviews.length === validFiles.length) {
          const updated = [...previews, ...newPreviews]
          setPreviews(updated)
          if (onChange) onChange(updated)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }
  
  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    if (onChange) onChange(updated)
  }
  
  const openFileDialog = () => {
    fileInputRef.current?.click()
  }
  
  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 hover:border-orange-500 hover:bg-orange-50/50
          ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-neutral-300 bg-white'}
        `}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-orange-100' : 'bg-neutral-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-orange-500' : 'text-neutral-400'}`} />
          </div>
          
          <div>
            <p className="text-body font-medium text-neutral-800 mb-1">
              {isDragging ? 'Drop images here' : 'Upload Images'}
            </p>
            <p className="text-body-sm text-neutral-500">
              Drag and drop or click to browse
            </p>
            <p className="text-caption text-neutral-400 mt-1">
              PNG, JPG, WebP up to {formatFileSize(maxSize)} • Max {maxFiles} images
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
          >
            {previews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-100"
              >
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(index)
                    }}
                    className="bg-white/90 hover:bg-white text-neutral-800"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-caption text-white truncate">{item.name}</p>
                  <p className="text-caption text-white/80">{formatFileSize(item.size)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}