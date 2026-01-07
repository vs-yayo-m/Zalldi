// src/data/categoriesData.js

export const CATEGORIES_DATA = [
  {
    id: 'grocery-kitchen',
    name: 'Grocery & Kitchen',
    icon: '🛒',
    color: '#10B981',
    categories: [
      {
        id: 'vegetables-fruits',
        name: 'Vegetables & Fruits',
        image: '/categories/vegetables-fruits.webp',
        banner: 'Healthy, juicy & seasonal',
        tagline: "Picked fresh from India's orchards",
        subcategories: [
          { id: 'fresh-vegetables', name: 'Fresh Vegetables', icon: '🥕' },
          { id: 'fresh-fruits', name: 'Fresh Fruits', icon: '🍎' },
          { id: 'leafy-greens', name: 'Leafy Greens', icon: '🥬' },
          { id: 'flowers', name: 'Flowers', icon: '🌺' },
          { id: 'seasonal', name: 'Seasonal', icon: '🍊' },
          { id: 'packed-vegs', name: 'Packed Vegs', icon: '📦' },
          { id: 'cut-prepared', name: 'Cut & Prepared', icon: '🔪' },
          { id: 'others-veg', name: 'Others', icon: '🌿' }
        ]
      },
      {
        id: 'atta-rice-dal',
        name: 'Atta, Rice & Dal',
        image: '/categories/atta-rice-dal.webp',
        banner: 'Pure & nutritious staples',
        tagline: 'Quality grains for every meal',
        subcategories: [
          { id: 'atta-flour', name: 'Atta & Flour', icon: '🌾' },
          { id: 'rice', name: 'Rice', icon: '🍚' },
          { id: 'dal-pulses', name: 'Dal & Pulses', icon: '🫘' },
          { id: 'grains-millets', name: 'Grains & Millets', icon: '🌽' },
          { id: 'baking-mix', name: 'Baking Mix', icon: '🧁' },
          { id: 'organic-grains', name: 'Organic', icon: '🌱' },
          { id: 'others-grains', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'oil-ghee-masala',
        name: 'Oil, Ghee & Masala',
        image: '/categories/oil-ghee-masala.webp',
        banner: 'Authentic flavors & aroma',
        tagline: 'Premium oils and spices',
        subcategories: [
          { id: 'mustard-oil', name: 'Mustard Oil', icon: '🫗' },
          { id: 'cooking-oils', name: 'Cooking Oils', icon: '🛢️' },
          { id: 'ghee-butter', name: 'Ghee & Butter', icon: '🧈' },
          { id: 'whole-spices', name: 'Whole Spices', icon: '🌶️' },
          { id: 'powder-masala', name: 'Powder Masala', icon: '🥘' },
          { id: 'salt-chat', name: 'Salt & Chat Masala', icon: '🧂' },
          { id: 'organic-spices', name: 'Organic', icon: '🌱' },
          { id: 'others-oil', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'dairy-bread-eggs',
        name: 'Dairy, Bread & Eggs',
        image: '/categories/dairy-bread-eggs.webp',
        banner: 'Fresh daily essentials',
        tagline: 'Farm-fresh dairy products',
        subcategories: [
          { id: 'milk', name: 'Milk', icon: '🥛' },
          { id: 'curd-yogurt', name: 'Curd & Yogurt', icon: '🍶' },
          { id: 'paneer-cheese', name: 'Paneer & Cheese', icon: '🧀' },
          { id: 'bread-buns', name: 'Bread & Buns', icon: '🍞' },
          { id: 'eggs', name: 'Eggs', icon: '🥚' },
          { id: 'others-dairy', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'bakery-biscuits',
        name: 'Bakery & Biscuits',
        image: '/categories/bakery-biscuits.webp',
        banner: 'Sweet treats & snacks',
        tagline: 'Freshly baked goodness',
        subcategories: [
          { id: 'cakes-rolls', name: 'Cakes & Rolls', icon: '🎂' },
          { id: 'biscuits', name: 'Biscuits', icon: '🍪' },
          { id: 'cookies', name: 'Cookies', icon: '🍪' },
          { id: 'healthy-bakes', name: 'Healthy Bakes', icon: '🥖' },
          { id: 'crackers', name: 'Crackers', icon: '🥐' },
          { id: 'rusk', name: 'Rusk', icon: '🍞' },
          { id: 'others-bakery', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'dry-fruits-cereals',
        name: 'Dry Fruits & Cereals',
        image: '/categories/dry-fruits-cereals.webp',
        banner: 'Nutrition powerhouse',
        tagline: 'Premium nuts and cereals',
        subcategories: [
          { id: 'dry-fruits-nuts', name: 'Dry Fruits & Nuts', icon: '🥜' },
          { id: 'seeds-mixes', name: 'Seeds & Mixes', icon: '🌻' },
          { id: 'breakfast-cereals', name: 'Breakfast Cereals', icon: '🥣' },
          { id: 'oats-muesli', name: 'Oats & Muesli', icon: '🌾' },
          { id: 'others-cereals', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'chicken-meat-fish',
        name: 'Chicken, Meat & Fish',
        image: '/categories/chicken-meat-fish.webp',
        banner: 'Fresh & hygienic',
        tagline: 'Quality meat products',
        subcategories: [
          { id: 'fresh-chicken', name: 'Fresh Chicken', icon: '🍗' },
          { id: 'mutton-meat', name: 'Mutton & Meat', icon: '🥩' },
          { id: 'fish-seafood', name: 'Fish & Seafood', icon: '🐟' },
          { id: 'ready-to-cook', name: 'Ready-to-Cook', icon: '🍲' },
          { id: 'processed-meat', name: 'Processed Meat', icon: '🥓' },
          { id: 'others-meat', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'kitchenware-appliances',
        name: 'Kitchenware & Appliances',
        image: '/categories/kitchenware-appliances.webp',
        banner: 'Kitchen essentials',
        tagline: 'Modern kitchen solutions',
        subcategories: [
          { id: 'cookware', name: 'Cookware', icon: '🍳' },
          { id: 'utensils', name: 'Utensils', icon: '🥄' },
          { id: 'small-appliances', name: 'Small Appliances', icon: '⚡' },
          { id: 'storage', name: 'Storage', icon: '📦' },
          { id: 'kitchen-cleaning', name: 'Kitchen Cleaning', icon: '🧽' },
          { id: 'others-kitchen', name: 'Others', icon: '🔧' }
        ]
      }
    ]
  },
  {
    id: 'snacks-drinks',
    name: 'Snacks & Drinks',
    icon: '🍿',
    color: '#F59E0B',
    categories: [
      {
        id: 'chips-namkeen',
        name: 'Chips & Namkeen',
        image: '/categories/chips-namkeen.webp',
        banner: 'Crunchy & tasty',
        tagline: 'Perfect munching companions',
        subcategories: [
          { id: 'potato-chips', name: 'Potato Chips', icon: '🥔' },
          { id: 'corn-multigrain', name: 'Corn & Multigrain', icon: '🌽' },
          { id: 'namkeen', name: 'Namkeen', icon: '🥨' },
          { id: 'party-packs', name: 'Party Packs', icon: '🎉' },
          { id: 'others-chips', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'sweets-chocolates',
        name: 'Sweets & Chocolates',
        image: '/categories/sweets-chocolates.webp',
        banner: 'Sweet indulgence',
        tagline: 'Delicious treats for everyone',
        subcategories: [
          { id: 'chocolates', name: 'Chocolates', icon: '🍫' },
          { id: 'candies', name: 'Candies', icon: '🍬' },
          { id: 'traditional-sweets', name: 'Traditional Sweets', icon: '🍮' },
          { id: 'gift-packs', name: 'Gift Packs', icon: '🎁' },
          { id: 'others-sweets', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'drinks-juices',
        name: 'Drinks & Juices',
        image: '/categories/drinks-juices.webp',
        banner: 'Refresh & energize',
        tagline: 'Quench your thirst',
        subcategories: [
          { id: 'juices', name: 'Juices', icon: '🧃' },
          { id: 'cold-drinks', name: 'Cold Drinks', icon: '🥤' },
          { id: 'energy-drinks', name: 'Energy Drinks', icon: '⚡' },
          { id: 'ready-drinks', name: 'Ready Drinks', icon: '🍹' },
          { id: 'others-drinks', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'tea-coffee-milk',
        name: 'Tea, Coffee & Milk Drinks',
        image: '/categories/tea-coffee-milk.webp',
        banner: 'Morning rituals',
        tagline: 'Perfect brew every time',
        subcategories: [
          { id: 'tea', name: 'Tea', icon: '🍵' },
          { id: 'coffee', name: 'Coffee', icon: '☕' },
          { id: 'milk-drinks', name: 'Milk Drinks', icon: '🥛' },
          { id: 'ready-tea-coffee', name: 'Ready Tea/Coffee', icon: '🧋' },
          { id: 'others-tea', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'instant-food',
        name: 'Instant Food',
        image: '/categories/instant-food.webp',
        banner: 'Quick & easy meals',
        tagline: 'Ready in minutes',
        subcategories: [
          { id: 'noodles', name: 'Noodles', icon: '🍜' },
          { id: 'ready-meals', name: 'Ready Meals', icon: '🍱' },
          { id: 'instant-rice-pasta', name: 'Instant Rice/Pasta', icon: '🍝' },
          { id: 'soups-mixes', name: 'Soups & Mixes', icon: '🥘' },
          { id: 'others-instant', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'sauces-spreads',
        name: 'Sauces & Spreads',
        image: '/categories/sauces-spreads.webp',
        banner: 'Flavor enhancers',
        tagline: 'Add taste to every meal',
        subcategories: [
          { id: 'sauces-ketchup', name: 'Sauces & Ketchup', icon: '🍅' },
          { id: 'chutney-pickle', name: 'Chutney & Pickle', icon: '🥒' },
          { id: 'spreads', name: 'Spreads', icon: '🥜' },
          { id: 'cooking-pastes', name: 'Cooking Pastes', icon: '🌶️' },
          { id: 'others-sauces', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'paan-corner',
        name: 'Paan Corner',
        image: '/categories/paan-corner.webp',
        banner: 'Traditional refreshment',
        tagline: 'Authentic Indian flavors',
        subcategories: [
          { id: 'paan-masala', name: 'Paan Masala', icon: '🌿' },
          { id: 'mouth-fresheners', name: 'Mouth Fresheners', icon: '🍃' },
          { id: 'others-paan', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'ice-creams-more',
        name: 'Ice Creams & More',
        image: '/categories/ice-creams-more.webp',
        banner: 'Cool delights',
        tagline: 'Beat the heat',
        subcategories: [
          { id: 'ice-cream', name: 'Ice Cream', icon: '🍦' },
          { id: 'frozen-bars', name: 'Frozen Bars', icon: '🍡' },
          { id: 'frozen-desserts', name: 'Frozen Desserts', icon: '🍨' },
          { id: 'others-frozen', name: 'Others', icon: '📦' }
        ]
      }
    ]
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    icon: '💄',
    color: '#EC4899',
    categories: [
      {
        id: 'bath-body',
        name: 'Bath & Body',
        image: '/categories/bath-body.webp',
        banner: 'Pamper yourself',
        tagline: 'Nourish your skin',
        subcategories: [
          { id: 'soaps-body-wash', name: 'Soaps & Body Wash', icon: '🧼' },
          { id: 'lotions-creams', name: 'Lotions & Creams', icon: '🧴' },
          { id: 'scrubs', name: 'Scrubs', icon: '🫧' },
          { id: 'hand-foot-care', name: 'Hand & Foot Care', icon: '👐' },
          { id: 'others-bath', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'hair-care',
        name: 'Hair',
        image: '/categories/hair-care.webp',
        banner: 'Healthy hair goals',
        tagline: 'Premium hair care',
        subcategories: [
          { id: 'shampoo-conditioner', name: 'Shampoo & Conditioner', icon: '🧴' },
          { id: 'hair-oil', name: 'Hair Oil', icon: '🫗' },
          { id: 'hair-treatment', name: 'Hair Treatment', icon: '💆' },
          { id: 'anti-dandruff', name: 'Anti-Dandruff', icon: '❄️' },
          { id: 'others-hair', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'skin-face',
        name: 'Skin & Face',
        image: '/categories/skin-face.webp',
        banner: 'Radiant skin',
        tagline: 'Glow naturally',
        subcategories: [
          { id: 'face-wash', name: 'Face Wash', icon: '🧴' },
          { id: 'cream-moisturiser', name: 'Cream & Moisturiser', icon: '🧴' },
          { id: 'sunscreen', name: 'Sunscreen', icon: '☀️' },
          { id: 'masks-care', name: 'Masks & Care', icon: '🎭' },
          { id: 'others-skin', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'beauty-cosmetics',
        name: 'Beauty & Cosmetics',
        image: '/categories/beauty-cosmetics.webp',
        banner: 'Glamour essentials',
        tagline: 'Enhance your beauty',
        subcategories: [
          { id: 'face-makeup', name: 'Face Makeup', icon: '💄' },
          { id: 'eye-makeup', name: 'Eye Makeup', icon: '👁️' },
          { id: 'lip-makeup', name: 'Lip Makeup', icon: '💋' },
          { id: 'makeup-tools', name: 'Tools', icon: '🖌️' },
          { id: 'others-cosmetics', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'feminine-hygiene',
        name: 'Feminine Hygiene',
        image: '/categories/feminine-hygiene.webp',
        banner: 'Comfort & care',
        tagline: 'Period essentials',
        subcategories: [
          { id: 'sanitary-pads', name: 'Sanitary Pads', icon: '🩸' },
          { id: 'tampons-cups', name: 'Tampons & Cups', icon: '🔴' },
          { id: 'intimate-care', name: 'Intimate Care', icon: '💜' },
          { id: 'others-feminine', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'baby-care',
        name: 'Baby Care',
        image: '/categories/baby-care.webp',
        banner: 'Gentle for babies',
        tagline: 'Safe & trusted products',
        subcategories: [
          { id: 'baby-bath', name: 'Baby Bath', icon: '🛁' },
          { id: 'diapers-wipes', name: 'Diapers & Wipes', icon: '👶' },
          { id: 'baby-food', name: 'Baby Food', icon: '🍼' },
          { id: 'others-baby', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'health-pharma',
        name: 'Health & Pharma',
        image: '/categories/health-pharma.webp',
        banner: 'Wellness first',
        tagline: 'Stay healthy',
        subcategories: [
          { id: 'medicines', name: 'Medicines', icon: '💊' },
          { id: 'vitamins', name: 'Vitamins', icon: '🧪' },
          { id: 'first-aid', name: 'First Aid', icon: '🩹' },
          { id: 'health-devices', name: 'Health Devices', icon: '🩺' },
          { id: 'others-health', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'sexual-wellness',
        name: 'Sexual Wellness',
        image: '/categories/sexual-wellness.webp',
        banner: 'Private & discreet',
        tagline: 'Safe intimacy',
        subcategories: [
          { id: 'condoms', name: 'Condoms', icon: '🛡️' },
          { id: 'lubricants', name: 'Lubricants', icon: '💧' },
          { id: 'intimate-care-wellness', name: 'Intimate Care', icon: '💜' },
          { id: 'others-wellness', name: 'Others', icon: '📦' }
        ]
      }
    ]
  },
  {
    id: 'household-essentials',
    name: 'Household Essentials',
    icon: '🏠',
    color: '#8B5CF6',
    categories: [
      {
        id: 'home-lifestyle',
        name: 'Home & Lifestyle',
        image: '/categories/home-lifestyle.webp',
        banner: 'Make home beautiful',
        tagline: 'Everyday essentials',
        subcategories: [
          { id: 'home-utility', name: 'Home Utility', icon: '🏠' },
          { id: 'storage-home', name: 'Storage', icon: '📦' },
          { id: 'daily-needs', name: 'Daily Needs', icon: '🔧' },
          { id: 'others-home', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'cleaners-repellents',
        name: 'Cleaners & Repellents',
        image: '/categories/cleaners-repellents.webp',
        banner: 'Sparkle clean',
        tagline: 'Hygiene solutions',
        subcategories: [
          { id: 'floor-surface-cleaners', name: 'Floor & Surface Cleaners', icon: '🧹' },
          { id: 'dish-laundry', name: 'Dish & Laundry', icon: '🧺' },
          { id: 'mosquito-pest', name: 'Mosquito & Pest', icon: '🦟' },
          { id: 'others-cleaners', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'electronics',
        name: 'Electronics',
        image: '/categories/electronics.webp',
        banner: 'Tech essentials',
        tagline: 'Stay connected',
        subcategories: [
          { id: 'chargers-cables', name: 'Chargers & Cables', icon: '🔌' },
          { id: 'batteries', name: 'Batteries', icon: '🔋' },
          { id: 'small-electronics', name: 'Small Electronics', icon: '📱' },
          { id: 'others-electronics', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'stationery-games',
        name: 'Stationery & Games',
        image: '/categories/stationery-games.webp',
        banner: 'Learning & fun',
        tagline: 'Creative essentials',
        subcategories: [
          { id: 'school-office', name: 'School & Office', icon: '📝' },
          { id: 'writing-items', name: 'Writing Items', icon: '✏️' },
          { id: 'games-puzzles', name: 'Games & Puzzles', icon: '🎲' },
          { id: 'others-stationery', name: 'Others', icon: '📦' }
        ]
      }
    ]
  },
  {
    id: 'shop-by-store',
    name: 'Shop by Store',
    icon: '🏪',
    color: '#3B82F6',
    categories: [
      {
        id: 'spiritual-store',
        name: 'Spiritual Store',
        image: '/categories/spiritual-store.webp',
        banner: 'Divine collection',
        tagline: 'Spiritual essentials',
        subcategories: [
          { id: 'puja-items', name: 'Puja Items', icon: '🪔' },
          { id: 'incense-dhoop', name: 'Incense & Dhoop', icon: '🕉️' },
          { id: 'idols', name: 'Idols', icon: '🙏' },
          { id: 'others-spiritual', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'pharma-store',
        name: 'Pharma Store',
        image: '/categories/pharma-store.webp',
        banner: 'Healthcare hub',
        tagline: 'Medicines delivered',
        subcategories: [
          { id: 'medicines-pharma', name: 'Medicines', icon: '💊' },
          { id: 'wellness-pharma', name: 'Wellness', icon: '🧘' },
          { id: 'medical-supplies', name: 'Medical Supplies', icon: '🩺' },
          { id: 'others-pharma', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'egifts-store',
        name: 'E-Gifts',
        image: '/categories/egifts-store.webp',
        banner: 'Gift with love',
        tagline: 'Perfect presents',
        subcategories: [
          { id: 'gift-cards', name: 'Gift Cards', icon: '💳' },
          { id: 'gift-combos', name: 'Gift Combos', icon: '🎁' },
          { id: 'others-gifts', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'pet-store',
        name: 'Pet Store',
        image: '/categories/pet-store.webp',
        banner: 'Pet care',
        tagline: 'Happy pets, happy you',
        subcategories: [
          { id: 'pet-food', name: 'Pet Food', icon: '🦴' },
          { id: 'grooming', name: 'Grooming', icon: '✂️' },
          { id: 'accessories-pet', name: 'Accessories', icon: '🐾' },
          { id: 'others-pet', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'sports-store',
        name: 'Sports',
        image: '/categories/sports-store.webp',
        banner: 'Get fit',
        tagline: 'Sports & fitness',
        subcategories: [
          { id: 'fitness-items', name: 'Fitness Items', icon: '🏋️' },
          { id: 'sports-gear', name: 'Sports Gear', icon: '⚽' },
          { id: 'bottles-supports', name: 'Bottles & Supports', icon: '🥤' },
          { id: 'others-sports', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'fashion-basics',
        name: 'Fashion Basics Store',
        image: '/categories/fashion-basics.webp',
        banner: 'Style essentials',
        tagline: 'Everyday fashion',
        subcategories: [
          { id: 'innerwear', name: 'Innerwear', icon: '👕' },
          { id: 'top-collection', name: 'Top Collection', icon: '👔' },
          { id: 'socks', name: 'Socks', icon: '🧦' },
          { id: 'daily-wear', name: 'Daily Wear', icon: '👗' },
          { id: 'others-fashion', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'toy-store',
        name: 'Toy Store',
        image: '/categories/toy-store.webp',
        banner: 'Fun & learning',
        tagline: 'Joy for kids',
        subcategories: [
          { id: 'learning-toys', name: 'Learning Toys', icon: '🧩' },
          { id: 'action-toys', name: 'Action Toys', icon: '🚗' },
          { id: 'creative-toys', name: 'Creative Toys', icon: '🎨' },
          { id: 'others-toys', name: 'Others', icon: '📦' }
        ]
      },
      {
        id: 'book-store',
        name: 'Book Store',
        image: '/categories/book-store.webp',
        banner: 'Knowledge corner',
        tagline: 'Read & grow',
        subcategories: [
          { id: 'fiction', name: 'Fiction', icon: '📖' },
          { id: 'non-fiction', name: 'Non-Fiction', icon: '📚' },
          { id: 'kids-books', name: 'Kids Books', icon: '📕' },
          { id: 'academic', name: 'Academic', icon: '📘' },
          { id: 'school-books', name: 'School Books', icon: '📗' },
          { id: 'others-books', name: 'Others', icon: '📦' }
        ]
      }
    ]
  }
];

export const getAllCategories = () => {
  return CATEGORIES_DATA.flatMap(group => 
    group.categories.map(cat => ({
      ...cat,
      groupId: group.id,
      groupName: group.name,
      groupColor: group.color
    }))
  );
};

export const getCategoryById = (categoryId) => {
  for (const group of CATEGORIES_DATA) {
    const found = group.categories.find(cat => cat.id === categoryId);
    if (found) {
      return {
        ...found,
        groupId: group.id,
        groupName: group.name,
        groupColor: group.color,
        subcategories: found.subcategories || []
      };
    }
  }
  return null;
};

export const getSubcategories = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories || [];
};

export const getAllSubcategories = () => {
  return CATEGORIES_DATA.flatMap(group =>
    group.categories.flatMap(cat =>
      (cat.subcategories || []).map(sub => ({
        ...sub,
        categoryId: cat.id,
        categoryName: cat.name,
        groupId: group.id
      }))
    )
  );
};