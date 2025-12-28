// src/services/api.js

import { auth } from '@/config/firebase'

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || ''
  }
  
  async getAuthToken() {
    const user = auth.currentUser
    if (user) {
      return await user.getIdToken()
    }
    return null
  }
  
  async request(endpoint, options = {}) {
    const token = await this.getAuthToken()
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const config = {
      ...options,
      headers
    }
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `Request failed with status ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }
  
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return this.request(url, {
      method: 'GET'
    })
  }
  
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
  
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }
  
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }
  
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    })
  }
  
  async upload(endpoint, file, onProgress = null) {
    const token = await this.getAuthToken()
    const formData = new FormData()
    formData.append('file', file)
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            onProgress(percentComplete)
          }
        })
      }
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            resolve(xhr.responseText)
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })
      
      xhr.open('POST', `${this.baseURL}${endpoint}`)
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      xhr.send(formData)
    })
  }
}

export default new ApiService()