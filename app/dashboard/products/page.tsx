import { fetchProductsPages, fetchProductCategories } from '@/app/lib/data'
import { lusitana } from '@/app/ui/fonts'
import Pagination from '@/app/ui/invoices/pagination'
import TableProductsComponent from '@/app/ui/products/tableProductsComponent'
import Search from '@/app/ui/defaultComponents/search'
import { ProductTableSkeleton } from '@/app/ui/defaultComponents/skeletons'
import FilterProducts from '@/app/ui/products/FilterProductsComponent'
import { Suspense } from 'react'
import { CreateButton } from '@/app/ui/defaultComponents/table-buttons'

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
    category?: string
    status?: string
    sortBy?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  const category = searchParams?.category || ''
  const status = searchParams?.status || ''
  const sortBy = searchParams?.sortBy || ''

  const [totalPages, categories] = await Promise.all([
    fetchProductsPages(query, category, status),
    fetchProductCategories(),
  ])

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search products..." />
        <CreateButton
          href="/dashboard/products/create"
          label="Create Product"
        />
      </div>
      <div className="mt-4">
        <FilterProducts categories={categories} />
      </div>
      <Suspense
        key={query + currentPage + category + status + sortBy}
        fallback={<ProductTableSkeleton />}
      >
        <TableProductsComponent
          query={query}
          currentPage={currentPage}
          category={category}
          status={status}
          sortBy={sortBy}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
