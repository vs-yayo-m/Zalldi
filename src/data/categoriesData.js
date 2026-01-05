// src/data/categoriesData.js

export const CATEGORIES_DATA = [
  {
    id: 'grocery-kitchen',
    name: 'Grocery & Kitchen',
    icon: '🛒',
    color: '#10B981',
    subcategories: [
      { id: 'vegetables-fruits', name: 'Vegetables & Fruits', image: '/categories/vegetables-fruits.webp' },
      { id: 'atta-rice-dal', name: 'Atta, Rice & Dal', image: '/categories/atta-rice-dal.webp' },
      { id: 'oil-ghee-masala', name: 'Oil, Ghee & Masala', image: '/categories/oil-ghee-masala.webp' },
      { id: 'dairy-bread-eggs', name: 'Dairy, Bread & Eggs', image: '/categories/dairy-bread-eggs.webp' },
      { id: 'bakery-biscuits', name: 'Bakery & Biscuits', image: '/categories/bakery-biscuits.webp' },
      { id: 'dry-fruits-cereals', name: 'Dry Fruits & Cereals', image: '/categories/dry-fruits-cereals.webp' },
      { id: 'chicken-meat-fish', name: 'Chicken, Meat & Fish', image: '/categories/chicken-meat-fish.webp' },
      { id: 'kitchenware-appliances', name: 'Kitchenware & Appliances', image: '/categories/kitchenware-appliances.webp' }
    ]
  },
  {
    id: 'snacks-drinks',
    name: 'Snacks & Drinks',
    icon: '🍿',
    color: '#F59E0B',
    subcategories: [
      { id: 'chips-namkeen', name: 'Chips & Namkeen', image: '/categories/chips-namkeen.webp' },
      { id: 'sweets-chocolates', name: 'Sweets & Chocolates', image: '/categories/sweets-chocolates.webp' },
      { id: 'drinks-juices', name: 'Drinks & Juices', image: '/categories/drinks-juices.webp' },
      { id: 'tea-coffee-milk', name: 'Tea, Coffee & Milk Drinks', image: '/categories/tea-coffee-milk.webp' },
      { id: 'instant-food', name: 'Instant Food', image: '/categories/instant-food.webp' },
      { id: 'sauces-spreads', name: 'Sauces & Spreads', image: '/categories/sauces-spreads.webp' },
      { id: 'paan-corner', name: 'Paan Corner', image: '/categories/paan-corner.webp' },
      { id: 'ice-creams-more', name: 'Ice Creams & More', image: '/categories/ice-creams-more.webp' }
    ]
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    icon: '💄',
    color: '#EC4899',
    subcategories: [
      { id: 'bath-body', name: 'Bath & Body', image: '/categories/bath-body.webp' },
      { id: 'hair-care', name: 'Hair', image: '/categories/hair-care.webp' },
      { id: 'skin-face', name: 'Skin & Face', image: '/categories/skin-face.webp' },
      { id: 'beauty-cosmetics', name: 'Beauty & Cosmetics', image: '/categories/beauty-cosmetics.webp' },
      { id: 'feminine-hygiene', name: 'Feminine Hygiene', image: '/categories/feminine-hygiene.webp' },
      { id: 'baby-care', name: 'Baby Care', image: '/categories/baby-care.webp' },
      { id: 'health-pharma', name: 'Health & Pharma', image: '/categories/health-pharma.webp' },
      { id: 'sexual-wellness', name: 'Sexual Wellness', image: '/categories/sexual-wellness.webp' }
    ]
  },
  {
    id: 'household-essentials',
    name: 'Household Essentials',
    icon: '🏠',
    color: '#8B5CF6',
    subcategories: [
      { id: 'home-lifestyle', name: 'Home & Lifestyle', image: '/categories/home-lifestyle.webp' },
      { id: 'cleaners-repellents', name: 'Cleaners & Repellents', image: '/categories/cleaners-repellents.webp' },
      { id: 'electronics', name: 'Electronics', image: '/categories/electronics.webp' },
      { id: 'stationery-games', name: 'Stationery & Games', image: '/categories/stationery-games.webp' }
    ]
  },
  {
    id: 'shop-by-store',
    name: 'Shop by Store',
    icon: '🏪',
    color: '#3B82F6',
    subcategories: [
      { id: 'spiritual-store', name: 'Spiritual Store', image: '/categories/spiritual-store.webp' },
      { id: 'pharma-store', name: 'Pharma Store', image: '/categories/pharma-store.webp' },
      { id: 'egifts-store', name: 'E-Gifts', image: '/categories/egifts-store.webp' },
      { id: 'pet-store', name: 'Pet Store', image: '/categories/pet-store.webp' },
      { id: 'sports-store', name: 'Sports', image: '/categories/sports-store.webp' },
      { id: 'fashion-basics', name: 'Fashion Basics Store', image: '/categories/fashion-basics.webp' },
      { id: 'toy-store', name: 'Toy Store', image: '/categories/toy-store.webp' },
      { id: 'book-store', name: 'Book Store', image: '/categories/book-store.webp' }
    ]
  }
];

export const getAllCategories = () => {
  return CATEGORIES_DATA.flatMap(section => 
    section.subcategories.map(sub => ({
      ...sub,
      parentId: section.id,
      parentName: section.name,
      parentColor: section.color
    }))
  );
};

export const getCategoryById = (categoryId) => {
  for (const section of CATEGORIES_DATA) {
    const found = section.subcategories.find(sub => sub.id === categoryId);
    if (found) {
      return {
        ...found,
        parentId: section.id,
        parentName: section.name,
        parentColor: section.color
      };
    }
  }
  return null;
};

export const getCategoriesBySection = (sectionId) => {
  const section = CATEGORIES_DATA.find(s => s.id === sectionId);
  return section ? section.subcategories : [];
};