// src/components/layout/Navigation.jsx

import React from 'react'
import { NavLink } from 'react-router-dom'
import { CATEGORIES } from '@/utils/constants'

export default function Navigation({ className = '' }) {
  const navCategories = CATEGORIES.slice(0, 8)
  
  return (
    <nav className={`border-t border-neutral-200 ${className}`}>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-orange-500 text-white'
                : 'text-neutral-700 hover:bg-orange-50 hover:text-orange-600'
            }`
          }
        >
          All Products
        </NavLink>

        {navCategories.map((category) => (
          <NavLink
            key={category.id}
            to={`/category/${category.id}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-neutral-700 hover:bg-orange-50 hover:text-orange-600'
              }`
            }
          >
            {category.name}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}