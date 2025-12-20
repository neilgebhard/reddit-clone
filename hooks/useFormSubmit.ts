import { useState } from 'react'

/**
 * Custom hook for managing form submission loading and error states
 *
 * @returns Object containing loading state, error message, setError function, and executeSubmit wrapper
 *
 * @example
 * const { loading, error, setError, executeSubmit } = useFormSubmit()
 *
 * const handleSubmit = async (e: React.FormEvent) => {
 *   e.preventDefault()
 *   await executeSubmit(async () => {
 *     // Your form submission logic here
 *   })
 * }
 */
export function useFormSubmit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeSubmit = async <T,>(onSubmit: () => Promise<T>): Promise<T | undefined> => {
    try {
      setLoading(true)
      setError(null)
      const result = await onSubmit()
      return result
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, setError, executeSubmit }
}
