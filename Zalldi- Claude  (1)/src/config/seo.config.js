// src/config/seo.config.js

import { APP_NAME, APP_URL } from '@utils/constants'

export const seoConfig = {
  defaultTitle: `${APP_NAME} - Order now, delivered in 1 hour`,
  titleTemplate: `%s | ${APP_NAME}`,
  defaultDescription: 'Shop groceries, vegetables, fruits, and more online in Butwal. Get everything delivered to your doorstep in just 1 hour. Fast, reliable, and premium quick commerce service.',
  defaultKeywords: [
    'online shopping',
    'grocery delivery',
    'Butwal',
    'Nepal',
    'quick commerce',
    '1 hour delivery',
    'fast delivery',
    'groceries online',
    'vegetables online',
    'fruits online'
  ],

  pages: {
    home: {
      title: `${APP_NAME} - Fast 1-Hour Delivery in Butwal`,
      description: 'Shop groceries, vegetables, fruits, and daily essentials online in Butwal. Get everything delivered in just 1 hour. Premium quick commerce service.',
      keywords: ['online shopping Butwal', 'grocery delivery Nepal', 'quick commerce', '1 hour delivery']
    },
    shop: {
      title: 'Shop All Products',
      description: 'Browse thousands of products including groceries, vegetables, fruits, dairy, meat, and more. Fast delivery across all 19 wards of Butwal.',
      keywords: ['online store', 'buy groceries', 'shop online Butwal']
    },
    about: {
      title: 'About Us',
      description: 'Learn about Zalldi, the fastest growing quick commerce platform in Butwal. Our mission is to deliver everything you need within an hour.',
      keywords: ['about Zalldi', 'quick commerce Butwal', 'online shopping Nepal']
    },
    contact: {
      title: 'Contact Us',
      description: 'Get in touch with Zalldi customer support. We are available from 6 AM to 11 PM to help you with orders, deliveries, and any questions.',
      keywords: ['contact Zalldi', 'customer support', 'help']
    },
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about Zalldi, delivery, payments, returns, and more.',
      keywords: ['FAQ', 'help', 'questions', 'delivery information']
    }
  },

  categories: {
    groceries: {
      title: 'Buy Groceries Online in Butwal',
      description: 'Shop for rice, pulses, spices, cooking oil, and all grocery essentials online. Fast delivery in 1 hour across Butwal.',
      keywords: ['groceries online', 'buy rice', 'pulses online', 'cooking essentials']
    },
    vegetables: {
      title: 'Fresh Vegetables Online',
      description: 'Order fresh vegetables online in Butwal. Get farm-fresh produce delivered to your door in just 1 hour.',
      keywords: ['vegetables online', 'fresh vegetables', 'buy vegetables Butwal']
    },
    fruits: {
      title: 'Fresh Fruits Online',
      description: 'Order fresh seasonal fruits online in Butwal. Premium quality fruits delivered in 1 hour.',
      keywords: ['fruits online', 'fresh fruits', 'buy fruits Butwal']
    },
    dairy: {
      title: 'Dairy & Eggs Online',
      description: 'Buy milk, yogurt, cheese, eggs, and dairy products online. Fresh delivery in 1 hour.',
      keywords: ['dairy online', 'buy milk', 'eggs online', 'cheese online']
    }
  },

  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    locale: 'en_US',
    url: APP_URL,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Fast 1-Hour Delivery`
      }
    ]
  },

  twitter: {
    cardType: 'summary_large_image',
    site: '@zalldi',
    creator: '@sharma_vishal_o'
  },

  structuredData: {
    organization: {
      name: APP_NAME,
      legalName: 'Zalldi Private Limited',
      url: APP_URL,
      logo: `${APP_URL}/logo.png`,
      foundingDate: '2024',
      founders: [
        {
          '@type': 'Person',
          name: 'Vishal Sharma'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Butwal',
        addressCountry: 'NP'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+977-9821072912',
        contactType: 'customer service',
        email: 'support.zalldi@gmail.com',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://www.instagram.com/zalldi.com.np',
        'https://www.instagram.com/sharma_vishal_o'
      ]
    },
    localBusiness: {
      '@type': 'LocalBusiness',
      name: APP_NAME,
      image: `${APP_URL}/logo.png`,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Butwal',
        addressRegion: 'Lumbini Province',
        addressCountry: 'NP'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 27.7,
        longitude: 83.45
      },
      url: APP_URL,
      telephone: '+977-9821072912',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          opens: '06:00',
          closes: '23:00'
        }
      ]
    },
    webSite: {
      '@type': 'WebSite',
      name: APP_NAME,
      url: APP_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${APP_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}