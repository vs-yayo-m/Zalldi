// src/utils/imageUtils.js

export const imageUtils = {
  getPlaceholderImage(width = 400, height = 400, text = 'No Image') {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23999'%3E${text}%3C/text%3E%3C/svg%3E`
  },
  
  generateThumbnail(file, maxWidth = 200, maxHeight = 200) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            resolve(blob)
          }, file.type)
        }
        
        img.onerror = reject
        img.src = e.target.result
      }
      
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
  
  cropImage(file, cropData) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = cropData.width
          canvas.height = cropData.height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(
            img,
            cropData.x,
            cropData.y,
            cropData.width,
            cropData.height,
            0,
            0,
            cropData.width,
            cropData.height
          )
          
          canvas.toBlob((blob) => {
            resolve(blob)
          }, file.type)
        }
        
        img.onerror = reject
        img.src = e.target.result
      }
      
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
  
  resizeImage(file, maxWidth, maxHeight, quality = 0.9) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(resizedFile)
            },
            file.type,
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
  
  convertToWebP(file, quality = 0.9) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob(
            (blob) => {
              const webpFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now()
              })
              resolve(webpFile)
            },
            'image/webp',
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
  
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height
          })
        }
        
        img.onerror = reject
        img.src = e.target.result
      }
      
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
  
  createImagePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
  
  validateImageDimensions(file, minWidth, minHeight, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      this.getImageDimensions(file)
        .then(({ width, height }) => {
          const errors = []
          
          if (minWidth && width < minWidth) {
            errors.push(`Width must be at least ${minWidth}px`)
          }
          if (minHeight && height < minHeight) {
            errors.push(`Height must be at least ${minHeight}px`)
          }
          if (maxWidth && width > maxWidth) {
            errors.push(`Width must not exceed ${maxWidth}px`)
          }
          if (maxHeight && height > maxHeight) {
            errors.push(`Height must not exceed ${maxHeight}px`)
          }
          
          if (errors.length > 0) {
            resolve({ valid: false, errors })
          } else {
            resolve({ valid: true, width, height })
          }
        })
        .catch(reject)
    })
  },
  
  optimizeImage(file, options = {}) {
    const {
      maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.85,
        convertToWebP = true
    } = options
    
    return new Promise(async (resolve, reject) => {
      try {
        let optimizedFile = file
        
        const dimensions = await this.getImageDimensions(file)
        if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
          optimizedFile = await this.resizeImage(file, maxWidth, maxHeight, quality)
        }
        
        if (convertToWebP && file.type !== 'image/webp') {
          optimizedFile = await this.convertToWebP(optimizedFile, quality)
        }
        
        resolve(optimizedFile)
      } catch (error) {
        reject(error)
      }
    })
  },
  
  getImageUrl(image) {
    if (!image) return this.getPlaceholderImage()
    if (typeof image === 'string') return image
    if (image instanceof File) return URL.createObjectURL(image)
    return this.getPlaceholderImage()
  },
  
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  },
  
  preloadImages(sources) {
    return Promise.all(sources.map(src => this.preloadImage(src)))
  }
}