// src/pages/Home.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Shield, Clock, Star, ArrowRight, Package, Zap } from 'lucide-react'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import Button from '@components/ui/Button'
import { FadeInWhenVisible } from '@components/animations/FadeIn'
import { productService } from '@services/product.service'
import ProductCard from '@components/customer/ProductCard'
import CategoryCard from '@components/customer/CategoryCard'
import { CATEGORIES, ROUTES } from '@utils/constants'

export default function Home() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchFeaturedProducts()
  }, [])
  
  const fetchFeaturedProducts = async () => {
    try {
      const products = await productService.getFeaturedProducts(8)
      setFeaturedProducts(products)
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible direction="left">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-body-sm font-semibold mb-6"
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  1-Hour Delivery
                </motion.div>
                
                <h1 className="text-hero font-display font-extrabold text-neutral-800 mb-6">
                  Everything You Need, <span className="text-orange-500">Delivered in 1 Hour</span>
                </h1>
                
                <p className="text-body-lg text-neutral-600 mb-8">
                  Shop from 5000+ products across all categories. Fresh groceries, daily essentials, and more - delivered to your doorstep in just 60 minutes.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => navigate(ROUTES.SHOP)}>
                    Start Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.HOW_IT_WORKS)}>
                    How It Works
                  </Button>
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible direction="right" delay={0.2}>
              <div className="relative">
                <img
                  src="/images/hero-banner.webp"
                  alt="Shopping"
                  className="rounded-2xl shadow-2xl"
                  onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23FF6B35"%3ESale Banner%3C/text%3E%3C/svg%3E'}
                />
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: '1-Hour Delivery', desc: 'Lightning fast service' },
              { icon: Package, title: '5000+ Products', desc: 'Everything you need' },
              { icon: Shield, title: 'Quality Assured', desc: 'Fresh & verified' },
              { icon: Clock, title: '6 AM - 11 PM', desc: 'Open daily' }
            ].map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 mb-2">{feature.title}</h3>
                  <p className="text-body-sm text-neutral-500">{feature.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-display font-display font-bold text-neutral-800 mb-2">
                Shop by Category
              </h2>
              <p className="text-body text-neutral-600">
                Browse through our wide range of categories
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate(ROUTES.SHOP)}>
              View All
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.slice(0, 6).map((category, index) => (
              <FadeInWhenVisible key={category.id} delay={index * 0.1}>
                <CategoryCard category={category} />
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-display font-display font-bold text-neutral-800 mb-2">
                Featured Products
              </h2>
              <p className="text-body text-neutral-600">
                Handpicked favorites for you
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate(ROUTES.SHOP)}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-neutral-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <FadeInWhenVisible key={product.id} delay={index * 0.1}>
                  <ProductCard product={product} />
                </FadeInWhenVisible>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInWhenVisible>
            <h2 className="text-display font-display font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-body-lg text-orange-50 mb-8">
              Join thousands of happy customers in Butwal enjoying 1-hour delivery
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate(ROUTES.SHOP)}
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping Now
            </Button>
          </FadeInWhenVisible>
        </div>
      </section>

      <Footer />
    </div>
  )
}