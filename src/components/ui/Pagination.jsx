// src/components/ui/Pagination.jsx

import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { calculatePaginationRange } from '@/utils/calculations'

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisible = 5,
  className = ''
}) {
  const pages = calculatePaginationRange(currentPage, totalPages, maxVisible)
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }
  
  if (totalPages <= 1) return null
  
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
        aria-label="First page"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="min-w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && (
              <span className="px-2 text-neutral-600">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`min-w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
              page === currentPage
                ? 'bg-orange-500 border-orange-500 text-white font-semibold'
                : 'border-neutral-300 hover:bg-orange-50 hover:border-orange-500'
            }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-neutral-600">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="min-w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
        aria-label="Last page"
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export function SimplePagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }
  
  if (totalPages <= 1) return null
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Previous</span>
      </button>

      <span className="text-neutral-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 hover:bg-orange-50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
      >
        <span>Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}