// src/data/categoriesStructure.js

export const CATEGORIES_STRUCTURE = [
  {
    groupId: 'grocery-kitchen',
    groupName: 'Grocery & Kitchen',
    groupIcon: '🛒',
    groupColor: '#10B981',
    categories: [
      {
        id: 'vegetables-fruits',
        name: 'Vegetables & Fruits',
        image: '/categories/vegetables-fruits.webp',
        subcategories: [
          { id: 'fresh-vegetables', name: 'Fresh Vegetables', image: '/category/vegetables-fruits/fresh-vegetables.webp' },
          { id: 'fresh-fruits', name: 'Fresh Fruits', image: '/category/vegetables-fruits/fresh-fruits.webp' },
          { id: 'leafy-greens', name: 'Leafy Greens', image: '/category/vegetables-fruits/leafy-greens.webp' },
          { id: 'flowers', name: 'Flowers', image: '/category/vegetables-fruits/flowers.webp' },
          { id: 'seasonal', name: 'Seasonal', image: '/category/vegetables-fruits/seasonal.webp' },
          { id: 'packed-frozen', name: 'Packed & Frozen', image: '/category/vegetables-fruits/packed-frozen.webp' },
          { id: 'cut-prepared', name: 'Cut & Prepared', image: '/category/vegetables-fruits/cut-prepared.webp' },
          { id: 'plants-gardening', name: 'Plants & Gardening', image: '/category/vegetables-fruits/plants-gardening.webp' },
          { id: 'others-veg', name: 'Others', image: '/category/vegetables-fruits/others.webp' }
        ]
      },
      {
        id: 'flour-rice-dal',
        name: 'Flour, Rice & Dal',
        image: '/categories/flour-rice-dal.webp',
        subcategories: [
          { id: 'atta-flour', name: 'Atta & Flour', image: '/category/flour-rice-dal/atta-flour.webp' },
          { id: 'rice-premium', name: 'Rice & Premium', image: '/category/flour-rice-dal/rice-premium.webp' },
          { id: 'dal-pulses', name: 'Dal & Pulses', image: '/category/flour-rice-dal/dal-pulses.webp' },
          { id: 'besan-sooji', name: 'Besan & Sooji', image: '/category/flour-rice-dal/besan-sooji.webp' },
          { id: 'grains-millets', name: 'Grains & Millets', image: '/category/flour-rice-dal/grains-millets.webp' },
          { id: 'baking-mix', name: 'Baking Mix', image: '/category/flour-rice-dal/baking-mix.webp' },
          { id: 'organic-flour', name: 'Organic', image: '/category/flour-rice-dal/organic.webp' },
          { id: 'others-flour', name: 'Others', image: '/category/flour-rice-dal/others.webp' }
        ]
      },
      {
        id: 'oil-ghee-masala',
        name: 'Oil, Ghee & Masala',
        image: '/categories/oil-ghee-masala.webp',
        subcategories: [
          { id: 'mustard-oil', name: 'Mustard Oil', image: '/category/oil-ghee-masala/mustard-oil.webp' },
          { id: 'cooking-oils', name: 'Cooking Oils', image: '/category/oil-ghee-masala/cooking-oils.webp' },
          { id: 'ghee-butter', name: 'Ghee & Butter', image: '/category/oil-ghee-masala/ghee-butter.webp' },
          { id: 'whole-spices', name: 'Whole Spices', image: '/category/oil-ghee-masala/whole-spices.webp' },
          { id: 'powder-masala', name: 'Powder Masala', image: '/category/oil-ghee-masala/powder-masala.webp' },
          { id: 'salt-sugar', name: 'Salt & Sugar', image: '/category/oil-ghee-masala/salt-sugar.webp' },
          { id: 'organic-masala', name: 'Organic', image: '/category/oil-ghee-masala/organic.webp' },
          { id: 'others-masala', name: 'Others', image: '/category/oil-ghee-masala/others.webp' }
        ]
      },
      {
        id: 'dairy-bread-eggs',
        name: 'Dairy, Bread & Eggs',
        image: '/categories/dairy-bread-eggs.webp',
        subcategories: [
          { id: 'milk-butter', name: 'Milk & Butter', image: '/category/dairy-bread-eggs/milk-butter.webp' },
          { id: 'curd-yogurt', name: 'Curd & Yogurt', image: '/category/dairy-bread-eggs/curd-yogurt.webp' },
          { id: 'paneer-cheese', name: 'Paneer & Cheese', image: '/category/dairy-bread-eggs/paneer-cheese.webp' },
          { id: 'bread-buns', name: 'Bread & Buns', image: '/category/dairy-bread-eggs/bread-buns.webp' },
          { id: 'eggs', name: 'Eggs', image: '/category/dairy-bread-eggs/eggs.webp' },
          { id: 'others-dairy', name: 'Others', image: '/category/dairy-bread-eggs/others.webp' }
        ]
      },
      {
        id: 'bakery-biscuits',
        name: 'Bakery & Biscuits',
        image: '/categories/bakery-biscuits.webp',
        subcategories: [
          { id: 'cakes-party', name: 'Cakes & Party', image: '/category/bakery-biscuits/cakes-party.webp' },
          { id: 'cream-biscuits', name: 'Cream & Biscuits', image: '/category/bakery-biscuits/cream-biscuits.webp' },
          { id: 'cookies-wafer', name: 'Cookies & Wafer', image: '/category/bakery-biscuits/cookies-wafer.webp' },
          { id: 'healthy-digestive', name: 'Healthy & Digestive', image: '/category/bakery-biscuits/healthy-digestive.webp' },
          { id: 'crackers-rusk', name: 'Crackers & Rusk', image: '/category/bakery-biscuits/crackers-rusk.webp' },
          { id: 'others-bakery', name: 'Others', image: '/category/bakery-biscuits/others.webp' }
        ]
      },
      {
        id: 'dry-fruits-cereals',
        name: 'Dry Fruits & Cereals',
        image: '/categories/dry-fruits-cereals.webp',
        subcategories: [
          { id: 'dry-fruits-nuts', name: 'Dry Fruits & Nuts', image: '/category/dry-fruits-cereals/dry-fruits-nuts.webp' },
          { id: 'seeds-mixes', name: 'Seeds & Mixes', image: '/category/dry-fruits-cereals/seeds-mixes.webp' },
          { id: 'breakfast-cereals', name: 'Breakfast Cereals', image: '/category/dry-fruits-cereals/breakfast-cereals.webp' },
          { id: 'oats-muesli', name: 'Oats & Muesli', image: '/category/dry-fruits-cereals/oats-muesli.webp' },
          { id: 'premium-organic-dry', name: 'Premium & Organic', image: '/category/dry-fruits-cereals/premium-organic.webp' },
          { id: 'others-dry', name: 'Others', image: '/category/dry-fruits-cereals/others.webp' }
        ]
      },
      {
        id: 'chicken-meat-fish',
        name: 'Chicken, Meat & Fish',
        image: '/categories/chicken-meat-fish.webp',
        subcategories: [
          { id: 'fresh-chicken', name: 'Fresh Chicken', image: '/category/chicken-meat-fish/fresh-chicken.webp' },
          { id: 'mutton-meat', name: 'Mutton & Meat', image: '/category/chicken-meat-fish/mutton-meat.webp' },
          { id: 'fish-seafood', name: 'Fish & Seafood', image: '/category/chicken-meat-fish/fish-seafood.webp' },
          { id: 'ready-to-cook', name: 'Ready-to-Cook', image: '/category/chicken-meat-fish/ready-to-cook.webp' },
          { id: 'processed-meat', name: 'Processed Meat', image: '/category/chicken-meat-fish/processed-meat.webp' },
          { id: 'others-eggs', name: 'Others Eggs', image: '/category/chicken-meat-fish/others-eggs.webp' },
          { id: 'others-meat', name: 'Others', image: '/category/chicken-meat-fish/others.webp' }
        ]
      },
      {
        id: 'kitchenware-appliances',
        name: 'Kitchenware & Appliances',
        image: '/categories/kitchenware-appliances.webp',
        subcategories: [
          { id: 'cookware-sets', name: 'Cookware & Sets', image: '/category/kitchenware-appliances/cookware-sets.webp' },
          { id: 'utensils', name: 'Utensils', image: '/category/kitchenware-appliances/utensils.webp' },
          { id: 'kitchen-appliances', name: 'Kitchen Appliances', image: '/category/kitchenware-appliances/kitchen-appliances.webp' },
          { id: 'box-storage', name: 'Box & Storage', image: '/category/kitchenware-appliances/box-storage.webp' },
          { id: 'kitchen-cleaning', name: 'Kitchen Cleaning', image: '/category/kitchenware-appliances/kitchen-cleaning.webp' },
          { id: 'bottle-plastic', name: 'Bottle & Plastic', image: '/category/kitchenware-appliances/bottle-plastic.webp' },
          { id: 'cups-plates', name: 'Cups & Plates', image: '/category/kitchenware-appliances/cups-plates.webp' },
          { id: 'kitchen-accessories', name: 'Kitchen Accessories', image: '/category/kitchenware-appliances/kitchen-accessories.webp' },
          { id: 'tiffin-lunch', name: 'Tiffin & Lunch', image: '/category/kitchenware-appliances/tiffin-lunch.webp' },
          { id: 'tissues-other', name: 'Tissues & Other', image: '/category/kitchenware-appliances/tissues-other.webp' },
          { id: 'others-kitchen', name: 'Others', image: '/category/kitchenware-appliances/others.webp' }
        ]
      }
    ]
  },
  {
    groupId: 'snacks-drinks',
    groupName: 'Snacks & Drinks',
    groupIcon: '🍿',
    groupColor: '#F59E0B',
    categories: [
      {
        id: 'chips-namkeen',
        name: 'Chips & Namkeen',
        image: '/categories/chips-namkeen.webp',
        subcategories: [
          { id: 'chips-kurkure', name: 'Chips & Kurkure', image: '/category/chips-namkeen/chips-kurkure.webp' },
          { id: 'namkeen-mixture', name: 'Namkeen & Mixture', image: '/category/chips-namkeen/namkeen-mixture.webp' },
          { id: 'healthy-snack', name: 'Healthy Snack', image: '/category/chips-namkeen/healthy-snack.webp' },
          { id: 'party-packs', name: 'Party Packs', image: '/category/chips-namkeen/party-packs.webp' },
          { id: 'premium-snacks', name: 'Premium', image: '/category/chips-namkeen/premium.webp' },
          { id: 'others-chips', name: 'Others', image: '/category/chips-namkeen/others.webp' }
        ]
      },
      {
        id: 'sweets-chocolates',
        name: 'Sweets & Chocolates',
        image: '/categories/sweets-chocolates.webp',
        subcategories: [
          { id: 'chocolates', name: 'Chocolates', image: '/category/sweets-chocolates/chocolates.webp' },
          { id: 'candies-gum', name: 'Candies & Gum', image: '/category/sweets-chocolates/candies-gum.webp' },
          { id: 'traditional-sweets', name: 'Traditional Sweets', image: '/category/sweets-chocolates/traditional-sweets.webp' },
          { id: 'premium-sweets', name: 'Premium Sweets', image: '/category/sweets-chocolates/premium-sweets.webp' },
          { id: 'gift-packs', name: 'Gift Packs', image: '/category/sweets-chocolates/gift-packs.webp' },
          { id: 'premium-chocolates', name: 'Premium Chocolates', image: '/category/sweets-chocolates/premium-chocolates.webp' },
          { id: 'others-sweets', name: 'Others', image: '/category/sweets-chocolates/others.webp' }
        ]
      },
      {
        id: 'drinks-juices',
        name: 'Drinks & Juices',
        image: '/categories/drinks-juices.webp',
        subcategories: [
          { id: 'fruit-juices', name: 'Fruit Juices', image: '/category/drinks-juices/fruit-juices.webp' },
          { id: 'cold-drinks', name: 'Cold Drinks', image: '/category/drinks-juices/cold-drinks.webp' },
          { id: 'energy-drinks', name: 'Energy Drinks', image: '/category/drinks-juices/energy-drinks.webp' },
          { id: 'cold-coffee-drinks', name: 'Cold Coffee', image: '/category/drinks-juices/cold-coffee.webp' },
          { id: 'premium-drinks', name: 'Premium Drink', image: '/category/drinks-juices/premium-drinks.webp' },
          { id: 'others-drinks', name: 'Others', image: '/category/drinks-juices/others.webp' }
        ]
      },
      {
        id: 'tea-coffee-milk',
        name: 'Tea, Coffee & Milk Drinks',
        image: '/categories/tea-coffee-milk.webp',
        subcategories: [
          { id: 'tea', name: 'Tea', image: '/category/tea-coffee-milk/tea.webp' },
          { id: 'coffee', name: 'Coffee', image: '/category/tea-coffee-milk/coffee.webp' },
          { id: 'milk-drinks', name: 'Milk Drinks', image: '/category/tea-coffee-milk/milk-drinks.webp' },
          { id: 'green-tea', name: 'Green Tea', image: '/category/tea-coffee-milk/green-tea.webp' },
          { id: 'cold-coffee-tea', name: 'Cold Coffee', image: '/category/tea-coffee-milk/cold-coffee.webp' },
          { id: 'premium-tea-coffee', name: 'Premium', image: '/category/tea-coffee-milk/premium.webp' },
          { id: 'others-tea', name: 'Others', image: '/category/tea-coffee-milk/others.webp' }
        ]
      },
      {
        id: 'instant-food',
        name: 'Instant Food',
        image: '/categories/instant-food.webp',
        subcategories: [
          { id: 'noodles-chawchaw', name: 'Noodles & Chawchaw', image: '/category/instant-food/noodles-chawchaw.webp' },
          { id: 'pasta-snacks', name: 'Pasta & Snacks', image: '/category/instant-food/pasta-snacks.webp' },
          { id: 'ready-to-eat', name: 'Ready to Eat', image: '/category/instant-food/ready-to-eat.webp' },
          { id: 'soups-mixes', name: 'Soups & Mixes', image: '/category/instant-food/soups-mixes.webp' },
          { id: 'organic-premium-instant', name: 'Organic & Premium', image: '/category/instant-food/organic-premium.webp' },
          { id: 'others-instant', name: 'Others', image: '/category/instant-food/others.webp' }
        ]
      },
      {
        id: 'sauces-spreads',
        name: 'Sauces & Spreads',
        image: '/categories/sauces-spreads.webp',
        subcategories: [
          { id: 'sauces-ketchup', name: 'Sauces & Ketchup', image: '/category/sauces-spreads/sauces-ketchup.webp' },
          { id: 'chutney-pickle', name: 'Chutney & Pickle', image: '/category/sauces-spreads/chutney-pickle.webp' },
          { id: 'spreads', name: 'Spreads', image: '/category/sauces-spreads/spreads.webp' },
          { id: 'tomato-ketchup', name: 'Tomato Ketchup', image: '/category/sauces-spreads/tomato-ketchup.webp' },
          { id: 'peanut-butter', name: 'Peanut Butter', image: '/category/sauces-spreads/peanut-butter.webp' },
          { id: 'cooking-pastes', name: 'Cooking Pastes', image: '/category/sauces-spreads/cooking-pastes.webp' },
          { id: 'organic-premium-sauce', name: 'Organic & Premium', image: '/category/sauces-spreads/organic-premium.webp' },
          { id: 'others-sauce', name: 'Others', image: '/category/sauces-spreads/others.webp' }
        ]
      },
      {
        id: 'paan-corner',
        name: 'Paan Corner',
        image: '/categories/paan-corner.webp',
        subcategories: [
          { id: 'paan-masala', name: 'Paan Masala', image: '/category/paan-corner/paan-masala.webp' },
          { id: 'mouth-fresheners', name: 'Mouth Fresheners', image: '/category/paan-corner/mouth-fresheners.webp' },
          { id: 'others-paan', name: 'Others', image: '/category/paan-corner/others.webp' }
        ]
      },
      {
        id: 'ice-creams-more',
        name: 'Ice Creams & More',
        image: '/categories/ice-creams-more.webp',
        subcategories: [
          { id: 'ice-cream', name: 'Ice Cream', image: '/category/ice-creams-more/ice-cream.webp' },
          { id: 'frozen-bars', name: 'Frozen Bars', image: '/category/ice-creams-more/frozen-bars.webp' },
          { id: 'frozen-desserts', name: 'Frozen Desserts', image: '/category/ice-creams-more/frozen-desserts.webp' },
          { id: 'sticks', name: 'Sticks', image: '/category/ice-creams-more/sticks.webp' },
          { id: 'cones', name: 'Cones', image: '/category/ice-creams-more/cones.webp' },
          { id: 'drinks-ice', name: 'Drinks', image: '/category/ice-creams-more/drinks.webp' },
          { id: 'others-ice', name: 'Others', image: '/category/ice-creams-more/others.webp' }
        ]
      }
    ]
  },
  {
    groupId: 'beauty-personal-care',
    groupName: 'Beauty & Personal Care',
    groupIcon: '💄',
    groupColor: '#EC4899',
    categories: [
      {
        id: 'bath-body',
        name: 'Bath & Body',
        image: '/categories/bath-body.webp',
        subcategories: [
          { id: 'soaps-body-wash', name: 'Soaps & Body Wash', image: '/category/bath-body/soaps-body-wash.webp' },
          { id: 'shampoo-bath', name: 'Shampoo', image: '/category/bath-body/shampoo.webp' },
          { id: 'gels-scrubs', name: 'Gels & Scrubs', image: '/category/bath-body/gels-scrubs.webp' },
          { id: 'teeth-oral', name: 'Teeth & Oral', image: '/category/bath-body/teeth-oral.webp' },
          { id: 'perfume', name: 'Perfume', image: '/category/bath-body/perfume.webp' },
          { id: 'hand-foot-care', name: 'Hand & Foot Care', image: '/category/bath-body/hand-foot-care.webp' },
          { id: 'body-lotions-creams', name: 'Body Lotions & Creams', image: '/category/bath-body/body-lotions-creams.webp' },
          { id: 'beauty-gifts', name: 'Beauty Gifts', image: '/category/bath-body/beauty-gifts.webp' },
          { id: 'bath-accessories', name: 'Bath Accessories', image: '/category/bath-body/bath-accessories.webp' },
          { id: 'premium-bath', name: 'Premium', image: '/category/bath-body/premium.webp' },
          { id: 'others-bath', name: 'Others', image: '/category/bath-body/others.webp' }
        ]
      },
      {
        id: 'hair-care',
        name: 'Hair',
        image: '/categories/hair-care.webp',
        subcategories: [
          { id: 'shampoo-conditioner', name: 'Shampoo & Conditioner', image: '/category/hair-care/shampoo-conditioner.webp' },
          { id: 'hair-oil-serum', name: 'Hair Oil, Serum & Cream', image: '/category/hair-care/hair-oil-serum.webp' },
          { id: 'hair-accessories', name: 'Hair Accessories', image: '/category/hair-care/hair-accessories.webp' },
          { id: 'anti-dandruff', name: 'Anti-Dandruff', image: '/category/hair-care/anti-dandruff.webp' },
          { id: 'hair-colour', name: 'Hair Colour', image: '/category/hair-care/hair-colour.webp' },
          { id: 'hair-appliances', name: 'Hair Appliances', image: '/category/hair-care/hair-appliances.webp' },
          { id: 'others-hair', name: 'Others', image: '/category/hair-care/others.webp' }
        ]
      },
      {
        id: 'skin-face',
        name: 'Skin & Face',
        image: '/categories/skin-face.webp',
        subcategories: [
          { id: 'face-wash-serum', name: 'Face Wash & Serum', image: '/category/skin-face/face-wash-serum.webp' },
          { id: 'cream-moisturiser', name: 'Cream & Moisturiser', image: '/category/skin-face/cream-moisturiser.webp' },
          { id: 'sunscreen', name: 'Sunscreen', image: '/category/skin-face/sunscreen.webp' },
          { id: 'face-masks-care', name: 'Face Masks & Care', image: '/category/skin-face/face-masks-care.webp' },
          { id: 'mens-grooming', name: "Men's Grooming", image: '/category/skin-face/mens-grooming.webp' },
          { id: 'womens-grooming', name: "Women's Grooming", image: '/category/skin-face/womens-grooming.webp' },
          { id: 'others-skin', name: 'Others', image: '/category/skin-face/others.webp' }
        ]
      },
      {
        id: 'beauty-cosmetics',
        name: 'Beauty & Cosmetics',
        image: '/categories/beauty-cosmetics.webp',
        subcategories: [
          { id: 'face-makeup', name: 'Face Makeup', image: '/category/beauty-cosmetics/face-makeup.webp' },
          { id: 'lipstick-liquid', name: 'Lipstick & Liquid', image: '/category/beauty-cosmetics/lipstick-liquid.webp' },
          { id: 'eyeliner-mascara', name: 'Eyeliner & Mascara', image: '/category/beauty-cosmetics/eyeliner-mascara.webp' },
          { id: 'foundation-beauty', name: 'Foundation & Beauty', image: '/category/beauty-cosmetics/foundation-beauty.webp' },
          { id: 'nails-concealer', name: 'Nails Paint & Concealer', image: '/category/beauty-cosmetics/nails-concealer.webp' },
          { id: 'blush-highlighter', name: 'Blush & Highlighter', image: '/category/beauty-cosmetics/blush-highlighter.webp' },
          { id: 'beauty-accessories', name: 'Beauty Accessories', image: '/category/beauty-cosmetics/beauty-accessories.webp' },
          { id: 'jewellery', name: 'Jewellery', image: '/category/beauty-cosmetics/jewellery.webp' },
          { id: 'girls-gift', name: 'Girls Gift', image: '/category/beauty-cosmetics/girls-gift.webp' },
          { id: 'others-beauty', name: 'Others', image: '/category/beauty-cosmetics/others.webp' }
        ]
      },
      {
        id: 'feminine-hygiene',
        name: 'Feminine Hygiene',
        image: '/categories/feminine-hygiene.webp',
        subcategories: [
          { id: 'sanitary-pads', name: 'Sanitary Pads', image: '/category/feminine-hygiene/sanitary-pads.webp' },
          { id: 'tampons-cups', name: 'Tampons & Cups', image: '/category/feminine-hygiene/tampons-cups.webp' },
          { id: 'mom-care', name: 'Mom Care', image: '/category/feminine-hygiene/mom-care.webp' },
          { id: 'pain-relief', name: 'Pain Relief', image: '/category/feminine-hygiene/pain-relief.webp' },
          { id: 'others-feminine', name: 'Others', image: '/category/feminine-hygiene/others.webp' }
        ]
      },
      {
        id: 'baby-care',
        name: 'Baby Care',
        image: '/categories/baby-care.webp',
        subcategories: [
          { id: 'baby-clothes', name: 'Baby Clothes', image: '/category/baby-care/baby-clothes.webp' },
          { id: 'diapers-wipes', name: 'Diapers & Wipes', image: '/category/baby-care/diapers-wipes.webp' },
          { id: 'baby-food', name: 'Baby Food', image: '/category/baby-care/baby-food.webp' },
          { id: 'baby-soap-shampoo', name: 'Baby Soap & Shampoo', image: '/category/baby-care/baby-soap-shampoo.webp' },
          { id: 'baby-oil-powder', name: 'Baby Oil & Powder', image: '/category/baby-care/baby-oil-powder.webp' },
          { id: 'baby-toys-gifts', name: 'Baby Toys & Gifts', image: '/category/baby-care/baby-toys-gifts.webp' },
          { id: 'milk-bottle', name: 'Milk Bottle', image: '/category/baby-care/milk-bottle.webp' },
          { id: 'baby-accessories', name: 'Baby Accessories', image: '/category/baby-care/baby-accessories.webp' },
          { id: 'baby-oral', name: 'Baby Oral', image: '/category/baby-care/baby-oral.webp' },
          { id: 'baby-gear', name: 'Baby Gear', image: '/category/baby-care/baby-gear.webp' },
          { id: 'others-baby', name: 'Others', image: '/category/baby-care/others.webp' }
        ]
      },
      {
        id: 'health-pharma',
        name: 'Health & Pharma',
        image: '/categories/health-pharma.webp',
        subcategories: [
          { id: 'cough-cold', name: 'Cough, Headache, Cold', image: '/category/health-pharma/cough-cold.webp' },
          { id: 'stomach-digestive', name: 'Stomach & Digestive Care', image: '/category/health-pharma/stomach-digestive.webp' },
          { id: 'vitamins-supplements', name: 'Vitamins & Supplements', image: '/category/health-pharma/vitamins-supplements.webp' },
          { id: 'masks-sanitizer', name: 'Masks & Sanitizer', image: '/category/health-pharma/masks-sanitizer.webp' },
          { id: 'first-aid-devices', name: 'First Aid & Devices', image: '/category/health-pharma/first-aid-devices.webp' },
          { id: 'general-medicine', name: 'General Medicine', image: '/category/health-pharma/general-medicine.webp' },
          { id: 'protein-supplements', name: 'Protein Supplements', image: '/category/health-pharma/protein-supplements.webp' },
          { id: 'oral-care-health', name: 'Oral Care', image: '/category/health-pharma/oral-care.webp' },
          { id: 'others-health', name: 'Others', image: '/category/health-pharma/others.webp' }
        ]
      },
      {
        id: 'wellness',
        name: 'Wellness',
        image: '/categories/wellness.webp',
        subcategories: [
          { id: 'for-mens', name: "For Men's", image: '/category/wellness/for-mens.webp' },
          { id: 'for-womens', name: "For Women's", image: '/category/wellness/for-womens.webp' },
          { id: 'others-wellness', name: 'Others', image: '/category/wellness/others.webp' }
        ]
      }
    ]
  },
  {
    groupId: 'household-essentials',
    groupName: 'Household Essentials',
    groupIcon: '🏠',
    groupColor: '#8B5CF6',
    categories: [
      {
        id: 'home-lifestyle',
        name: 'Home & Lifestyle',
        image: '/categories/home-lifestyle.webp',
        subcategories: [
          { id: 'home-utility', name: 'Home Utility', image: '/category/home-lifestyle/home-utility.webp' },
          { id: 'home-decorations', name: 'Home Decorations', image: '/category/home-lifestyle/home-decorations.webp' },
          { id: 'daily-needs', name: 'Daily Needs', image: '/category/home-lifestyle/daily-needs.webp' },
          { id: 'flower-gifts', name: 'Flower & Gifts', image: '/category/home-lifestyle/flower-gifts.webp' },
          { id: 'decorating-lights', name: 'Decorating Lights', image: '/category/home-lifestyle/decorating-lights.webp' },
          { id: 'party-festival', name: 'Party Festival', image: '/category/home-lifestyle/party-festival.webp' },
          { id: 'bathroom-essentials', name: 'Bathroom Essentials', image: '/category/home-lifestyle/bathroom-essentials.webp' },
          { id: 'bedrooms-essentials', name: 'Bedrooms Essentials', image: '/category/home-lifestyle/bedrooms-essentials.webp' },
          { id: 'lifestyle-essentials', name: 'Lifestyle Essentials', image: '/category/home-lifestyle/lifestyle-essentials.webp' },
          { id: 'others-home', name: 'Others', image: '/category/home-lifestyle/others.webp' }
        ]
      },
      {
        id: 'cleaners-repellents',
        name: 'Cleaners & Repellents',
        image: '/categories/cleaners-repellents.webp',
        subcategories: [
          { id: 'floor-surface-cleaners', name: 'Floor & Surface Cleaners', image: '/category/cleaners-repellents/floor-surface-cleaners.webp' },
          { id: 'detergents', name: 'Detergents', image: '/category/cleaners-repellents/detergents.webp' },
          { id: 'mosquito-pest', name: 'Mosquito & Pest', image: '/category/cleaners-repellents/mosquito-pest.webp' },
          { id: 'toilet-cleaner', name: 'Toilet Cleaner', image: '/category/cleaners-repellents/toilet-cleaner.webp' },
          { id: 'shoes-care', name: 'Shoes Care', image: '/category/cleaners-repellents/shoes-care.webp' },
          { id: 'others-cleaners', name: 'Others', image: '/category/cleaners-repellents/others.webp' }
        ]
      },
      {
        id: 'electronics',
        name: 'Electronics',
        image: '/categories/electronics.webp',
        subcategories: [
          { id: 'chargers-cables', name: 'Chargers & Cables', image: '/category/electronics/chargers-cables.webp' },
          { id: 'batteries-phone-cover', name: 'Batteries & Phone Cover', image: '/category/electronics/batteries-phone-cover.webp' },
          { id: 'speakers-headphones', name: 'Speakers & Headphones', image: '/category/electronics/speakers-headphones.webp' },
          { id: 'airbuds-earphones', name: 'Airbuds & Earphones', image: '/category/electronics/airbuds-earphones.webp' },
          { id: 'tech-gadgets', name: 'Tech Gadgets', image: '/category/electronics/tech-gadgets.webp' },
          { id: 'watch', name: 'Watch', image: '/category/electronics/watch.webp' },
          { id: 'home-appliances', name: 'Home Appliances', image: '/category/electronics/home-appliances.webp' },
          { id: 'others-electronics', name: 'Others', image: '/category/electronics/others.webp' }
        ]
      },
      {
        id: 'stationery-games',
        name: 'Stationery & Games',
        image: '/categories/stationery-games.webp',
        subcategories: [
          { id: 'school-office', name: 'School & Office', image: '/category/stationery-games/school-office.webp' },
          { id: 'writing-items', name: 'Writing Items', image: '/category/stationery-games/writing-items.webp' },
          { id: 'games-puzzles', name: 'Games & Puzzles', image: '/category/stationery-games/games-puzzles.webp' },
          { id: 'others-stationery', name: 'Others', image: '/category/stationery-games/others.webp' }
        ]
      }
    ]
  },
  {
    groupId: 'shop-by-store',
    groupName: 'Shop by Store',
    groupIcon: '🏪',
    groupColor: '#3B82F6',
    categories: [
      {
        id: 'spiritual-store',
        name: 'Spiritual Store',
        image: '/categories/spiritual-store.webp',
        subcategories: [
          { id: 'puja-items', name: 'Puja Items', image: '/category/spiritual-store/puja-items.webp' },
          { id: 'incense-dhoop', name: 'Incense & Dhoop', image: '/category/spiritual-store/incense-dhoop.webp' },
          { id: 'idols', name: 'Idols', image: '/category/spiritual-store/idols.webp' },
          { id: 'others-spiritual', name: 'Others', image: '/category/spiritual-store/others.webp' }
        ]
      },
      {
        id: 'pharma-store',
        name: 'Pharma Store',
        image: '/categories/pharma-store.webp',
        subcategories: [
          { id: 'medicines', name: 'Medicines', image: '/category/pharma-store/medicines.webp' },
          { id: 'wellness-pharma', name: 'Wellness', image: '/category/pharma-store/wellness.webp' },
          { id: 'medical-supplies', name: 'Medical Supplies', image: '/category/pharma-store/medical-supplies.webp' },
          { id: 'others-pharma', name: 'Others', image: '/category/pharma-store/others.webp' }
        ]
      },
      {
        id: 'egifts-store',
        name: 'E-Gifts Store',
        image: '/categories/egifts-store.webp',
        subcategories: [
          { id: 'gift-cards', name: 'Gift Cards', image: '/category/egifts-store/gift-cards.webp' },
          { id: 'gift-combos', name: 'Gift Combos', image: '/category/egifts-store/gift-combos.webp' },
          { id: 'others-egifts', name: 'Others', image: '/category/egifts-store/others.webp' }
        ]
      },
      {
        id: 'pet-store',
        name: 'Pet Store',
        image: '/categories/pet-store.webp',
        subcategories: [
          { id: 'pet-food', name: 'Pet Food', image: '/category/pet-store/pet-food.webp' },
          { id: 'grooming', name: 'Grooming', image: '/category/pet-store/grooming.webp' },
          { id: 'accessories-pet', name: 'Accessories', image: '/category/pet-store/accessories.webp' },
          { id: 'others-pet', name: 'Others', image: '/category/pet-store/others.webp' }
        ]
      },
      {
        id: 'sports-store',
        name: 'Sports Store',
        image: '/categories/sports-store.webp',
        subcategories: [
          { id: 'fitness-items', name: 'Fitness Items', image: '/category/sports-store/fitness-items.webp' },
          { id: 'sports-gear', name: 'Sports Gear', image: '/category/sports-store/sports-gear.webp' },
          { id: 'bottles-supports', name: 'Bottles & Supports', image: '/category/sports-store/bottles-supports.webp' },
          { id: 'others-sports', name: 'Others', image: '/category/sports-store/others.webp' }
        ]
      },
      {
        id: 'fashion-basics',
        name: 'Fashion Basics Store',
        image: '/categories/fashion-basics.webp',
        subcategories: [
          { id: 'innerwear', name: 'Innerwear', image: '/category/fashion-basics/innerwear.webp' },
          { id: 'top-collection', name: 'Top Collection', image: '/category/fashion-basics/top-collection.webp' },
          { id: 'socks', name: 'Socks', image: '/category/fashion-basics/socks.webp' },
          { id: 'daily-wear', name: 'Daily Wear', image: '/category/fashion-basics/daily-wear.webp' },
          { id: 'seasonal-fashion', name: 'Seasonal', image: '/category/fashion-basics/seasonal.webp' },
          { id: 'others-fashion', name: 'Others', image: '/category/fashion-basics/others.webp' }
        ]
      },
      {
        id: 'toy-store',
        name: 'Toy Store',
        image: '/categories/toy-store.webp',
        subcategories: [
          { id: 'learning-toys', name: 'Learning Toys', image: '/category/toy-store/learning-toys.webp' },
          { id: 'action-toys', name: 'Action Toys', image: '/category/toy-store/action-toys.webp' },
          { id: 'creative-toys', name: 'Creative Toys', image: '/category/toy-store/creative-toys.webp' },
          { id: 'others-toys', name: 'Others', image: '/category/toy-store/others.webp' }
        ]
      },
      {
        id: 'book-store',
        name: 'Book Store',
        image: '/categories/book-store.webp',
        subcategories: [
          { id: 'fiction', name: 'Fiction', image: '/category/book-store/fiction.webp' },
          { id: 'non-fiction', name: 'Non-Fiction', image: '/category/book-store/non-fiction.webp' },
          { id: 'kids-books', name: 'Kids Books', image: '/category/book-store/kids-books.webp' },
          { id: 'academic', name: 'Academic', image: '/category/book-store/academic.webp' },
          { id: 'school-books', name: 'School Books', image: '/category/book-store/school-books.webp' },
          { id: 'others-books', name: 'Others', image: '/category/book-store/others.webp' }
        ]
      }
    ]
  }
];

