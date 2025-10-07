import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import ProductFormComponent from '@/app/ui/products/ProductFormComponent'
import { fetchProductCategories } from '@/app/lib/data'

export default async function Page() {
  const categories = await fetchProductCategories()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <ProductFormComponent mode="create" categories={categories} />
    </main>
  )
}
