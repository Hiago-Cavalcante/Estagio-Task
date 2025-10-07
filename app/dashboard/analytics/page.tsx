import { lusitana } from '@/app/ui/fonts'
import { Suspense } from 'react'
import ProductsEvolutionChart from '@/app/ui/dashboard/products-evolution-chart'
import { fetchProductsCreatedByMonth } from '@/app/lib/data'
import {
  ProductCardsSkeleton,
  ProductsChartSkeleton,
} from '@/app/ui/defaultComponents/skeletons'

export default async function AnalyticsPage() {
  return (
    <main>
      <div className="mb-6">
        <h1
          className={`${lusitana.className} text-2xl md:text-3xl font-bold text-gray-900`}
        >
          Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Comprehensive insights into your product inventory and performance
          metrics
        </p>
      </div>

      {/* Products Evolution Chart */}
      <section className="mb-8">
        <h2
          className={`${lusitana.className} text-lg md:text-xl mb-4 text-gray-800`}
        >
          Growth Trends
        </h2>
        <Suspense fallback={<ProductsChartSkeleton />}>
          <ProductsEvolutionChartWrapper />
        </Suspense>
      </section>
    </main>
  )
}

async function ProductsEvolutionChartWrapper() {
  const evolutionData = await fetchProductsCreatedByMonth()
  return <ProductsEvolutionChart data={evolutionData} />
}
