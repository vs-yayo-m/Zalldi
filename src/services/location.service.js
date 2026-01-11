// src/services/location.service.js

/**
 * Location Service - Handles geolocation and map link generation
 */

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        resolve({
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString()
        })
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        
        reject(new Error(errorMessage))
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
          'User-Agent': 'Zalldi Quick Commerce App'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Geocoding failed')
    }
    
    const data = await response.json()
    
    if (!data || !data.address) {
      throw new Error('No address found')
    }
    
    const addr = data.address
    
    // Extract ward number
    let ward = ''
    if (addr.suburb) {
      const wardMatch = addr.suburb.match(/ward[\s-]?(\d+)/i)
      if (wardMatch) ward = wardMatch[1]
    }
    
    return {
      ward: ward || '',
      area: addr.suburb || addr.neighbourhood || addr.hamlet || '',
      street: addr.road || '',
      landmark: addr.amenity || addr.building || '',
      city: addr.city || addr.town || addr.village || 'Butwal',
      district: addr.state_district || '',
      state: addr.state || '',
      country: addr.country || 'Nepal',
      postcode: addr.postcode || '',
      displayName: data.display_name || '',
      formattedAddress: [
        addr.road,
        addr.suburb || addr.neighbourhood,
        addr.city || addr.town,
        addr.postcode
      ].filter(Boolean).join(', ')
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    throw error
  }
}

export const generateGoogleMapsLink = (latitude, longitude, label = 'Delivery Location') => {
  // Encode label for URL
  const encodedLabel = encodeURIComponent(label)
  
  // Google Maps link that opens in app or browser
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodedLabel}`
}

export const generateGoogleMapsDirectionsLink = (latitude, longitude) => {
  // Opens Google Maps with directions from current location
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
}

export const generateMapPreviewUrl = (latitude, longitude, zoom = 15) => {
  // Static map image URL (using OpenStreetMap based services)
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula to calculate distance in kilometers
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

const toRad = (degrees) => {
  return degrees * (Math.PI / 180)
}

export const formatCoordinates = (latitude, longitude) => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
}

export const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  )
}

export const getLocationPermissionStatus = async () => {
  if (!navigator.permissions) {
    return 'unsupported'
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state // 'granted', 'denied', or 'prompt'
  } catch (error) {
    return 'unsupported'
  }
}