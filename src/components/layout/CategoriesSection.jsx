import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

const categories = [
  { 
    id: 'groceries', 
    name: 'Groceries', 
    image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=300&h=300&fit=crop',
    count: '500+ items',
    color: 'bg-emerald-50'
  },
  { 
    id: 'vegetables', 
    name: 'Vegetables', 
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop',
    count: '200+ items',
    color: 'bg-green-50'
  },
  { 
    id: 'fruits', 
    name: 'Fruits', 
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop',
    count: '150+ items',
    color: 'bg-red-50'
  },
  { 
    id: 'dairy', 
    name: 'Dairy & Eggs', 
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop',
    count: '100+ items',
    color: 'bg-blue-50'
  },
  { 
    id: 'meat', 
    name: 'Meat & Fish', 
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop',
    count: '80+ items',
    color: 'bg-orange-50'
  },
  { 
    id: 'bakery', 
    name: 'Bakery', 
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
    count: '120+ items',
    color: 'bg-amber-50'
  },
  { 
    id: 'beverages', 
    name: 'Beverages', 
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300&h=300&fit=crop',
    count: '150+ items',
    color: 'bg-cyan-50'
  },
  { 
    id: 'snacks', 
    name: 'Snacks', 
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop',
    count: '200+ items',
    color: 'bg-purple-50'
  },
  { 
    id: 'household', 
    name: 'Household', 
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300&h=300&fit=crop',
    count: '300+ items',
    color: 'bg-slate-50'
  },
  { 
    id: 'personal-care', 
    name: 'Personal Care', 
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop',
    count: '250+ items',
    color: 'bg-pink-50'
  },
  { 
    id: 'baby', 
    name: 'Baby Care', 
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&h=300&fit=crop',
    count: '100+ items',
    color: 'bg-indigo-50'
  },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // Staggered Container Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  // Item Animation Variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[2px] bg-orange-500 rounded-full" />
              <span className="text-orange-500 font-black text-xs uppercase tracking-widest">Wide Range</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900 leading-tight">
              Shop by <span className="text-orange-500">Category</span>
            </h2>
            <p className="text-neutral-500 mt-2 font-medium">
              Curated essentials, delivered to your doorstep in minutes.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-orange-600 font-bold text-sm md:text-base group"
          >
            View All Categories 
            <div className="p-1.5 bg-orange-100 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>

        {/* Categories Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="relative group cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Card Container */}
              <div className={`relative aspect-[4/5] rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm border border-neutral-100 group-hover:shadow-xl group-hover:shadow-orange-500/10 ${category.color}`}>
                
                {/* Image Logic */}
                <div className="absolute inset-0 p-3 pb-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-white">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>

                {/* Glass Overlay for Text */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white/80 to-transparent pt-8">
                  <h3 className="font-black text-neutral-800 text-sm md:text-base mb-0.5 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-tighter">
                      {category.count}
                    </span>
                  </div>
                </div>

                {/* Hover Quick Action */}
                <div className="absolute top-4 right-4 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* "See All" Special Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => navigate('/shop')}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] bg-orange-500 p-6 flex flex-col items-center justify-center text-center overflow-hidden shadow-lg shadow-orange-200">
              {/* Decorative Circle Background */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 mx-auto rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                  <ArrowRight className="w-7 h-7 text-orange-600" />
                </div>
                <span className="block text-white font-black text-lg">Explore More</span>
                <span className="text-orange-100 text-xs font-bold uppercase tracking-widest mt-1 block">Categories</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * PRODUCTION ENHANCEMENTS:
 * 1. Layout: Shifted from simple squares to a 4:5 "Portrait Card" aspect ratio, which feels more modern for e-commerce.
 * 2. Visual Polish: Added dynamic background colors (e.g., bg-emerald-50) per category for subtle UI depth.
 * 3. Interactions: Integrated a spring-based "Lift" effect on hover to create a tactile sense of interaction.
 * 4. Micro-copy: Replaced simple titles with a structured hierarchy (Badge -> Title -> Subtitle).
 * 5. Responsiveness: Adjusted the grid from 2 columns on small mobiles to 6 columns on large desktops.
 */