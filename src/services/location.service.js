// src/services/location.service.js

/**
 * ZALLDI LOCATION SERVICE
 * Handles geolocation capture, reverse geocoding, and map link generation
 */

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  })
}

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    )
    
    if (!response.ok) throw new Error('Geocoding failed')
    
    const data = await response.json()
    
    if (!data || !data.address) {
      throw new Error('No address data found')
    }
    
    return {
      formattedAddress: data.display_name,
      address: data.address,
      ward: extractWardNumber(data.address),
      area: data.address.suburb || data.address.neighbourhood || data.address.hamlet || '',
      street: data.address.road || '',
      city: data.address.city || data.address.town || 'Butwal',
      landmark: data.address.amenity || data.address.building || ''
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    throw error
  }
}

const extractWardNumber = (address) => {
  const wardFields = [
    address.suburb,
    address.neighbourhood,
    address.hamlet,
    address.county
  ]
  
  for (const field of wardFields) {
    if (!field) continue
    const wardMatch = field.match(/ward[\s-]?(\d+)/i)
    if (wardMatch) return wardMatch[1]
  }
  
  return ''
}

export const generateGoogleMapsLink = (latitude, longitude, label = '') => {
  if (label) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(label)}`
  }
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

export const generateAppleMapsLink = (latitude, longitude) => {
  return `http://maps.apple.com/?ll=${latitude},${longitude}&q=Delivery Location`
}

export const generateWazeMapsLink = (latitude, longitude) => {
  return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
}

export const getDirectionsLink = (fromLat, fromLng, toLat, toLng) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`
}

export const generateStaticMapImage = (latitude, longitude, zoom = 15, width = 400, height = 300) => {
  // Using OpenStreetMap static image (free alternative to Google Static Maps)
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance.toFixed(2)
}

const toRad = (degrees) => {
  return degrees * (Math.PI / 180)
}

export const isWithinButwalBounds = (latitude, longitude) => {
  // Butwal approximate bounds
  const bounds = {
    north: 27.7200,
    south: 27.6700,
    east: 83.4800,
    west: 83.4200
  }
  
  return (
    latitude >= bounds.south &&
    latitude <= bounds.north &&
    longitude >= bounds.west &&
    longitude <= bounds.east
  )
}