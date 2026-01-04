// src/data/categoriesData.js

export const CATEGORIES_DATA = [
  {
    id: 'grocery-kitchen',
    name: 'Grocery & Kitchen',
    icon: '🛒',
    color: '#10B981',
    subcategories: [
      { id: 'vegetables-fruits', name: 'Vegetables & Fruits', image: '/categories/vegetables.webp' },
      { id: 'atta-rice-dal', name: 'Atta, Rice & Dal', image: '/categories/atta-rice.webp' },
      { id: 'oil-ghee-masala', name: 'Oil, Ghee & Masala', image: '/categories/oil-masala.webp' },
      { id: 'dairy-bread-eggs', name: 'Dairy, Bread & Eggs', image: '/categories/dairy.webp' },
      { id: 'bakery-biscuits', name: 'Bakery & Biscuits', image: '/categories/bakery.webp' },
      { id: 'dry-fruits-cereals', name: 'Dry Fruits & Cereals', image: '/categories/dry-fruits.webp' },
      { id: 'chicken-meat-fish', name: 'Chicken, Meat & Fish', image: '/categories/meat.webp' },
      { id: 'kitchenware-appliances', name: 'Kitchenware & Appliances', image: '/categories/kitchenware.webp' }
    ]
  },
  {
    id: 'snacks-drinks',
    name: 'Snacks & Drinks',
    icon: '🍿',
    color: '#F59E0B',
    subcategories: [
      { id: 'chips-namkeen', name: 'Chips & Namkeen', image: '/categories/chips.webp' },
      { id: 'sweets-chocolates', name: 'Sweets & Chocolates', image: '/categories/sweets.webp' },
      { id: 'drinks-juices', name: 'Drinks & Juices', image: '/categories/drinks.webp' },
      { id: 'tea-coffee-milk', name: 'Tea, Coffee & Milk Drinks', image: '/categories/tea-coffee.webp' },
      { id: 'instant-food', name: 'Instant Food', image: '/categories/instant.webp' },
      { id: 'sauces-spreads', name: 'Sauces & Spreads', image: '/categories/sauces.webp' },
      { id: 'paan-corner', name: 'Paan Corner', image: '/categories/paan.webp' },
      { id: 'ice-creams-more', name: 'Ice Creams & More', image: '/categories/icecream.webp' }
    ]
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    icon: '💄',
    color: '#EC4899',
    subcategories: [
      { id: 'bath-body', name: 'Bath & Body', image: '/categories/bath.webp' },
      { id: 'hair-care', name: 'Hair', image: '/categories/hair.webp' },
      { id: 'skin-face', name: 'Skin & Face', image: '/categories/skin.webp' },
      { id: 'beauty-cosmetics', name: 'Beauty & Cosmetics', image: '/categories/cosmetics.webp' },
      { id: 'feminine-hygiene', name: 'Feminine Hygiene', image: '/categories/feminine.webp' },
      { id: 'baby-care', name: 'Baby Care', image: '/categories/baby.webp' },
      { id: 'health-pharma', name: 'Health & Pharma', image: '/categories/pharma.webp' },
      { id: 'sexual-wellness', name: 'Sexual Wellness', image: '/categories/wellness.webp' }
    ]
  },
  {
    id: 'household-essentials',
    name: 'Household Essentials',
    icon: '🏠',
    color: '#8B5CF6',
    subcategories: [
      { id: 'home-lifestyle', name: 'Home & Lifestyle', image: '/categories/home.webp' },
      { id: 'cleaners-repellents', name: 'Cleaners & Repellents', image: '/categories/cleaners.webp' },
      { id: 'electronics', name: 'Electronics', image: '/categories/electronics.webp' },
      { id: 'stationery-games', name: 'Stationery & Games', image: '/categories/stationery.webp' }
    ]
  },
  {
    id: 'shop-by-store',
    name: 'Shop by Store',
    icon: '🏪',
    color: '#3B82F6',
    subcategories: [
      { id: 'spiritual-store', name: 'Spiritual Store', image: '/categories/spiritual.webp' },
      { id: 'pharma-store', name: 'Pharma Store', image: '/categories/pharma-store.webp' },
      { id: 'egifts-store', name: 'E-Gifts', image: '/categories/egifts.webp' },
      { id: 'pet-store', name: 'Pet Store', image: '/categories/pet.webp' },
      { id: 'sports-store', name: 'Sports', image: '/categories/sports.webp' },
      { id: 'fashion-basics', name: 'Fashion Basics Store', image: '/categories/fashion.webp' },
      { id: 'toy-store', name: 'Toy Store', image: '/categories/toys.webp' },
      { id: 'book-store', name: 'Book Store', image: '/categories/books.webp' }
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