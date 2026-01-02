// src/components/layout/TrustSection.jsx

import { motion } from 'framer-motion'
import { Shield, Clock, ThumbsUp, Leaf, Award, Users } from 'lucide-react'
import { FadeInWhenVisible } from '@components/animations/FadeIn'

const trustPoints = [
  {
    icon: Clock,
    title: 'Lightning Fast Delivery',
    description: 'Free delivery in minutes to your doorstep',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: Shield,
    title: '100% Secure Payments',
    description: 'Your transactions are completely safe with us',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Leaf,
    title: 'Fresh & Quality Products',
    description: 'We deliver only the freshest products daily',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: ThumbsUp,
    title: 'Customer Satisfaction',
    description: '95%+ customer satisfaction rate',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Award,
    title: 'Verified Suppliers',
    description: 'All our suppliers are verified and trusted',
    color: 'from-amber-500 to-amber-600'
  },
  {
    icon: Users,
    title: 'Local Community',
    description: 'Supporting local businesses in Butwal',
    color: 'from-pink-500 to-pink-600'
  }
]

const stats = [
  { number: '5000+', label: 'Products' },
  { number: '1000+', label: 'Happy Customers' },
  { number: '50+', label: 'Local Suppliers' },
  { number: '99%', label: 'On-Time Delivery' }
]

export default function TrustSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <FadeInWhenVisible>
          <div className="text-center mb-12">
            <h2 className="text-display font-display font-bold text-neutral-800 mb-4">
              Why Choose Zalldi?
            </h2>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
              We're committed to providing the best quick commerce experience in Butwal
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {trustPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${point.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-title font-semibold text-neutral-800 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-body text-neutral-600">
                    {point.description}
                  </p>
                </motion.div>
              </FadeInWhenVisible>
            )
          })}
        </div>

        <FadeInWhenVisible>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-display font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible>
          <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-heading font-display font-bold text-neutral-800 mb-4">
                Our Guarantee to You
              </h3>
              <p className="text-body-lg text-neutral-600 mb-6">
                If we're late by even a minute, your delivery is free. We're that confident in our speed and service. Your satisfaction is our priority, always.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">100% Secure</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">On-Time Guarantee</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-medium">Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  )
}