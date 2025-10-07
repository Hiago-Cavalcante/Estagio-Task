'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface SortableTableHeaderProps {
  label: string
  sortKey: string
  className?: string
}

export default function SortableTableHeader({
  label,
  sortKey,
  className = '',
}: SortableTableHeaderProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const currentSortBy = searchParams.get('sortBy') || ''
  const [currentKey, currentDirection] = currentSortBy.split('-')

  const isActive = currentKey === sortKey
  const isAscending = isActive && currentDirection === 'asc'
  const isDescending = isActive && currentDirection === 'desc'

  const handleSort = () => {
    const params = new URLSearchParams(searchParams)

    let newSortBy = ''

    if (!isActive) {
      newSortBy = `${sortKey}-desc`
    } else if (isDescending) {
      newSortBy = `${sortKey}-asc`
    } else if (isAscending) {
      params.delete('sortBy')
      params.set('page', '1')
      replace(`${pathname}?${params.toString()}`)
      return
    }

    params.set('sortBy', newSortBy)
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`)
  }

  const getTooltip = () => {
    if (!isActive) return 'Sort descending'
    if (isDescending) return 'Sort ascending'
    return 'Reset to default'
  }

  return (
    <th
      scope="col"
      className={`px-3 py-5 font-medium cursor-pointer select-none hover:bg-gray-100 transition-colors ${className}`}
      onClick={handleSort}
      title={getTooltip()}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <ChevronUpIcon
            className={`h-3 w-3 -mb-1 transition-colors ${
              isAscending ? 'text-blue-600 font-bold' : 'text-gray-400'
            }`}
          />
          <ChevronDownIcon
            className={`h-3 w-3 transition-colors ${
              isDescending ? 'text-blue-600 font-bold' : 'text-gray-400'
            }`}
          />
        </div>
      </div>
    </th>
  )
}
