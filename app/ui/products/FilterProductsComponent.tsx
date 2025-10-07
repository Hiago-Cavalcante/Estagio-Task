'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { FunnelIcon } from '@heroicons/react/24/outline'

interface FilterProductsProps {
  categories: string[]
}

export default function FilterProducts({ categories }: FilterProductsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleFilterChange = (
    filterType: 'category' | 'status',
    value: string
  ) => {
    const params = new URLSearchParams(searchParams)

    if (value && value !== 'all') {
      params.set(filterType, value)
    } else {
      params.delete(filterType)
    }

    // Reset to page 1 when filters change
    params.set('page', '1')

    replace(`${pathname}?${params.toString()}`)
  }

  const currentCategory = searchParams.get('category') || 'all'
  const currentStatus = searchParams.get('status') || 'all'

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 md:flex-row md:items-center md:gap-6">
      <div className="flex items-center gap-2">
        <FunnelIcon className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <label
          htmlFor="category-filter"
          className="text-sm font-medium text-gray-700 md:min-w-[80px]"
        >
          Category:
        </label>
        <select
          id="category-filter"
          value={currentCategory}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-48"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <label
          htmlFor="status-filter"
          className="text-sm font-medium text-gray-700 md:min-w-[80px]"
        >
          Status:
        </label>
        <select
          id="status-filter"
          value={currentStatus}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-48"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {(currentCategory !== 'all' || currentStatus !== 'all') && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.delete('category')
            params.delete('status')
            params.set('page', '1')
            replace(`${pathname}?${params.toString()}`)
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline md:ml-auto"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
