import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONTACT, SOCIAL_MEDIA, APP_NAME } from '@/utils/constants'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Send, 
  MessageCircle, 
  Zap, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'react-hot-toast'

/**
 * ZALLDI PREMIUM CONTACT HUB
 * Optimized for local trust and rapid communication in Butwal.
 */

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

    // Simulate enterprise API call
    setTimeout(() => {
      toast.success('Message received! Our Butwal team will contact you soon.', {
        style: {
          borderRadius: '16px',
          background: '#171717',
          color: '#fff',
          fontWeight: 'bold'
        },
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitting(false)
    }, 1200)
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp Support',
      value: CONTACT.whatsapp,
      link: `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`,
      description: 'Instant help for active orders',
      color: 'bg-emerald-50 text-emerald-600',
      isPrimary: true
    },
    {
      icon: Mail,
      title: 'Email Inquiries',
      value: CONTACT.support,
      link: `mailto:${CONTACT.support}`,
      description: 'For business & formal requests',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@zalldi.official',
      link: SOCIAL_MEDIA.instagram,
      description: 'Behind the scenes & updates',
      color: 'bg-rose-50 text-rose-600'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 selection:bg-orange-100">
      {/* 1. Brand Hero Section */}
      <div className="relative bg-neutral-900 pt-24 pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-orange-600 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-400 text-[10px] font-black tracking-[0.2em] uppercase mb-8">
              <Zap className="w-3 h-3 fill-current" />
              We are here to help
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
              Get in <span className="text-orange-500">Touch.</span>
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Experiencing an issue with your 60-minute delivery? <br className="hidden md:block" />
              Our Butwal-based team is standing by to assist you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 2. Left Column: Information & Trust */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-4">Support Channels</h2>
              <p className="text-neutral-500 font-medium mb-8">
                Choose the most convenient way to reach us. WhatsApp is usually the fastest way to get a response during delivery hours.
              </p>

              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <a 
                      href={method.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`block p-6 bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-200/50 hover:shadow-2xl hover:border-orange-200 transition-all group active:scale-[0.98] ${method.isPrimary ? 'ring-2 ring-orange-500/5' : ''}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${method.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <method.icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-neutral-900 text-lg tracking-tight mb-0.5">{method.title}</h3>
                          <p className="text-neutral-500 text-sm font-medium mb-1">{method.description}</p>
                          <p className="text-orange-600 font-bold tracking-tight">{method.value}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Zap className="w-4 h-4 text-orange-500 fill-current" />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-900/20"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black tracking-tight">Butwal Delivery Hours</h3>
                    <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">Open Every Day</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold border-b border-white/10 pb-2">
                    <span className="text-neutral-400 uppercase tracking-widest text-[10px]">Active Support</span>
                    <span>06:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-neutral-400 uppercase tracking-widest text-[10px]">Emergency Dispatch</span>
                    <span>24/7 Monitoring</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[11px] font-black text-emerald-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Currently Accepting Orders
                </div>
              </div>
              <MapPin className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5" />
            </motion.div>
          </div>

          {/* 3. Right Column: The Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-neutral-200/50 border border-neutral-100">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">Send a Message</h2>
                <p className="text-neutral-500 font-medium">Have a specific inquiry? Fill out the form below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your name"
                    className="h-14 bg-neutral-50 border-neutral-100 rounded-2xl focus:bg-white transition-all font-bold"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="name@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    className="h-14 bg-neutral-50 border-neutral-100 rounded-2xl focus:bg-white transition-all font-bold"
                  />
                </div>

                <Input
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="How can we help you?"
                  className="h-14 bg-neutral-50 border-neutral-100 rounded-2xl focus:bg-white transition-all font-bold"
                />

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest px-1">
                    Your Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-[2rem] focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all resize-none font-bold placeholder:text-neutral-300 placeholder:font-medium"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-16 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98] w-full"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>SEND MESSAGE</span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 mt-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                   <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                      Zalldi Shield Protected
                   </div>
                   <div className="w-[1px] h-4 bg-neutral-200" />
                   <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Response in 24h
                   </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* 4. Bottom Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-8 bg-white border border-neutral-100 rounded-[3rem] shadow-xl shadow-neutral-200/40">
            <h3 className="text-xl font-black text-neutral-900 mb-2">Need a faster answer?</h3>
            <p className="text-neutral-500 font-medium mb-6">Our FAQ covers 90% of user inquiries about delivery and payments.</p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/faq'}
              className="border-neutral-200 hover:border-orange-500 text-neutral-600 font-black rounded-xl px-8"
            >
              GO TO HELP CENTER
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

