// src/components/layout/Breadcrumbs.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs({ items, className = '' }) {
  if (!items || items.length === 0) return null
  
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      <Link
        to="/"
        className="flex items-center gap-1 text-neutral-600 hover:text-orange-500 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            {isLast ? (
              <span className="text-neutral-800 font-medium truncate max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="text-neutral-600 hover:text-orange-500 transition-colors truncate max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}