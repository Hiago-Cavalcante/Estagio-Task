'use client'

import { useEffect } from 'react'
import { useToast } from '@/app/hooks/use-toast'
import type { State, StateProduct } from '@/app/lib/definitions'

export function useFormToast(state: State | StateProduct) {
  const { toast } = useToast()

  useEffect(() => {
    if (state?.message) {
      const isError =
        state.message.includes('Failed') || state.message.includes('Missing')

      toast({
        title: isError ? 'Error' : 'Success',
        description: state.message,
        variant: isError ? 'destructive' : 'success',
      })
    }
  }, [state?.message, toast])
}
