// src/pages/static/TermsConditions.jsx

import { motion } from 'framer-motion'
import { APP_NAME, CONTACT } from '@utils/constants'
import Card from '@components/ui/Card'
import { FileText } from 'lucide-react'

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our services
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
              <strong>Last Updated:</strong> December 26, 2025
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Welcome to {APP_NAME}. By accessing or using our platform, you agree to be bound by these 
              Terms and Conditions. Please read them carefully. If you disagree with any part of these terms, 
              you may not use our services.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              1. Use of Service
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p><strong>1.1 Eligibility:</strong> You must be at least 18 years old to use {APP_NAME}. 
              By using our service, you represent that you meet this age requirement.</p>
              
              <p><strong>1.2 Account Creation:</strong> You must provide accurate, current, and complete 
              information during registration. You are responsible for maintaining the confidentiality of 
              your account credentials.</p>
              
              <p><strong>1.3 Prohibited Activities:</strong> You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              2. Orders and Delivery
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p><strong>2.1 Order Acceptance:</strong> All orders are subject to acceptance and availability. 
              We reserve the right to refuse or cancel any order for any reason.</p>
              
              <p><strong>2.2 Delivery Guarantee:</strong> We aim to deliver within 1 hour. If delivery is 
              delayed beyond this timeframe due to our fault, delivery fees will be waived.</p>
              
              <p><strong>2.3 Delivery Address:</strong> You must provide accurate delivery information. 
              We are not responsible for non-delivery due to incorrect addresses.</p>
              
              <p><strong>2.4 Product Availability:</strong> Product availability is subject to stock. If an 
              item is unavailable, we will contact you for a substitute or refund.</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              3. Pricing and Payment
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p><strong>3.1 Pricing:</strong> All prices are in Nepali Rupees (NPR) and include applicable 
              taxes unless otherwise stated.</p>
              
              <p><strong>3.2 Payment Methods:</strong> We accept Cash on Delivery (COD) and other payment 
              methods as displayed on our platform.</p>
              
              <p><strong>3.3 Price Changes:</strong> Prices are subject to change without notice. The price 
              at the time of order placement will be honored.</p>
              
              <p><strong>3.4 Payment Verification:</strong> We may verify payment information and reserve 
              the right to cancel orders if payment cannot be verified.</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              4. Returns and Refunds
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p><strong>4.1 Return Policy:</strong> Products can be returned if they are damaged, defective, 
              or not as described. Returns must be initiated within 24 hours of delivery.</p>
              
              <p><strong>4.2 Non-Returnable Items:</strong> Perishable goods, personal care items, and 
              opened food products cannot be returned unless defective.</p>
              
              <p><strong>4.3 Refund Process:</strong> Approved refunds will be processed within 5-7 business 
              days to the original payment method.</p>
              
              <p><strong>4.4 Inspection:</strong> All returned items are subject to inspection before refund 
              approval.</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              5. Intellectual Property
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p><strong>5.1 Ownership:</strong> All content on {APP_NAME}, including text, graphics, logos, 
              images, and software, is our property or that of our content suppliers.</p>
              
              <p><strong>5.2 Limited License:</strong> You are granted a limited, non-exclusive license to 
              access and use our platform for personal, non-commercial purposes.</p>
              
              <p><strong>5.3 Restrictions:</strong> You may not reproduce, distribute, modify, or create 
              derivative works from our content without written permission.</p>
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
              6. Limitation of Liability
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p><strong>6.1 Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee 
              uninterrupted service. We are not liable for any service interruptions.</p>
              
              <p><strong>6.2 Product Quality:</strong> While we ensure product quality, we are not liable 
              for issues arising from supplier errors or manufacturing defects.</p>
              
              <p><strong>6.3 Maximum Liability:</strong> Our total liability for any claim shall not exceed 
              the amount you paid for the specific order in question.</p>
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
              7. Termination
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p><strong>7.1 Account Termination:</strong> We may suspend or terminate your account if you 
              violate these terms or engage in fraudulent activity.</p>
              
              <p><strong>7.2 User Termination:</strong> You may delete your account at any time through your 
              account settings.</p>
              
              <p><strong>7.3 Effect of Termination:</strong> Upon termination, your right to use the service 
              will immediately cease, but these terms will remain in effect regarding past use.</p>
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
              8. Changes to Terms
            </h2>
            <p className="text-neutral-700">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the service after changes constitutes acceptance of the 
              modified terms.
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
              9. Governing Law
            </h2>
            <p className="text-neutral-700">
              These terms shall be governed by and construed in accordance with the laws of Nepal. Any 
              disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts 
              in Butwal, Nepal.
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
              Contact Information
            </h2>
            <p className="text-neutral-700 mb-4">
              For questions about these Terms and Conditions, please contact us:
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