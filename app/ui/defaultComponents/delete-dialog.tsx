'use client'

import { useState, useTransition } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/ui/defaultComponents/dialog'
import { Button } from '@/app/ui/defaultComponents/button'
import { useToast } from '@/app/hooks/use-toast'

interface DeleteDialogProps {
  id: string
  itemName: string
  itemType: 'product' | 'invoice'
  deleteAction: (id: string) => Promise<void>
}

export function DeleteDialog({
  id,
  itemName,
  itemType,
  deleteAction,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAction(id)
        setOpen(false)
        toast({
          title: 'Success',
          description: `${
            itemType === 'product' ? 'Product' : 'Invoice'
          } deleted successfully.`,
          variant: 'success',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to delete ${itemType}. Please try again.`,
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-md border p-2 hover:bg-gray-100"
          type="button"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className="font-semibold">{itemName}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
