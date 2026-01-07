// src/data/categoriesData.js

export const CATEGORIES_DATA = {
  "grocery-kitchen": {
    name: "Grocery & Kitchen",
    icon: "🛒",
    color: "#10B981",
    subcategories: {
      "vegetables-fruits": {
        name: "Vegetables & Fruits",
        image: "/categories/vegetables-fruits.webp",
        leafGroups: {
          "fresh-vegetables": {
            name: "Fresh Vegetables",
            items: ["Leafy Vegetables", "Root Vegetables", "Gourds & Squash", "Seasonal Vegetables", "Exotic Vegetables"]
          },
          "fresh-fruits": {
            name: "Fresh Fruits",
            items: ["Seasonal Fruits", "Exotic Fruits", "Citrus Fruits", "Berries & Grapes", "Melons"]
          },
          "organic-produce": {
            name: "Organic Produce",
            items: ["Organic Vegetables", "Organic Fruits"]
          },
          "frozen-produce": {
            name: "Frozen Produce",
            items: ["Frozen Vegetables", "Frozen Fruits"]
          },
          "cut-ready-produce": {
            name: "Cut & Ready Produce",
            items: ["Ready-to-Cook Vegetables", "Cut Fruits"]
          }
        }
      },
      "atta-rice-dal": {
        name: "Atta, Rice & Dal",
        image: "/categories/atta-rice-dal.webp",
        leafGroups: {
          "atta-flour": {
            name: "Atta & Flour",
            items: ["Wheat Atta", "Multigrain Atta", "Rice Flour", "Maida & Sooji", "Besan & Other Flours"]
          },
          "rice": {
            name: "Rice",
            items: ["Basmati Rice", "Non-Basmati Rice", "Brown & Organic Rice", "Parboiled & Steamed Rice"]
          },
          "dal-pulses": {
            name: "Dal & Pulses",
            items: ["Toor Dal", "Moong Dal", "Chana Dal", "Masoor Dal", "Urad Dal", "Mixed Dal"]
          },
          "millets-grains": {
            name: "Millets & Grains",
            items: ["Ragi", "Jowar", "Bajra", "Quinoa", "Oats"]
          }
        }
      },
      "oil-ghee-masala": {
        name: "Oil, Ghee & Masala",
        image: "/categories/oil-ghee-masala.webp",
        leafGroups: {
          "cooking-oils": {
            name: "Cooking Oils",
            items: ["Mustard Oil", "Sunflower Oil", "Soybean Oil", "Rice Bran Oil", "Olive Oil", "Coconut Oil"]
          },
          "ghee-butter": {
            name: "Ghee & Butter",
            items: ["Pure Ghee", "Butter", "Margarine"]
          },
          "whole-spices": {
            name: "Whole Spices",
            items: ["Cumin", "Coriander Seeds", "Black Pepper", "Cardamom", "Cloves", "Bay Leaves"]
          },
          "powdered-spices": {
            name: "Powdered Spices",
            items: ["Turmeric Powder", "Red Chilli Powder", "Coriander Powder", "Cumin Powder"]
          },
          "blended-masala": {
            name: "Blended Masala",
            items: ["Garam Masala", "Kitchen King", "Chaat Masala", "Curry Powder", "Regional Masalas"]
          }
        }
      },
      "dairy-bread-eggs": {
        name: "Dairy, Bread & Eggs",
        image: "/categories/dairy-bread-eggs.webp",
        leafGroups: {
          "milk": {
            name: "Milk",
            items: ["Toned Milk", "Full Cream Milk", "Double Toned Milk", "Flavoured Milk", "Plant-Based Milk"]
          },
          "curd-yogurt": {
            name: "Curd & Yogurt",
            items: ["Plain Curd", "Flavoured Yogurt", "Greek Yogurt"]
          },
          "paneer-cheese": {
            name: "Paneer & Cheese",
            items: ["Paneer", "Cheddar Cheese", "Mozzarella", "Processed Cheese", "Cream Cheese"]
          },
          "butter-cream": {
            name: "Butter & Cream",
            items: ["Table Butter", "Cooking Butter", "Fresh Cream", "Whipping Cream"]
          },
          "eggs": {
            name: "Eggs",
            items: ["White Eggs", "Brown Eggs", "Free-Range Eggs"]
          },
          "bread-buns": {
            name: "Bread & Buns",
            items: ["Sandwich Bread", "Brown Bread", "Pav & Buns", "Pizza Base"]
          }
        }
      },
      "bakery-biscuits": {
        name: "Bakery & Biscuits",
        image: "/categories/bakery-biscuits.webp",
        leafGroups: {
          "biscuits-cookies": {
            name: "Biscuits & Cookies",
            items: ["Cream Biscuits", "Glucose Biscuits", "Digestive Biscuits", "Cookies"]
          },
          "cakes-pastries": {
            name: "Cakes & Pastries",
            items: ["Cakes", "Cupcakes", "Pastries", "Muffins"]
          },
          "rusk-toast": {
            name: "Rusk & Toast",
            items: ["Rusk", "Toast", "Breadsticks"]
          },
          "savoury-bakery": {
            name: "Savoury Bakery",
            items: ["Puffs", "Patties", "Samosas"]
          }
        }
      },
      "dry-fruits-cereals": {
        name: "Dry Fruits & Cereals",
        image: "/categories/dry-fruits-cereals.webp",
        leafGroups: {
          "dry-fruits": {
            name: "Dry Fruits",
            items: ["Almonds", "Cashews", "Raisins", "Dates", "Walnuts", "Pistachios", "Figs"]
          },
          "seeds-mixes": {
            name: "Seeds & Mixes",
            items: ["Chia Seeds", "Flax Seeds", "Pumpkin Seeds", "Trail Mix"]
          },
          "breakfast-cereals": {
            name: "Breakfast Cereals",
            items: ["Cornflakes", "Oats", "Muesli", "Granola"]
          }
        }
      },
      "chicken-meat-fish": {
        name: "Chicken, Meat & Fish",
        image: "/categories/chicken-meat-fish.webp",
        leafGroups: {
          "chicken": {
            name: "Chicken",
            items: ["Whole Chicken", "Chicken Breast", "Chicken Legs", "Minced Chicken"]
          },
          "fish-seafood": {
            name: "Fish & Seafood",
            items: ["Fresh Fish", "Prawns", "Crabs", "Frozen Seafood"]
          },
          "mutton-red-meat": {
            name: "Mutton & Red Meat",
            items: ["Mutton", "Lamb", "Goat Meat"]
          },
          "frozen-processed-meat": {
            name: "Frozen & Processed Meat",
            items: ["Frozen Chicken", "Sausages", "Salami", "Ham"]
          }
        }
      },
      "kitchenware-appliances": {
        name: "Kitchenware & Appliances",
        image: "/categories/kitchenware-appliances.webp",
        leafGroups: {
          "cookware": {
            name: "Cookware",
            items: ["Non-Stick Pans", "Pressure Cookers", "Kadhai", "Tawa", "Stainless Steel Utensils"]
          },
          "kitchen-tools": {
            name: "Kitchen Tools",
            items: ["Knives", "Peelers", "Graters", "Choppers", "Rolling Pins"]
          },
          "storage-containers": {
            name: "Storage & Containers",
            items: ["Plastic Containers", "Glass Containers", "Steel Containers", "Lunch Boxes"]
          },
          "small-appliances": {
            name: "Small Appliances",
            items: ["Mixer Grinder", "Toaster", "Electric Kettle", "Rice Cooker", "Hand Blender"]
          }
        }
      }
    }
  },
  "snacks-drinks": {
    name: "Snacks & Drinks",
    icon: "🍿",
    color: "#F59E0B",
    subcategories: {
      "chips-namkeen": {
        name: "Chips & Namkeen",
        image: "/categories/chips-namkeen.webp",
        leafGroups: {
          "potato-chips": {
            name: "Potato Chips",
            items: ["Regular Chips", "Flavoured Chips", "Baked Chips"]
          },
          "namkeen-bhujia": {
            name: "Namkeen & Bhujia",
            items: ["Bhujia", "Sev", "Chivda", "Mixture"]
          },
          "popcorn-puffs": {
            name: "Popcorn & Puffs",
            items: ["Popcorn", "Corn Puffs", "Rice Puffs"]
          }
        }
      },
      "sweets-chocolates": {
        name: "Sweets & Chocolates",
        image: "/categories/sweets-chocolates.webp",
        leafGroups: {
          "indian-sweets": {
            name: "Indian Sweets",
            items: ["Ladoo", "Barfi", "Gulab Jamun", "Rasgulla", "Soan Papdi"]
          },
          "chocolates": {
            name: "Chocolates",
            items: ["Bars", "Packed Chocolates", "Premium Chocolates"]
          },
          "candies-toffees": {
            name: "Candies & Toffees",
            items: ["Hard Candy", "Soft Candy", "Toffees", "Lollipops"]
          },
          "sugar-free-sweets": {
            name: "Sugar Free Sweets",
            items: ["Sugar-Free Chocolates", "Sugar-Free Candies"]
          }
        }
      },
      "drinks-juices": {
        name: "Drinks & Juices",
        image: "/categories/drinks-juices.webp",
        leafGroups: {
          "fruit-juices": {
            name: "Fruit Juices",
            items: ["Mango Juice", "Orange Juice", "Apple Juice", "Mixed Fruit Juice"]
          },
          "soft-drinks": {
            name: "Soft Drinks",
            items: ["Cola", "Lemon Drinks", "Orange Drinks", "Soda"]
          },
          "energy-sports-drinks": {
            name: "Energy & Sports Drinks",
            items: ["Energy Drinks", "Glucose Drinks", "Sports Drinks"]
          }
        }
      },
      "tea-coffee-milk": {
        name: "Tea, Coffee & Milk Drinks",
        image: "/categories/tea-coffee-milk.webp",
        leafGroups: {
          "tea": {
            name: "Tea",
            items: ["Black Tea", "Green Tea", "Herbal Tea", "Masala Tea", "Tea Bags"]
          },
          "coffee": {
            name: "Coffee",
            items: ["Instant Coffee", "Ground Coffee", "Coffee Beans", "Cold Coffee Mix"]
          },
          "health-drinks": {
            name: "Health Drinks",
            items: ["Horlicks", "Bournvita", "Complan", "Protein Drinks"]
          }
        }
      },
      "instant-food": {
        name: "Instant Food",
        image: "/categories/instant-food.webp",
        leafGroups: {
          "instant-noodles": {
            name: "Instant Noodles",
            items: ["Cup Noodles", "Packet Noodles", "Vermicelli"]
          },
          "ready-meals": {
            name: "Ready Meals",
            items: ["Ready-to-Eat", "Frozen Meals", "Canned Food"]
          },
          "soup-mixes": {
            name: "Soup & Mixes",
            items: ["Instant Soup", "Pasta Mix", "Khichdi Mix"]
          }
        }
      },
      "sauces-spreads": {
        name: "Sauces & Spreads",
        image: "/categories/sauces-spreads.webp",
        leafGroups: {
          "sauces-ketchup": {
            name: "Sauces & Ketchup",
            items: ["Tomato Ketchup", "Chilli Sauce", "Soy Sauce", "Pasta Sauce", "Mayo"]
          },
          "spreads": {
            name: "Spreads",
            items: ["Peanut Butter", "Chocolate Spread", "Cheese Spread"]
          },
          "jams-honey": {
            name: "Jams & Honey",
            items: ["Mixed Fruit Jam", "Strawberry Jam", "Honey", "Marmalade"]
          }
        }
      },
      "paan-corner": {
        name: "Paan Corner",
        image: "/categories/paan-corner.webp",
        leafGroups: {
          "mouth-fresheners": {
            name: "Mouth Fresheners",
            items: ["Mukhwas", "Candy Saunf", "Digestive Tablets"]
          },
          "paan-ingredients": {
            name: "Paan Ingredients",
            items: ["Supari", "Kattha", "Chuna", "Gulkand"]
          },
          "pan-masala": {
            name: "Pan Masala",
            items: ["Flavoured Pan Masala", "Meetha Pan Masala"]
          }
        }
      },
      "ice-creams-more": {
        name: "Ice Creams & More",
        image: "/categories/ice-creams-more.webp",
        leafGroups: {
          "ice-creams": {
            name: "Ice Creams",
            items: ["Family Packs", "Sticks & Cones", "Tubs", "Premium Ice Cream"]
          },
          "kulfi": {
            name: "Kulfi",
            items: ["Malai Kulfi", "Mango Kulfi", "Pista Kulfi"]
          },
          "frozen-desserts": {
            name: "Frozen Desserts",
            items: ["Ice Candy", "Frozen Yogurt"]
          }
        }
      }
    }
  },
  "beauty-personal-care": {
    name: "Beauty & Personal Care",
    icon: "💄",
    color: "#EC4899",
    subcategories: {
      "bath-body": {
        name: "Bath & Body",
        image: "/categories/bath-body.webp",
        leafGroups: {
          "soaps": {
            name: "Soaps",
            items: ["Bathing Bars", "Liquid Soap", "Handmade Soap"]
          },
          "body-wash": {
            name: "Body Wash",
            items: ["Shower Gel", "Body Wash"]
          },
          "handwash-sanitizers": {
            name: "Handwash & Sanitizers",
            items: ["Liquid Handwash", "Handwash Refills", "Hand Sanitizer"]
          }
        }
      },
      "hair-care": {
        name: "Hair",
        image: "/categories/hair-care.webp",
        leafGroups: {
          "shampoo": {
            name: "Shampoo",
            items: ["Anti-Dandruff", "Hair Fall Control", "Smooth & Silky", "Herbal Shampoo"]
          },
          "conditioner": {
            name: "Conditioner",
            items: ["Regular Conditioner", "Leave-In Conditioner"]
          },
          "hair-oil": {
            name: "Hair Oil",
            items: ["Coconut Oil", "Almond Oil", "Ayurvedic Oil", "Hair Serum"]
          },
          "hair-styling": {
            name: "Hair Styling",
            items: ["Gel", "Wax", "Hair Spray", "Hair Cream"]
          }
        }
      },
      "skin-face": {
        name: "Skin & Face",
        image: "/categories/skin-face.webp",
        leafGroups: {
          "face-wash": {
            name: "Face Wash",
            items: ["Acne Control", "Brightening", "Oil Control", "Sensitive Skin"]
          },
          "moisturizers": {
            name: "Moisturizers",
            items: ["Face Cream", "Body Lotion", "Night Cream"]
          },
          "sunscreen": {
            name: "Sunscreen",
            items: ["SPF 30", "SPF 50", "Tinted Sunscreen"]
          },
          "face-masks": {
            name: "Face Masks",
            items: ["Sheet Masks", "Clay Masks", "Peel-Off Masks"]
          }
        }
      },
      "beauty-cosmetics": {
        name: "Beauty & Cosmetics",
        image: "/categories/beauty-cosmetics.webp",
        leafGroups: {
          "makeup": {
            name: "Makeup",
            items: ["Foundation", "Lipstick", "Kajal", "Eyeliner", "Nail Polish", "Compact Powder"]
          },
          "beauty-tools": {
            name: "Beauty Tools",
            items: ["Brushes", "Sponges", "Tweezers", "Mirrors"]
          }
        }
      },
      "feminine-hygiene": {
        name: "Feminine Hygiene",
        image: "/categories/feminine-hygiene.webp",
        leafGroups: {
          "sanitary-pads": {
            name: "Sanitary Pads",
            items: ["Regular Pads", "Overnight Pads", "Panty Liners"]
          },
          "tampons-cups": {
            name: "Tampons & Cups",
            items: ["Tampons", "Menstrual Cups"]
          },
          "intimate-wash": {
            name: "Intimate Wash",
            items: ["Intimate Hygiene Wash", "Wipes"]
          }
        }
      },
      "baby-care": {
        name: "Baby Care",
        image: "/categories/baby-care.webp",
        leafGroups: {
          "diapers-wipes": {
            name: "Diapers & Wipes",
            items: ["Newborn Diapers", "Baby Diapers", "Baby Wipes"]
          },
          "baby-food": {
            name: "Baby Food",
            items: ["Cerelac", "Baby Snacks", "Formula Milk"]
          },
          "baby-skin-care": {
            name: "Baby Skin Care",
            items: ["Baby Lotion", "Baby Oil", "Baby Powder", "Diaper Rash Cream"]
          }
        }
      },
      "health-pharma": {
        name: "Health & Pharma",
        image: "/categories/health-pharma.webp",
        leafGroups: {
          "otc-medicines": {
            name: "OTC Medicines",
            items: ["Pain Relief", "Cold & Cough", "Digestion", "First Aid"]
          },
          "vitamins-supplements": {
            name: "Vitamins & Supplements",
            items: ["Multivitamins", "Calcium", "Protein Powder", "Omega-3"]
          },
          "medical-devices": {
            name: "Medical Devices",
            items: ["Thermometer", "BP Monitor", "Glucometer", "Nebulizer"]
          }
        }
      },
      "sexual-wellness": {
        name: "Sexual Wellness",
        image: "/categories/sexual-wellness.webp",
        leafGroups: {
          "condoms": {
            name: "Condoms",
            items: ["Regular Condoms", "Flavoured Condoms", "Dotted & Ribbed"]
          },
          "lubricants": {
            name: "Lubricants",
            items: ["Water-Based", "Silicone-Based"]
          },
          "intimate-care": {
            name: "Intimate Care",
            items: ["Intimate Wash", "Wipes"]
          }
        }
      }
    }
  },
  "household-essentials": {
    name: "Household Essentials",
    icon: "🏠",
    color: "#8B5CF6",
    subcategories: {
      "home-lifestyle": {
        name: "Home & Lifestyle",
        image: "/categories/home-lifestyle.webp",
        leafGroups: {
          "home-decor": {
            name: "Home Decor",
            items: ["Wall Hangings", "Showpieces", "Artificial Plants", "Photo Frames"]
          },
          "bedding-linen": {
            name: "Bedding & Linen",
            items: ["Bed Sheets", "Pillow Covers", "Comforters", "Towels"]
          },
          "storage-solutions": {
            name: "Storage Solutions",
            items: ["Plastic Boxes", "Baskets", "Organizers", "Racks"]
          }
        }
      },
      "cleaners-repellents": {
        name: "Cleaners & Repellents",
        image: "/categories/cleaners-repellents.webp",
        leafGroups: {
          "laundry": {
            name: "Laundry",
            items: ["Detergent Powder", "Liquid Detergent", "Fabric Softener", "Stain Remover"]
          },
          "floor-surface-cleaners": {
            name: "Floor & Surface Cleaners",
            items: ["Floor Cleaner", "Glass Cleaner", "Bathroom Cleaner", "Kitchen Cleaner"]
          },
          "dishwash": {
            name: "Dishwash",
            items: ["Dishwash Bar", "Dishwash Liquid", "Dishwasher Tablets"]
          },
          "insect-repellents": {
            name: "Insect Repellents",
            items: ["Mosquito Coils", "Liquid Vaporizers", "Sprays", "Rat Repellents"]
          }
        }
      },
      "electronics": {
        name: "Electronics",
        image: "/categories/electronics.webp",
        leafGroups: {
          "small-appliances": {
            name: "Small Appliances",
            items: ["Iron", "Fan", "Heater", "Room Freshener Machines"]
          },
          "batteries-chargers": {
            name: "Batteries & Chargers",
            items: ["AA Batteries", "AAA Batteries", "Mobile Chargers", "Power Banks"]
          },
          "accessories": {
            name: "Accessories",
            items: ["Extension Cords", "Adapters", "Bulbs", "Tube Lights"]
          }
        }
      },
      "stationery-games": {
        name: "Stationery & Games",
        image: "/categories/stationery-games.webp",
        leafGroups: {
          "office-supplies": {
            name: "Office Supplies",
            items: ["Pens", "Notebooks", "Staplers", "Files & Folders"]
          },
          "school-supplies": {
            name: "School Supplies",
            items: ["Pencils", "Erasers", "Geometry Box", "Crayons"]
          },
          "board-games": {
            name: "Board Games",
            items: ["Chess", "Ludo", "Cards", "Puzzles"]
          },
          "art-craft": {
            name: "Art & Craft",
            items: ["Colors", "Brushes", "Craft Paper", "Glue"]
          }
        }
      }
    }
  },
  "shop-by-store": {
    name: "Shop by Store",
    icon: "🏪",
    color: "#3B82F6",
    subcategories: {
      "spiritual-store": {
        name: "Spiritual Store",
        image: "/categories/spiritual-store.webp",
        leafGroups: {
          "puja-items": {
            name: "Puja Items",
            items: ["Agarbatti", "Camphor", "Kumkum", "Haldi"]
          },
          "incense": {
            name: "Incense",
            items: ["Dhoop Sticks", "Cone Incense", "Incense Holders"]
          },
          "diyas-candles": {
            name: "Diyas & Candles",
            items: ["Clay Diyas", "Wax Candles", "Decorative Candles"]
          },
          "idols-frames": {
            name: "Idols & Frames",
            items: ["God Idols", "Photo Frames", "Religious Books"]
          }
        }
      },
      "pharma-store": {
        name: "Pharma Store",
        image: "/categories/pharma-store.webp",
        leafGroups: {
          "medicines": {
            name: "Medicines",
            items: ["Pain Relief", "Antibiotics", "Vitamins"]
          },
          "health-devices": {
            name: "Health Devices",
            items: ["BP Monitor", "Thermometer", "Nebulizer"]
          },
          "personal-care": {
            name: "Personal Care",
            items: ["Bandages", "Cotton", "Antiseptic"]
          }
        }
      },
      "egifts-store": {
        name: "E-Gifts",
        image: "/categories/egifts-store.webp",
        leafGroups: {
          "gift-hampers": {
            name: "Gift Hampers",
            items: ["Chocolate Hampers", "Dry Fruit Boxes", "Personalized Gifts"]
          },
          "greeting-cards": {
            name: "Greeting Cards",
            items: ["Birthday Cards", "Anniversary Cards", "Thank You Cards"]
          },
          "flowers": {
            name: "Flowers",
            items: ["Rose Bouquets", "Mixed Flowers", "Flower Baskets"]
          }
        }
      },
      "pet-store": {
        name: "Pet Store",
        image: "/categories/pet-store.webp",
        leafGroups: {
          "pet-food": {
            name: "Pet Food",
            items: ["Dog Food", "Cat Food", "Bird Food", "Fish Food"]
          },
          "pet-grooming": {
            name: "Pet Grooming",
            items: ["Shampoo", "Brushes", "Nail Clippers"]
          },
          "pet-accessories": {
            name: "Pet Accessories",
            items: ["Collars", "Leashes", "Toys", "Bowls"]
          }
        }
      },
      "sports-store": {
        name: "Sports",
        image: "/categories/sports-store.webp",
        leafGroups: {
          "sports-equipment": {
            name: "Sports Equipment",
            items: ["Cricket Gear", "Football", "Badminton", "Gym Weights"]
          },
          "fitness-gear": {
            name: "Fitness Gear",
            items: ["Yoga Mats", "Resistance Bands", "Dumbbells", "Skipping Ropes"]
          },
          "sportswear": {
            name: "Sportswear",
            items: ["Jerseys", "Shorts", "Sports Shoes", "Tracksuits"]
          }
        }
      },
      "fashion-basics": {
        name: "Fashion Basics Store",
        image: "/categories/fashion-basics.webp",
        leafGroups: {
          "t-shirts": {
            name: "T-Shirts",
            items: ["Plain T-Shirts", "Printed T-Shirts", "Polo T-Shirts"]
          },
          "innerwear": {
            name: "Innerwear",
            items: ["Vests", "Briefs", "Bras", "Thermal Wear"]
          },
          "socks-accessories": {
            name: "Socks & Accessories",
            items: ["Cotton Socks", "Sports Socks", "Caps", "Handkerchiefs"]
          }
        }
      },
      "toy-store": {
        name: "Toy Store",
        image: "/categories/toy-store.webp",
        leafGroups: {
          "educational-toys": {
            name: "Educational Toys",
            items: ["Building Blocks", "Puzzles", "Learning Toys"]
          },
          "soft-toys": {
            name: "Soft Toys",
            items: ["Teddy Bears", "Plush Animals"]
          },
          "action-figures": {
            name: "Action Figures",
            items: ["Superheroes", "Cars", "Dolls"]
          }
        }
      },
      "book-store": {
        name: "Book Store",
        image: "/categories/book-store.webp",
        leafGroups: {
          "fiction": {
            name: "Fiction",
            items: ["Novels", "Mystery", "Romance", "Sci-Fi"]
          },
          "non-fiction": {
            name: "Non-Fiction",
            items: ["Self-Help", "Biography", "History"]
          },
          "children-books": {
            name: "Children Books",
            items: ["Story Books", "Activity Books", "Comics"]
          },
          "academic-books": {
            name: "Academic Books",
            items: ["School Textbooks", "Entrance Exam Books", "Workbooks"]
          }
        }
      }
    }
  }
};

export const getAllSubcategories = () => {
  const subcategories = [];
  Object.entries(CATEGORIES_DATA).forEach(([mainId, mainCat]) => {
    Object.entries(mainCat.subcategories).forEach(([subId, subCat]) => {
      subcategories.push({
        id: subId,
        name: subCat.name,
        image: subCat.image,
        parentId: mainId,
        parentName: mainCat.name,
        parentColor: mainCat.color,
        leafGroups: subCat.leafGroups
      });
    });
  });
  return subcategories;
};

export const getSubcategoryById = (subId) => {
  for (const [mainId, mainCat] of Object.entries(CATEGORIES_DATA)) {
    if (mainCat.subcategories[subId]) {
      return {
        id: subId,
        ...mainCat.subcategories[subId],
        parentId: mainId,
        parentName: mainCat.name,
        parentColor: mainCat.color
      };
    }
  }
  return null;
};

export const getLeafGroupsBySubcategory = (subId) => {
  const subcategory = getSubcategoryById(subId);
  return subcategory ? subcategory.leafGroups : null;
};