export const getAllCategories = () => {
  const allCategories = [];
  CATEGORIES_STRUCTURE.forEach(group => {
    group.categories.forEach(category => {
      allCategories.push({
        ...category,
        groupId: group.groupId,
        groupName: group.groupName,
        groupColor: group.groupColor,
        groupIcon: group.groupIcon
      });
    });
  });
  return allCategories;
};

export const getCategoryById = (categoryId) => {
  for (const group of CATEGORIES_STRUCTURE) {
    const category = group.categories.find(cat => cat.id === categoryId);
    if (category) {
      return {
        ...category,
        groupId: group.groupId,
        groupName: group.groupName,
        groupColor: group.groupColor,
        groupIcon: group.groupIcon
      };
    }
  }
  return null;
};

export const getSubcategoryById = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  
  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  return subcategory ? { ...subcategory, categoryId, categoryName: category.name } : null;
};

export const getCategoriesByGroup = (groupId) => {
  const group = CATEGORIES_STRUCTURE.find(g => g.groupId === groupId);
  return group ? group.categories : [];
};

export const getAllGroups = () => {
  return CATEGORIES_STRUCTURE.map(group => ({
    groupId: group.groupId,
    groupName: group.groupName,
    groupIcon: group.groupIcon,
    groupColor: group.groupColor,
    categoriesCount: group.categories.length
  }));
};