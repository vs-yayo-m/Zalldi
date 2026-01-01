import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_NAME, CONTACT, SOCIAL_MEDIA, FOUNDER } from '@/utils/constants';

/**
 * ZALLDI ENTERPRISE FOOTER
 * A modern, high-density footer designed for quick-commerce trust and engagement.
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: [
      { label: 'Our Story', to: '/about' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Sustainability', to: '/about' },
      { label: 'Careers', to: '/about' }
    ],
    shop: [
      { label: 'Fresh Groceries', to: '/shop?cat=groceries' },
      { label: 'Dairy & Eggs', to: '/shop?cat=dairy' },
      { label: 'Personal Care', to: '/shop?cat=care' },
      { label: 'Zalldi Deals', to: '/shop?filter=deals' },
      { label: 'New Arrivals', to: '/shop?filter=new' }
    ],
    support: [
      { label: 'Track Order', to: '/track' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Use', to: '/terms-conditions' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Vendor Portal', to: '/supplier/dashboard' }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-[#0A0A0A] text-white pt-20 pb-10 overflow-hidden border-t border-neutral-800">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* 1. Newsletter & Value Prop Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16 border-b border-white/5 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Get the freshest deals <br />
              <span className="text-orange-500">straight to your inbox.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors flex-1"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex gap-8 justify-start lg:justify-end">
             <div className="text-center">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2 mx-auto">
                 <Zap className="w-6 h-6 text-orange-500" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Express</p>
             </div>
             <div className="text-center">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2 mx-auto">
                 <ShieldCheck className="w-6 h-6 text-orange-500" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Secure</p>
             </div>
             <div className="text-center">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2 mx-auto">
                 <Award className="w-6 h-6 text-orange-500" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Local</p>
             </div>
          </div>
        </div>

        {/* 2. Main Footer Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 py-16"
        >
          {/* Brand Info */}
          <motion.div variants={itemVariants} className="col-span-2 lg:col-span-2 pr-0 lg:pr-12">
            <Link to="/" className="inline-block mb-6">
              <div className="font-display font-black text-3xl flex items-center gap-1">
                <span className="text-orange-500 tracking-tighter">Zal</span>
                <span className="text-white tracking-tighter">ldi</span>
              </div>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-sm">
              Zalldi is Butwal's premier quick-commerce platform. We're bridging the gap between local quality and modern convenience with 60-minute doorstep delivery across all 19 wards.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: SOCIAL_MEDIA.instagram, label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: MessageCircle, href: `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`, label: 'WhatsApp' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-orange-500 hover:border-orange-500 rounded-xl transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-orange-500 mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-neutral-400 hover:text-white transition-all text-sm font-medium flex items-center group">
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-orange-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-orange-500 mb-6">Shopping</h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-neutral-400 hover:text-white transition-all text-sm font-medium flex items-center group">
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-orange-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 lg:col-span-1">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-orange-500 mb-6">Zalldi Headquarters</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Butwal, Nepal</p>
                  <p className="text-neutral-500 text-xs">Serving all 19 Wards</p>
                </div>
              </div>
              <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-orange-500/10 flex items-center justify-center transition-colors shrink-0">
                  <Phone className="w-5 h-5 text-neutral-400 group-hover:text-orange-500" />
                </div>
                <p className="text-neutral-400 group-hover:text-white text-sm font-medium transition-colors">{CONTACT.phone}</p>
              </a>
              <a href={`mailto:${CONTACT.support}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-orange-500/10 flex items-center justify-center transition-colors shrink-0">
                  <Mail className="w-5 h-5 text-neutral-400 group-hover:text-orange-500" />
                </div>
                <p className="text-neutral-400 group-hover:text-white text-sm font-medium transition-colors truncate">{CONTACT.support}</p>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* 3. Bottom Bar */}
        <div className="border-t border-white/5 mt-8 pt-10">
          <div className="flex flex-col lg:row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-neutral-500">
                PROUDLY NEPALESE 🇳🇵
              </div>
              <p className="text-neutral-500 text-xs">
                © {currentYear} <span className="text-white font-bold">{APP_NAME}</span>. All rights reserved. 
                <span className="hidden md:inline mx-2 text-neutral-700">|</span> 
                Founded by <span className="text-neutral-300 font-bold hover:text-orange-500 transition-colors cursor-pointer">{FOUNDER.name}</span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {footerLinks.support.slice(1, 4).map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-neutral-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/supplier/dashboard"
                className="text-orange-500 hover:text-orange-400 text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                Sell on Zalldi <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

