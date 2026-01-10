// src/components/home/DualRowCategoriesSection.jsx

import { motion } from 'framer-motion';
import DualRowCategoryShowcase from './DualRowCategoryShowcase';

const DUAL_ROW_CATEGORIES = [
  { id: 'chips-namkeen', name: 'Chips & Namkeen' },
  { id: 'instant-food', name: 'Instant Food' },
  { id: 'drinks-juices', name: 'Drinks & Juices' },
  { id: 'skin-face', name: 'Skin & Face' },
  { id: 'beauty-cosmetics', name: 'Beauty & Cosmetics' },
  { id: 'flour-rice-dal', name: 'Atta, Rice & Dal' },
  { id: 'oil-ghee-masala', name: 'Oil, Ghee & Masala' },
  { id: 'cleaners-repellents', name: 'Cleaners & Repellents' },
  { id: 'bath-body', name: 'Bath & Body' }
];

export default function DualRowCategoriesSection() {
  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4 space-y-6">
        {DUAL_ROW_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <DualRowCategoryShowcase
              categoryId={cat.id}
              categoryName={cat.name}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}