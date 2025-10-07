'use client'

import { useEffect, useState } from 'react'
import { lusitana } from '@/app/ui/fonts'
import {
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

const ITEMS_PER_PAGE = 5

interface LowStockProduct {
  id: string
  name: string
  category: string
  stock: number
}

interface LowStockAlertProps {
  initialProducts: LowStockProduct[]
}

export default function LowStockAlert({ initialProducts }: LowStockAlertProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const lowStockProducts = initialProducts

  // Calcular paginação
  const totalPages = Math.ceil(lowStockProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProducts = lowStockProducts.slice(startIndex, endIndex)

  // Reset para página 1 se não houver produtos na página atual
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  // Função para determinar o badge baseado no estoque
  function getStockBadge(stock: number) {
    if (stock === 0) {
      return {
        label: 'Out of Stock',
        color: 'bg-red-500',
        icon: XCircleIcon,
      }
    } else if (stock <= 2) {
      return {
        label: 'Low Stock',
        color: 'bg-yellow-500',
        icon: ExclamationTriangleIcon,
      }
    }
    return null
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${lusitana.className} text-xl md:text-2xl`}>
          Stock Alerts
        </h2>
        {lowStockProducts.length > 0 && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            {lowStockProducts.length}{' '}
            {lowStockProducts.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        )}
      </div>

      <div className="flow-root">
        {lowStockProducts.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              All products have sufficient stock levels.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {currentProducts.map((product) => {
              const badge = getStockBadge(product.stock)
              const Icon = badge?.icon

              return (
                <div
                  key={product.id}
                  className="rounded-lg bg-white p-4 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        {badge && (
                          <span
                            className={clsx(
                              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white',
                              badge.color
                            )}
                          >
                            {Icon && <Icon className="h-3 w-3" />}
                            {badge.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">
                          Category: {product.category}
                        </span>
                        <span className="font-medium">
                          Stock: {product.stock}{' '}
                          {product.stock === 1 ? 'unit' : 'units'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 rounded-lg">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(endIndex, lowStockProducts.length)}
                      </span>{' '}
                      of <span className="font-medium">{lowStockProducts.length}</span> alerts
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={clsx(
                            'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20',
                            currentPage === page
                              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                          )}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
