import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface CreateButtonProps {
  href: string
  label: string
}

interface ActionButtonProps {
  id: string
  basePath: string
}

interface DeleteButtonProps {
  id: string
  deleteAction: (id: string) => Promise<void>
}

/**
 * Generic Create Button Component
 * @param href - The path to create new resource (e.g., "/dashboard/products/create")
 * @param label - The label to display (e.g., "Create Product", "Create Invoice")
 */
export function CreateButton({ href, label }: CreateButtonProps) {
  return (
    <Link
      href={href}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">{label}</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  )
}

/**
 * Generic Update/Edit Button Component
 * @param id - The resource ID
 * @param basePath - The base path for editing (e.g., "/dashboard/products", "/dashboard/invoices")
 */
export function UpdateButton({ id, basePath }: ActionButtonProps) {
  return (
    <Link
      href={`${basePath}/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  )
}

/**
 * Generic Delete Button Component
 * @param id - The resource ID
 * @param deleteAction - The server action function to delete the resource
 */
export function DeleteButton({ id, deleteAction }: DeleteButtonProps) {
  const deleteWithId = deleteAction.bind(null, id)

  return (
    <form action={deleteWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  )
}
