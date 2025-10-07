'use client'

import {
  CurrencyDollarIcon,
  TagIcon,
  CubeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/ui/defaultComponents/buttonDefaultProject'
import { createProduct, updateProduct } from '@/app/lib/actions'
import type { StateProduct } from '@/app/lib/definitions'
import { useActionState, useState } from 'react'
import { useFormToast } from '@/app/ui/defaultComponents/use-form-toast'
import { ProductFormProps } from '@/app/lib/definitions'

export default function ProductFormComponent({
  product,
  mode,
  categories,
}: ProductFormProps) {
  const initialState: StateProduct = { message: null, errors: {} }

  // Define action based on mode
  const action =
    mode === 'edit' && product
      ? updateProduct.bind(null, product.id)
      : createProduct

  const [state, formAction] = useActionState(action, initialState)

  // Show toast notifications for form submission results
  useFormToast(state)

  // State for all form fields to preserve values on validation errors
  const [formValues, setFormValues] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    stock: product?.stock?.toString() || '',
    isActive: product?.isActive !== false ? 'true' : 'false',
  })

  // State for price formatting
  // Convert cents to dollars for display when editing
  const initialPriceInDollars = product?.price
    ? (product.price / 100).toString()
    : ''
  const [priceDisplay, setPriceDisplay] = useState(
    initialPriceInDollars ? formatPrice(initialPriceInDollars) : ''
  )
  const [priceValue, setPriceValue] = useState(initialPriceInDollars)

  const isEditMode = mode === 'edit'
  const buttonText = isEditMode ? 'Edit Product' : 'Create Product'

  // Format number to currency display
  function formatPrice(value: string): string {
    // Remove all non-digit and non-decimal characters
    const cleanValue = value.replace(/[^\d.]/g, '')

    // Handle empty string
    if (!cleanValue) return ''

    // Split into integer and decimal parts
    const parts = cleanValue.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]

    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Return formatted value
    if (decimalPart !== undefined) {
      return `${formattedInteger}.${decimalPart.slice(0, 2)}`
    }
    return formattedInteger
  }

  // Handle price input change
  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value

    // Remove commas to get raw number
    const rawValue = inputValue.replace(/,/g, '')

    // Validate it's a valid number
    if (rawValue === '' || /^\d*\.?\d{0,2}$/.test(rawValue)) {
      setPriceValue(rawValue)
      setPriceDisplay(formatPrice(rawValue))
    }
  }

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              placeholder="Enter product name"
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                state.errors?.name
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200 focus-visible:ring-gray-950'
              }`}
              aria-describedby="name-error"
              aria-invalid={state.errors?.name ? 'true' : 'false'}
            />
            <CubeIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
                state.errors?.name ? 'text-red-500' : 'text-gray-500'
              }`}
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
              placeholder="Enter product description"
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                state.errors?.description
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200 focus-visible:ring-gray-950'
              }`}
              aria-describedby="description-error"
              aria-invalid={state.errors?.description ? 'true' : 'false'}
            />
            <DocumentTextIcon
              className={`pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] ${
                state.errors?.description ? 'text-red-500' : 'text-gray-500'
              }`}
            />
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price-display"
                type="text"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="Enter price"
                className={`peer block w-full rounded-md border py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  state.errors?.price
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-gray-200 focus-visible:ring-gray-950'
                }`}
                aria-describedby="price-error"
                aria-invalid={state.errors?.price ? 'true' : 'false'}
              />
              {/* Convert dollars to cents for backend (multiply by 100) */}
              <input
                id="price"
                name="price"
                type="hidden"
                value={
                  priceValue
                    ? Math.round(parseFloat(priceValue) * 100).toString()
                    : ''
                }
              />
              <CurrencyDollarIcon
                className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
                  state.errors?.price
                    ? 'text-red-500'
                    : 'text-gray-500 peer-focus:text-gray-900'
                }`}
              />
            </div>
            {priceValue && (
              <p className="mt-1 text-xs text-gray-600">
                Value: ${formatPrice(priceValue)}{' '}
                {parseFloat(priceValue) > 0 &&
                  `(${parseFloat(priceValue).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })})`}
              </p>
            )}
            <div id="price-error" aria-live="polite" aria-atomic="true">
              {state.errors?.price &&
                state.errors.price.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Product Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              className={`peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                state.errors?.category
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200 focus-visible:ring-gray-950'
              }`}
              value={formValues.category}
              onChange={(e) =>
                setFormValues({ ...formValues, category: e.target.value })
              }
              aria-describedby="category-error"
              aria-invalid={state.errors?.category ? 'true' : 'false'}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <TagIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
                state.errors?.category ? 'text-red-500' : 'text-gray-500'
              }`}
            />
          </div>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category &&
              state.errors.category.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Stock */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Stock Quantity
          </label>
          <div className="relative">
            <input
              id="stock"
              name="stock"
              type="number"
              step="1"
              value={formValues.stock}
              onChange={(e) =>
                setFormValues({ ...formValues, stock: e.target.value })
              }
              placeholder="Enter stock quantity"
              className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                state.errors?.stock
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200 focus-visible:ring-gray-950'
              }`}
              aria-describedby="stock-error"
              aria-invalid={state.errors?.stock ? 'true' : 'false'}
            />
            <CubeIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
                state.errors?.stock ? 'text-red-500' : 'text-gray-500'
              }`}
            />
          </div>
          <div id="stock-error" aria-live="polite" aria-atomic="true">
            {state.errors?.stock &&
              state.errors.stock.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Product Status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="active"
                  name="isActive"
                  type="radio"
                  value="true"
                  checked={formValues.isActive === 'true'}
                  onChange={(e) =>
                    setFormValues({ ...formValues, isActive: e.target.value })
                  }
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="active"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Active
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="inactive"
                  name="isActive"
                  type="radio"
                  value="false"
                  checked={formValues.isActive === 'false'}
                  onChange={(e) =>
                    setFormValues({ ...formValues, isActive: e.target.value })
                  }
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="inactive"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Inactive
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.isActive &&
              state.errors.isActive.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">{buttonText}</Button>
      </div>
    </form>
  )
}
