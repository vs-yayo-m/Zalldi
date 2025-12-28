// src/services/upload.service.js

import { storage } from '@config/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { generateId } from '@utils/helpers'

export const uploadService = {
  async uploadImage(file, folder = 'images') {
    try {
      const fileExtension = file.name.split('.').pop()
      const fileName = `${generateId()}.${fileExtension}`
      const filePath = `${folder}/${fileName}`
      
      const storageRef = ref(storage, filePath)
      
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type
      })
      
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return {
        url: downloadURL,
        path: filePath,
        name: fileName
      }
    } catch (error) {
      throw error
    }
  },
  
  async uploadMultipleImages(files, folder = 'images') {
    try {
      const uploadPromises = Array.from(files).map(file =>
        this.uploadImage(file, folder)
      )
      
      const results = await Promise.all(uploadPromises)
      return results
    } catch (error) {
      throw error
    }
  },
  
  async uploadProductImage(file, productId) {
    try {
      return await this.uploadImage(file, `products/${productId}`)
    } catch (error) {
      throw error
    }
  },
  
  async uploadProductImages(files, productId) {
    try {
      return await this.uploadMultipleImages(files, `products/${productId}`)
    } catch (error) {
      throw error
    }
  },
  
  async uploadUserAvatar(file, userId) {
    try {
      return await this.uploadImage(file, `users/${userId}/avatar`)
    } catch (error) {
      throw error
    }
  },
  
  async deleteImage(imagePath) {
    try {
      const storageRef = ref(storage, imagePath)
      await deleteObject(storageRef)
      return { success: true }
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return { success: true }
      }
      throw error
    }
  },
  
  async deleteMultipleImages(imagePaths) {
    try {
      const deletePromises = imagePaths.map(path => this.deleteImage(path))
      await Promise.all(deletePromises)
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  async compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            },
            'image/jpeg',
            quality
          )
        }
        
        img.onerror = reject
        img.src = e.target.result
      }
      
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
  
  async uploadCompressedImage(file, folder = 'images') {
    try {
      const compressedFile = await this.compressImage(file)
      return await this.uploadImage(compressedFile, folder)
    } catch (error) {
      throw error
    }
  },
  
  getImageUrl(path) {
    if (!path) return null
    if (path.startsWith('http')) return path
    
    try {
      const storageRef = ref(storage, path)
      return getDownloadURL(storageRef)
    } catch (error) {
      return null
    }
  },
  
  extractPathFromUrl(url) {
    if (!url) return null
    
    try {
      const urlObj = new URL(url)
      const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/)
      
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1])
      }
      
      return null
    } catch (error) {
      return null
    }
  }
}