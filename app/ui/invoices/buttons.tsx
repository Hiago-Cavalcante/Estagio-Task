import { deleteInvoice } from '@/app/lib/actions'
import {
  CreateButton,
  UpdateButton,
  DeleteButton,
} from '@/app/ui/defaultComponents/table-buttons'

export function CreateInvoice() {
  return (
    <CreateButton href="/dashboard/invoices/create" label="Create Invoice" />
  )
}

export function UpdateInvoice({ id }: { id: string }) {
  return <UpdateButton id={id} basePath="/dashboard/invoices" />
}

export function DeleteInvoice({ id }: { id: string }) {
  return <DeleteButton id={id} deleteAction={deleteInvoice} />
}
