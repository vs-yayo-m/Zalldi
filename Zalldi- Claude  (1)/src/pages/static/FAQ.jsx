// src/pages/static/FAQ.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APP_NAME, CONTACT } from '@utils/constants'
import Card from '@components/ui/Card'
import Input from '@components/ui/Input'
import Accordion from '@components/ui/Accordion'
import { HelpCircle, Search, Package, CreditCard, Truck, RefreshCw } from 'lucide-react'

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')

  const faqCategories = [
    {
      title: 'Orders & Delivery',
      icon: Truck,
      faqs: [
        {
          question: 'How does 1-hour delivery work?',
          answer: `Once you place an order, our team immediately begins processing it at our dark store. We pick, pack, and dispatch your order within minutes. Our delivery partners ensure your order reaches you within 60 minutes from the time of order placement.`
        },
        {
          question: 'What areas do you deliver to?',
          answer: `We deliver to all 19 wards of Butwal, Nepal. Simply enter your address during checkout to confirm delivery availability in your area.`
        },
        {
          question: 'Can I track my order in real-time?',
          answer: `Yes! Once your order is dispatched, you'll receive a tracking link that shows real-time updates of your delivery. You can see exactly where your order is and the estimated time of arrival.`
        },
        {
          question: 'What if I miss my delivery?',
          answer: `Our delivery partner will attempt to contact you via phone. If you're unavailable, we'll try to deliver within the next hour. If that's not possible, please contact our support team to reschedule.`
        },
        {
          question: 'Is there a minimum order value?',
          answer: `There's no minimum order value at ${APP_NAME}. Order as little or as much as you need, and we'll deliver it within an hour!`
        }
      ]
    },
    {
      title: 'Products & Pricing',
      icon: Package,
      faqs: [
        {
          question: 'How do I know if a product is in stock?',
          answer: `Product availability is shown in real-time on each product page. If a product shows as "In Stock," it's available for immediate delivery. Low stock items will show remaining quantity.`
        },
        {
          question: 'Are your prices higher than regular stores?',
          answer: `Our prices are competitive and comparable to local market rates. The convenience of 1-hour delivery comes at no extra cost - you only pay a small delivery fee.`
        },
        {
          question: 'Can I request specific products not listed?',
          answer: `Yes! You can contact our support team with product requests. We regularly update our catalog based on customer needs.`
        },
        {
          question: 'How do you ensure product quality?',
          answer: `All products in our dark store are regularly inspected. We check expiry dates, quality, and freshness before packing. For perishables, we maintain optimal storage conditions.`
        }
      ]
    },
    {
      title: 'Payment & Refunds',
      icon: CreditCard,
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: `Currently, we accept Cash on Delivery (COD). We're working on integrating digital payment options like eSewa and Khalti soon.`
        },
        {
          question: 'Is Cash on Delivery safe?',
          answer: `Absolutely! Our delivery partners are trained professionals. You can inspect your order before making payment.`
        },
        {
          question: 'How do refunds work?',
          answer: `If you receive a damaged or incorrect product, contact us within 24 hours. We'll arrange a pickup and process your refund within 5-7 business days.`
        },
        {
          question: 'Can I get a refund if I change my mind?',
          answer: `Due to the nature of quick commerce and perishable items, we cannot accept returns for change of mind. However, if there's a quality issue, we'll gladly process a refund.`
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: RefreshCw,
      faqs: [
        {
          question: 'What is your return policy?',
          answer: `You can return products if they're damaged, defective, or not as described. Returns must be initiated within 24 hours of delivery. Perishable and opened items cannot be returned unless defective.`
        },
        {
          question: 'How do I initiate a return?',
          answer: `Contact our support team via WhatsApp at ${CONTACT.whatsapp} or email at ${CONTACT.support}. Provide your order number and reason for return.`
        },
        {
          question: 'Can I exchange a product?',
          answer: `Yes, if you receive the wrong item or a defective product, we'll arrange an exchange immediately. Contact us and we'll process it as quickly as possible.`
        },
        {
          question: 'Who pays for return shipping?',
          answer: `If the return is due to our error (wrong item, damaged product), we cover all return costs. For other returns, return fees may apply.`
        }
      ]
    }
  ]

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
              Find answers to common questions about {APP_NAME}
            </p>

            <div className="max-w-2xl mx-auto">
              <Input
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="bg-white"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCategories.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              No results found
            </h3>
            <p className="text-neutral-600">
              Try searching with different keywords or browse all categories below
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-orange-100">
                      <category.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-neutral-800">
                      {category.title}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {category.faqs.map((faq, index) => (
                      <Accordion
                        key={index}
                        title={faq.question}
                        defaultOpen={searchTerm && index === 0}
                      >
                        <p className="text-neutral-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </Accordion>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-blue-200 text-center">
            <h3 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-neutral-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                WhatsApp Support
              </a>
              <a
                href={`mailto:${CONTACT.support}`}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Email Us
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}