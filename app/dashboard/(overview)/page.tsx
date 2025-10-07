import RevenueChart from '@/app/ui/dashboard/revenue-chart'
import LatestInvoices from '@/app/ui/dashboard/latest-invoices'
import { lusitana } from '@/app/ui/fonts'
import { Suspense } from 'react'
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardSkeleton,
  ProductCardsSkeleton,
  ProductsChartSkeleton,
  LowStockAlertSkeleton,
  ProductsListSkeleton,
} from '@/app/ui/defaultComponents/skeletons'
import CardWrapper, {
  ProductCardWrapper,
} from '@/app/ui/defaultComponents/cards'
import ProductsChart from '@/app/ui/dashboard/products-chart'
import {
  fetchProductsCategoryCount,
  fetchLowStockProducts,
} from '@/app/lib/data'
import LowStockAlert from '@/app/ui/dashboard/low-Stock-alert'
import ProductsPriceList from '@/app/ui/dashboard/products-list'

async function LowStockAlertWrapper() {
  const lowStockProducts = await fetchLowStockProducts()
  return <LowStockAlert initialProducts={lowStockProducts} />
}

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <h3 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Invoices Overview
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
      <div className="my-6 h-px w-full bg-gray-200 dark:bg-gray-700" />
      <h3 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Products Overview
      </h3>
      <div className="flex justify-center">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
          <Suspense fallback={<ProductCardsSkeleton />}>
            <ProductCardWrapper />
          </Suspense>
        </div>
      </div>
      <h3 className={`${lusitana.className} mt-4 text-xl md:text-2xl`}>
        Products per Category
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense fallback={<ProductsChartSkeleton />}>
          <ProductsChartWrapper />
        </Suspense>
        <Suspense fallback={<LowStockAlertSkeleton />}>
          <LowStockAlertWrapper />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<ProductsListSkeleton />}>
          <ProductsPriceList />
        </Suspense>
      </div>
    </main>
  )
}

async function ProductsChartWrapper() {
  const dataProducts = await fetchProductsCategoryCount()
  return <ProductsChart data={dataProducts} />
}
