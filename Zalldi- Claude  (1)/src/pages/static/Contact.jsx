// src/pages/static/Contact.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CONTACT, SOCIAL_MEDIA, APP_NAME } from '@utils/constants'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { Mail, Phone, MapPin, Clock, Instagram, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitting(false)
    }, 1000)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      value: CONTACT.support,
      link: `mailto:${CONTACT.support}`,
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: CONTACT.whatsapp,
      link: `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`,
      description: '24/7 customer support'
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@zalldi.com.np',
      link: SOCIAL_MEDIA.instagram,
      description: 'Follow us for updates'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Butwal, Nepal',
      link: null,
      description: 'Serving all 19 wards'
    }
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
              Get in Touch
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-6">
              Contact Information
            </h2>
            <p className="text-neutral-600 mb-8">
              We're here to help! Reach out to us through any of these channels and our team will 
              get back to you as quickly as possible.
            </p>

            <div className="space-y-4 mb-8">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-card-hover transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-orange-100">
                        <method.icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-800 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          {method.description}
                        </p>
                        {method.link ? (
                          <a
                            href={method.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 font-medium"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className="text-neutral-700 font-medium">
                            {method.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="p-6 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-2">
                    Business Hours
                  </h3>
                  <p className="text-neutral-700">
                    Monday - Sunday: 6:00 AM - 11:00 PM
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    We're here to serve you every day!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                  icon={Mail}
                />

                <Input
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="How can we help?"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  icon={Send}
                  className="w-full"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-sm text-neutral-600 text-center">
                  We typically respond within 24 hours
                </p>
              </form>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <h3 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-neutral-600 mb-4">
              Looking for quick answers? Check out our FAQ page for common questions about delivery, 
              orders, payments, and more.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/faq'}
            >
              Visit FAQ Page
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}