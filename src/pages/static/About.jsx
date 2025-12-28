// src/pages/static/About.jsx

import { motion } from 'framer-motion'
import { FOUNDER, APP_NAME, CONTACT } from '@utils/constants'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import { Target, Zap, Users, Heart, MapPin, Clock } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Zap,
      title: '1-Hour Delivery',
      description: 'Lightning-fast delivery to your doorstep within 60 minutes, guaranteed.'
    },
    {
      icon: Users,
      title: 'Local First',
      description: 'By Butwal, for Butwal. Supporting local businesses and community growth.'
    },
    {
      icon: Heart,
      title: 'Quality Assured',
      description: 'Every product verified and quality-checked before reaching you.'
    },
    {
      icon: Target,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. 24/7 support and hassle-free returns.'
    }
  ]

  const values = [
    { title: 'Speed', description: 'Lightning-fast delivery, instant responses' },
    { title: 'Trust', description: 'Transparent pricing, verified products' },
    { title: 'Local', description: 'By Butwal, for Butwal community' },
    { title: 'Premium', description: 'High-quality service, professional platform' },
    { title: 'Innovation', description: 'Cutting-edge technology, modern solutions' },
    { title: 'Reliability', description: 'Consistent service, dependable delivery' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About {APP_NAME}
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Revolutionizing quick commerce in Butwal with 1-hour delivery and premium service
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                {APP_NAME} was founded with a simple mission: to bring the convenience of modern quick commerce 
                to Butwal. We recognized that people's time is valuable, and getting daily essentials shouldn't 
                be a hassle.
              </p>
              <p>
                Starting in 2024, we've built a platform that combines cutting-edge technology with local 
                expertise. Our dark store model ensures quality control while our dedicated delivery fleet 
                guarantees speed.
              </p>
              <p>
                Today, we serve all 19 wards of Butwal with a commitment to 1-hour delivery, making us the 
                fastest and most reliable quick commerce platform in the region.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                  {FOUNDER.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-800">
                    {FOUNDER.name}
                  </h3>
                  <p className="text-neutral-600">Founder & CEO</p>
                </div>
              </div>
              <p className="text-neutral-700 italic leading-relaxed">
                "{FOUNDER.message}"
              </p>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-neutral-800 mb-8 text-center">
            Why Choose {APP_NAME}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-card-hover transition-shadow h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-neutral-800 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-card-hover transition-shadow">
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Join Our Journey
            </h2>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Whether you're a customer looking for convenience or a supplier wanting to grow your business, 
              we'd love to have you as part of the {APP_NAME} family.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                className="bg-white text-orange-600 hover:bg-orange-50"
                onClick={() => window.location.href = '/shop'}
              >
                Start Shopping
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}