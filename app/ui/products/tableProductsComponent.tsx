import type { Product, User } from '@prisma/client'
import { fetchFilteredProducts } from '@/app/lib/data'
import { formatCurrency } from '@/app/lib/utils'
import SortableTableHeader from '@/app/ui/products/SortableTableHeaderComponent'
import { UpdateButton } from '../defaultComponents/table-buttons'
import { DeleteDialog } from '@/app/ui/defaultComponents/delete-dialog'
import { deleteProduct } from '@/app/lib/actions'

type ProductWithUsers = Product & {
  createdByUser: Pick<User, 'name'> | null
  updatedByUser: Pick<User, 'name'> | null
}

export default async function TableProductsComponent({
  query,
  currentPage,
  category,
  status,
  sortBy,
}: {
  query: string
  currentPage: number
  category?: string
  status?: string
  sortBy?: string
}) {
  const products: ProductWithUsers[] = await fetchFilteredProducts(
    query,
    currentPage,
    category,
    status,
    sortBy
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-lg bg-white p-4 shadow-sm border border-gray-200"
              >
                {/* Header: Name and Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {product.category || '-'}
                    </p>
                  </div>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      product.isActive
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Price</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(product.price.toNumber())}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Stock</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {product.stock}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Dates and Users */}
                <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Created By</p>
                      <p className="text-xs font-medium text-gray-700">
                        {product.createdByUser?.name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Created</p>
                      <p className="text-xs font-medium text-gray-700">
                        {formatDate(product.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Updated By</p>
                      <p className="text-xs font-medium text-gray-700">
                        {product.updatedByUser?.name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Updated</p>
                      <p className="text-xs font-medium text-gray-700">
                        {formatDate(product.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <UpdateButton
                    id={product.id}
                    basePath="/dashboard/products"
                  />
                  <DeleteDialog
                    id={product.id}
                    itemName={product.name}
                    itemType="product"
                    deleteAction={deleteProduct}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <SortableTableHeader
                  label="Name"
                  sortKey="name"
                  className="sm:pl-6"
                />
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <SortableTableHeader label="Price" sortKey="price" />
                <th scope="col" className="px-3 py-5 font-medium">
                  Stock
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created By
                </th>
                <SortableTableHeader label="Created" sortKey="createdAt" />
                <th scope="col" className="px-3 py-5 font-medium">
                  Updated By
                </th>
                <SortableTableHeader label="Updated" sortKey="updatedAt" />
                <th scope="col" className="px-3 py-5 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.category || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(product.price.toNumber())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.stock}
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-[24rem] truncate">
                      {product.description || '-'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        product.isActive
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {product.createdByUser?.name || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {product.updatedByUser?.name || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {formatDate(product.updatedAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-2">
                      <UpdateButton
                        id={product.id}
                        basePath="/dashboard/products"
                      />
                      <DeleteDialog
                        id={product.id}
                        itemName={product.name}
                        itemType="product"
                        deleteAction={deleteProduct}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
