// src/utils/seo.js

import { APP_NAME, APP_URL } from './constants'

export const seoUtils = {
  setTitle(title) {
    if (title) {
      document.title = `${title} | ${APP_NAME}`
    } else {
      document.title = `${APP_NAME} - Order now, delivered in 1 hour`
    }
  },
  
  setMetaDescription(description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
  },
  
  setMetaKeywords(keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords.join(', '))
    }
  },
  
  setCanonicalUrl(url) {
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url || window.location.href)
  },
  
  setOpenGraphTags(data) {
    const ogTags = {
      'og:title': data.title || document.title,
      'og:description': data.description || '',
      'og:image': data.image || `${APP_URL}/logo.png`,
      'og:url': data.url || window.location.href,
      'og:type': data.type || 'website',
      'og:site_name': APP_NAME
    }
    
    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    })
  },
  
  setTwitterCardTags(data) {
    const twitterTags = {
      'twitter:card': data.card || 'summary_large_image',
      'twitter:title': data.title || document.title,
      'twitter:description': data.description || '',
      'twitter:image': data.image || `${APP_URL}/logo.png`
    }
    
    Object.entries(twitterTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    })
  },
  
  setPageMeta(data) {
    this.setTitle(data.title)
    
    if (data.description) {
      this.setMetaDescription(data.description)
    }
    
    if (data.keywords) {
      this.setMetaKeywords(data.keywords)
    }
    
    this.setCanonicalUrl(data.url)
    this.setOpenGraphTags(data)
    this.setTwitterCardTags(data)
  },
  
  setProductPageMeta(product) {
    this.setPageMeta({
      title: product.name,
      description: product.description,
      keywords: [product.name, product.category, 'buy online', 'Butwal', 'Nepal'],
      image: product.images?.[0] || '',
      type: 'product',
      url: `${APP_URL}/product/${product.slug}`
    })
  },
  
  setCategoryPageMeta(category) {
    this.setPageMeta({
      title: `${category.name} - Shop Online`,
      description: `Browse and shop ${category.name.toLowerCase()} online in Butwal. Fast delivery in 1 hour.`,
      keywords: [category.name, 'shop online', 'Butwal', 'quick delivery'],
      url: `${APP_URL}/category/${category.id}`
    })
  },
  
  generateStructuredData(type, data) {
    const baseData = {
      '@context': 'https://schema.org'
    }
    
    let structuredData = {}
    
    switch (type) {
      case 'organization':
        structuredData = {
          ...baseData,
          '@type': 'Organization',
          name: APP_NAME,
          url: APP_URL,
          logo: `${APP_URL}/logo.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: data.phone,
            contactType: 'customer service',
            email: data.email
          },
          sameAs: data.socialLinks || []
        }
        break
        
      case 'product':
        structuredData = {
          ...baseData,
          '@type': 'Product',
          name: data.name,
          image: data.images || [],
          description: data.description,
          sku: data.sku,
          brand: {
            '@type': 'Brand',
            name: data.brand || APP_NAME
          },
          offers: {
            '@type': 'Offer',
            url: `${APP_URL}/product/${data.slug}`,
            priceCurrency: 'NPR',
            price: data.price,
            availability: data.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          aggregateRating: data.reviewCount > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount
          } : undefined
        }
        break
        
      case 'breadcrumb':
        structuredData = {
          ...baseData,
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${APP_URL}${item.url}`
          }))
        }
        break
        
      case 'localbusiness':
        structuredData = {
          ...baseData,
          '@type': 'LocalBusiness',
          name: APP_NAME,
          image: `${APP_URL}/logo.png`,
          '@id': APP_URL,
          url: APP_URL,
          telephone: data.phone,
          email: data.email,
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Butwal',
            addressCountry: 'NP'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.lat || 27.7,
            longitude: data.lng || 83.45
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '06:00',
            closes: '23:00'
          }
        }
        break
        
      default:
        return null
    }
    
    return structuredData
  },
  
  injectStructuredData(type, data) {
    const structuredData = this.generateStructuredData(type, data)
    if (!structuredData) return
    
    const scriptId = `structured-data-${type}`
    let script = document.getElementById(scriptId)
    
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    
    script.textContent = JSON.stringify(structuredData)
  },
  
  removeStructuredData(type) {
    const scriptId = `structured-data-${type}`
    const script = document.getElementById(scriptId)
    if (script) {
      script.remove()
    }
  },
  
  setNoIndex(value = true) {
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', value ? 'noindex, nofollow' : 'index, follow')
  }
}