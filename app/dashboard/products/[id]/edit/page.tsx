import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchProductById, fetchProductCategories } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/app/lib/definitions'
import ProductFormComponent from '@/app/ui/products/ProductFormComponent'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  const [product, categories] = await Promise.all([
    fetchProductById(id),
    fetchProductCategories(),
  ])

  if (!product) {
    notFound()
  }

  // Convert Prisma Decimal to number for the form
  const productForm: ProductForm = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    category: product.category,
    stock: product.stock,
    isActive: product.isActive,
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Edit Product',
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ProductFormComponent
        mode="edit"
        product={productForm}
        categories={categories}
      />
    </main>
  )
}
