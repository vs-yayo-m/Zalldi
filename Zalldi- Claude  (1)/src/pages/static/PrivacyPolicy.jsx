// src/pages/static/PrivacyPolicy.jsx

import { motion } from 'framer-motion'
import { APP_NAME, CONTACT } from '@utils/constants'
import Card from '@components/ui/Card'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: FileText,
      content: [
        'Personal information (name, email, phone number, delivery address)',
        'Order history and purchase information',
        'Payment information (securely processed by third-party providers)',
        'Device and usage information (IP address, browser type, pages visited)',
        'Location data (for delivery purposes only)',
        'Communication preferences and feedback'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'Process and deliver your orders',
        'Communicate about orders, deliveries, and customer service',
        'Improve our services and user experience',
        'Send promotional offers (with your consent)',
        'Prevent fraud and ensure platform security',
        'Comply with legal obligations'
      ]
    },
    {
      title: 'Information Security',
      icon: Lock,
      content: [
        'We use industry-standard encryption (SSL/TLS) for data transmission',
        'Secure storage with regular backups',
        'Access controls and authentication measures',
        'Regular security audits and updates',
        'Payment information is never stored on our servers',
        'Employee training on data protection'
      ]
    },
    {
      title: 'Your Rights',
      icon: Shield,
      content: [
        'Access your personal data at any time',
        'Request correction of inaccurate information',
        'Delete your account and associated data',
        'Opt-out of marketing communications',
        'Export your data in a readable format',
        'Lodge a complaint with relevant authorities'
      ]
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
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 mb-8">
            <p className="text-neutral-700 leading-relaxed mb-4">
              <strong>Effective Date:</strong> December 26, 2025
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              At {APP_NAME}, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our platform.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              By using {APP_NAME}, you agree to the collection and use of information in accordance with 
              this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </Card>
        </motion.div>

        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="mb-6"
          >
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-orange-100">
                  <section.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-display font-bold text-neutral-800">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-700">
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Data Sharing and Disclosure
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service providers who help us operate our platform (payment processors, delivery partners)</li>
                <li>Suppliers to fulfill your orders</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your explicit consent</li>
              </ul>
              <p>
                All third parties are contractually obligated to maintain the confidentiality and security 
                of your information.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Cookies and Tracking
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform. 
                Cookies help us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure platform security</li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings. However, disabling cookies 
                may limit some features of our platform.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Data Retention
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain business records</li>
              </ul>
              <p>
                When you delete your account, we will delete or anonymize your personal information within 
                30 days, except where we are required by law to retain certain data.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Children's Privacy
            </h2>
            <p className="text-neutral-700">
              {APP_NAME} is not intended for users under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have inadvertently collected information 
              from a child, please contact us immediately.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-neutral-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Effective Date" at the top.
            </p>
            <p className="text-neutral-700">
              We encourage you to review this Privacy Policy periodically for any changes. Your continued 
              use of our services after any modifications constitutes your acceptance of the updated policy.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="p-8 bg-orange-50 border-orange-200">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Contact Us
            </h2>
            <p className="text-neutral-700 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
              practices, please contact us:
            </p>
            <div className="space-y-2 text-neutral-700">
              <p><strong>Email:</strong> {CONTACT.support}</p>
              <p><strong>WhatsApp:</strong> {CONTACT.whatsapp}</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}