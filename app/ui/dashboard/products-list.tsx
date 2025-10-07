import { lusitana } from '@/app/ui/fonts'
import { fetchTopAndBottomPricedProducts } from '@/app/lib/data'
import { formatCurrency } from '@/app/lib/utils'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default async function ProductsPriceList() {
  const { topPriced, bottomPriced } = await fetchTopAndBottomPricedProducts()

  return (
    <div className="flex w-full flex-col">
      <h2 className={`${lusitana.className} mt-4 mb-4 text-xl md:text-2xl`}>
        Products by Price
      </h2>

      <div className="flex grow flex-col gap-4">
        {/* Most Expensive Products */}
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Most Expensive
            </h3>
          </div>
          <div className="bg-white px-4 rounded-lg">
            {topPriced.map((product, i) => (
              <div
                key={product.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-3',
                  {
                    'border-t border-gray-100': i !== 0,
                  }
                )}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">
                    {product.category}
                  </p>
                </div>
                <p
                  className={`${lusitana.className} text-sm font-medium text-green-600 md:text-base whitespace-nowrap`}
                >
                  {formatCurrency(Number(product.price))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Least Expensive Products */}
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowTrendingDownIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Most Affordable
            </h3>
          </div>
          <div className="bg-white px-4 rounded-lg">
            {bottomPriced.map((product, i) => (
              <div
                key={product.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-3',
                  {
                    'border-t border-gray-100': i !== 0,
                  }
                )}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">
                    {product.category}
                  </p>
                </div>
                <p
                  className={`${lusitana.className} text-sm font-medium text-blue-600 md:text-base whitespace-nowrap`}
                >
                  {formatCurrency(Number(product.price))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
