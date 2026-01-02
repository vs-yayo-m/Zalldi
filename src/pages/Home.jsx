// src/pages/Home.jsx

import { useEffect } from 'react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import SearchSection from '@components/layout/SearchSection'
import HeroSection from '@components/layout/HeroSection'
import PromoStripSection from '@components/layout/PromoStripSection'
import CategoriesSection from '@components/layout/CategoriesSection'
import ProductDiscoverySection from '@components/layout/ProductDiscoverySection'
import FeaturedProductsSection from '@components/layout/FeaturedProductsSection'
import TrustSection from '@components/layout/TrustSection'
import { seoUtils } from '@utils/seo'

export default function Home() {
  useEffect(() => {
    seoUtils.setPageMeta({
      title: 'Zalldi - Fast 1-Hour Delivery in Butwal',
      description: 'Shop groceries, vegetables, fruits, and daily essentials online in Butwal. Get everything delivered in just 1 hour. Premium quick commerce service.',
      keywords: ['online shopping Butwal', 'grocery delivery Nepal', 'quick commerce', '1 hour delivery'],
      url: window.location.href
    })
    
    seoUtils.injectStructuredData('organization', {
      phone: '+977-9821072912',
      email: 'support.zalldi@gmail.com',
      socialLinks: [
        'https://www.instagram.com/zalldi.com.np',
        'https://www.instagram.com/sharma_vishal_o'
      ]
    })
    
    seoUtils.injectStructuredData('localbusiness', {
      phone: '+977-9821072912',
      email: 'support.zalldi@gmail.com',
      lat: 27.7,
      lng: 83.45
    })
  }, [])
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <SearchSection />
      
      <main>
        <HeroSection />
        
        <PromoStripSection />
        
        <CategoriesSection />
        
        <ProductDiscoverySection />
        
        <FeaturedProductsSection />
        
        <TrustSection />
      </main>
      
      <Footer />
    </div>
  )
}