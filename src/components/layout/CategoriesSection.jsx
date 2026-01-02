// src/components/layout/CategoriesSection.jsx

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { FadeInWhenVisible } from '@components/animations/FadeIn'

const categories = [
  { 
    id: 'groceries', 
    name: 'Groceries', 
    image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=300&h=300&fit=crop',
    count: '500+ items'
  },
  { 
    id: 'vegetables', 
    name: 'Vegetables', 
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop',
    count: '200+ items'
  },
  { 
    id: 'fruits', 
    name: 'Fruits', 
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop',
    count: '150+ items'
  },
  { 
    id: 'dairy', 
    name: 'Dairy & Eggs', 
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop',
    count: '100+ items'
  },
  { 
    id: 'meat', 
    name: 'Meat & Fish', 
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop',
    count: '80+ items'
  },
  { 
    id: 'bakery', 
    name: 'Bakery', 
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
    count: '120+ items'
  },
  { 
    id: 'beverages', 
    name: 'Beverages', 
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300&h=300&fit=crop',
    count: '150+ items'
  },
  { 
    id: 'snacks', 
    name: 'Snacks', 
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop',
    count: '200+ items'
  },
  { 
    id: 'household', 
    name: 'Household', 
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300&h=300&fit=crop',
    count: '300+ items'
  },
  { 
    id: 'personal-care', 
    name: 'Personal Care', 
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop',
    count: '250+ items'
  },
  { 
    id: 'baby', 
    name: 'Baby Care', 
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&h=300&fit=crop',
    count: '100+ items'
  },
]

export default function CategoriesSection() {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`)
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto">
        <FadeInWhenVisible>
          <div className="text-center mb-8">
            <h2 className="text-display font-display font-bold text-neutral-800 mb-2">
              Shop by Category
            </h2>
            <p className="text-body-lg text-neutral-600">
              Everything you need is right here
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <FadeInWhenVisible key={category.id} delay={index * 0.05}>
              <motion.button
                onClick={() => handleCategoryClick(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-caption text-white/80">{category.count}</p>
                </div>
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-300" />
              </motion.button>
            </FadeInWhenVisible>
          ))}

          <FadeInWhenVisible delay={categories.length * 0.05}>
            <motion.button
              onClick={() => navigate('/shop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="aspect-square rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowRight className="w-8 h-8" />
              <span className="font-semibold">See All</span>
              <span className="text-caption">Categories</span>
            </motion.button>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  )
}