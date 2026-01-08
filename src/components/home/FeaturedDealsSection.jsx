// src/components/home/FeaturedDealsSection.jsx

import React from 'react';
import SubcategoryProductSlider from './SubcategoryProductSlider';

export default function FeaturedDealsSection() {
  const featuredSections = [
    {
      title: 'Great deals on fruits & vegetables',
      subcategoryId: 'fresh-vegetables',
      viewAllLink: '/category/vegetables-fruits/subcategory/fresh-vegetables',
      products: [
        {
          id: 'onion-pyaz',
          name: 'Onion (Pyaz)',
          slug: 'onion-pyaz',
          quantity: '950 - 1050 g',
          price: 29,
          mrp: 37,
          image: '/products/onion.webp',
          deliveryTime: '18'
        },
        {
          id: 'banana',
          name: 'Banana',
          slug: 'banana',
          quantity: '3 pieces',
          price: 22,
          mrp: 25,
          image: '/products/banana.webp',
          deliveryTime: '18'
        },
        {
          id: 'spinach-palak',
          name: 'Spinach (Palak)',
          slug: 'spinach-palak',
          quantity: '200 g',
          price: 15,
          mrp: 17,
          image: '/products/spinach.webp',
          deliveryTime: '18'
        },
        {
          id: 'tender-coconut',
          name: 'Tender Coconut (Small)',
          slug: 'tender-coconut',
          quantity: '1 piece',
          price: 65,
          mrp: 80,
          image: '/products/coconut.webp',
          deliveryTime: '18'
        },
        {
          id: 'tomato',
          name: 'Tomato',
          slug: 'tomato',
          quantity: '500 g',
          price: 35,
          mrp: 45,
          image: '/products/tomato.webp',
          deliveryTime: '18'
        },
        {
          id: 'potato',
          name: 'Potato',
          slug: 'potato',
          quantity: '1 kg',
          price: 40,
          mrp: 50,
          image: '/products/potato.webp',
          deliveryTime: '18'
        }
      ]
    },
    {
      title: 'Dairy & breakfast essentials',
      subcategoryId: 'milk-butter',
      viewAllLink: '/category/dairy-bread-eggs/subcategory/milk-butter',
      products: [
        {
          id: 'amul-milk',
          name: 'Amul Gold Milk',
          slug: 'amul-gold-milk',
          quantity: '500 ml',
          price: 33,
          mrp: 35,
          image: '/products/amul-milk.webp',
          deliveryTime: '18'
        },
        {
          id: 'mother-dairy-butter',
          name: 'Mother Dairy Butter',
          slug: 'mother-dairy-butter',
          quantity: '100 g',
          price: 55,
          mrp: 60,
          image: '/products/butter.webp',
          deliveryTime: '18'
        },
        {
          id: 'britannia-bread',
          name: 'Britannia Bread',
          slug: 'britannia-bread',
          quantity: '400 g',
          price: 42,
          mrp: 45,
          image: '/products/bread.webp',
          deliveryTime: '18'
        },
        {
          id: 'amul-cheese',
          name: 'Amul Cheese Slices',
          slug: 'amul-cheese',
          quantity: '200 g',
          price: 125,
          mrp: 135,
          image: '/products/cheese.webp',
          deliveryTime: '18'
        }
      ]
    },
    {
      title: 'Snacks & munchies',
      subcategoryId: 'chips-kurkure',
      viewAllLink: '/category/chips-namkeen/subcategory/chips-kurkure',
      products: [
        {
          id: 'lays-classic',
          name: "Lay's Classic Salted",
          slug: 'lays-classic',
          quantity: '52 g',
          price: 20,
          mrp: 20,
          image: '/products/lays.webp',
          deliveryTime: '18'
        },
        {
          id: 'kurkure-masala',
          name: 'Kurkure Masala Munch',
          slug: 'kurkure-masala',
          quantity: '95 g',
          price: 20,
          mrp: 20,
          image: '/products/kurkure.webp',
          deliveryTime: '18'
        },
        {
          id: 'bingo-mad-angles',
          name: 'Bingo Mad Angles',
          slug: 'bingo-mad-angles',
          quantity: '72.5 g',
          price: 20,
          mrp: 20,
          image: '/products/bingo.webp',
          deliveryTime: '18'
        },
        {
          id: 'haldiram-bhujia',
          name: 'Haldiram Bhujia',
          slug: 'haldiram-bhujia',
          quantity: '200 g',
          price: 60,
          mrp: 65,
          image: '/products/bhujia.webp',
          deliveryTime: '18'
        }
      ]
    },
    {
      title: 'Cold drinks & juices',
      subcategoryId: 'cold-drinks',
      viewAllLink: '/category/drinks-juices/subcategory/cold-drinks',
      products: [
        {
          id: 'coca-cola',
          name: 'Coca Cola',
          slug: 'coca-cola',
          quantity: '750 ml',
          price: 40,
          mrp: 45,
          image: '/products/coca-cola.webp',
          deliveryTime: '18'
        },
        {
          id: 'pepsi',
          name: 'Pepsi',
          slug: 'pepsi',
          quantity: '750 ml',
          price: 40,
          mrp: 45,
          image: '/products/pepsi.webp',
          deliveryTime: '18'
        },
        {
          id: 'sprite',
          name: 'Sprite',
          slug: 'sprite',
          quantity: '750 ml',
          price: 40,
          mrp: 45,
          image: '/products/sprite.webp',
          deliveryTime: '18'
        },
        {
          id: 'real-juice',
          name: 'Real Fruit Juice',
          slug: 'real-juice',
          quantity: '1 L',
          price: 110,
          mrp: 120,
          image: '/products/real-juice.webp',
          deliveryTime: '18'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 lg:space-y-12">
      {featuredSections.map((section, index) => (
        <SubcategoryProductSlider
          key={section.subcategoryId}
          title={section.title}
          subcategoryId={section.subcategoryId}
          products={section.products}
          viewAllLink={section.viewAllLink}
        />
      ))}
    </div>
  );
}