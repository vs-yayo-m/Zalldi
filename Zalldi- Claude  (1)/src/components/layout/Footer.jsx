// src/components/layout/Footer.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import { APP_NAME, CONTACT, SOCIAL_MEDIA, FOUNDER } from '@/utils/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    company: [
      { label: 'About Us', to: '/about' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQ', to: '/faq' }
    ],
    shop: [
      { label: 'All Products', to: '/shop' },
      { label: 'Categories', to: '/shop' },
      { label: 'Deals', to: '/shop?filter=deals' },
      { label: 'New Arrivals', to: '/shop?filter=new' }
    ],
    support: [
      { label: 'Order Tracking', to: '/track' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms-conditions' },
      { label: 'Refund Policy', to: '/refund-policy' }
    ]
  }
  
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link to="/" className="inline-block mb-4">
              <div className="font-display font-bold text-2xl">
                <span className="text-orange-500">Zal</span>
                <span className="text-white">ldi</span>
              </div>
            </Link>
            <p className="text-neutral-400 mb-6">
              Order now, delivered in 1 hour. Everything Butwal needs, instantly available.
            </p>
            <div className="flex gap-4">
              <a
                href={SOCIAL_MEDIA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-orange-500 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-orange-500 rounded-lg transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-neutral-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-neutral-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-neutral-400">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Butwal, Nepal<br />All 19 Wards</span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-3 text-neutral-400 hover:text-orange-500 transition-colors"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.support}`}
                  className="flex items-center gap-3 text-neutral-400 hover:text-orange-500 transition-colors"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>{CONTACT.support}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-400 text-sm text-center md:text-left">
              © {currentYear} {APP_NAME}. All rights reserved. Founded by {FOUNDER.name}.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {footerLinks.support.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="text-neutral-400 hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}