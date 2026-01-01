import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APP_NAME, CONTACT } from '@/utils/constants'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Accordion from '@/components/ui/Accordion'
import { 
  HelpCircle, 
  Search, 
  Package, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  MessageCircle, 
  Mail,
  Zap,
  ChevronRight
} from 'lucide-react'

/**
 * ZALLDI CUSTOMER SUPPORT HUB
 * A high-performance FAQ system designed for rapid information retrieval.
 */

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')

  const faqCategories = [
    {
      title: 'Orders & Delivery',
      icon: Truck,
      color: 'orange',
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
      color: 'blue',
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
      color: 'emerald',
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
      color: 'purple',
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
    <div className="min-h-screen bg-[#F9FAFB] pb-20 selection:bg-orange-100">
      {/* 1. Dynamic Hero Header */}
      <div className="relative bg-neutral-900 overflow-hidden pt-24 pb-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-orange-600 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-400 text-xs font-black tracking-widest uppercase mb-6">
              <Zap className="w-3 h-3 fill-current" />
              Zalldi Help Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-none">
              How can we <br className="sm:hidden" /> <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">help you?</span>
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Get 60-minute delivery support, track orders, or learn more about the {APP_NAME} experience in Butwal.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative">
                <Input
                  placeholder="Search for answers (e.g. 'delivery time', 'refunds')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-5 h-5 text-neutral-400" />}
                  className="h-16 px-6 bg-white border-0 rounded-2xl shadow-2xl text-lg font-medium focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-neutral-300"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. FAQ Content Grid */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        <AnimatePresence mode="popLayout">
          {filteredCategories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-16 text-center shadow-xl border border-neutral-100"
            >
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 mb-2">No results found</h3>
              <p className="text-neutral-500 font-medium max-w-xs mx-auto">
                We couldn't find anything matching "{searchTerm}". Try general terms like "delivery" or "payment".
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 text-orange-500 font-black text-sm uppercase tracking-widest hover:underline"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category, categoryIndex) => (
                <motion.section
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-orange-600">
                        <category.icon className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                        {category.title}
                      </h2>
                    </div>
                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-neutral-400 border border-neutral-100 uppercase tracking-widest shadow-sm">
                      {category.faqs.length} Articles
                    </span>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-neutral-200/50 border border-neutral-100 divide-y divide-neutral-50">
                    {category.faqs.map((faq, index) => (
                      <Accordion
                        key={index}
                        title={<span className="font-bold text-neutral-800 text-lg tracking-tight">{faq.question}</span>}
                        defaultOpen={searchTerm.length > 2}
                        className="border-0"
                      >
                        <div className="pb-6 px-4">
                          <p className="text-neutral-600 leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </Accordion>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* 3. Support CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-neutral-900 rounded-[3rem] p-8 md:p-12 relative overflow-hidden text-center md:text-left">
            {/* Background Decorative Element */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-md">
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                  Still have questions?
                </h3>
                <p className="text-neutral-400 font-medium text-lg leading-relaxed">
                  Our local support team in Butwal is available 7 days a week from 8:00 AM to 10:00 PM.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-6 h-6 fill-current" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Live Chat</p>
                    <p className="font-black text-lg leading-none">WhatsApp</p>
                  </div>
                  <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                </a>

                <a
                  href={`mailto:${CONTACT.support}`}
                  className="group flex items-center justify-center gap-3 px-8 py-5 bg-white hover:bg-neutral-50 text-neutral-900 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                >
                  <Mail className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Send Email</p>
                    <p className="font-black text-lg leading-none">Support Team</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Footer Brand Link */}
      <div className="text-center mt-20">
        <p className="text-neutral-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">
          Speed. Quality. Trust.
        </p>
        <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-transparent mx-auto rounded-full" />
      </div>
    </div>
  )
}

