'use client'

import { useState, useEffect } from 'react'
import { Affirmation } from '../types'

interface UseAffirmationsReturn {
  affirmations: Affirmation[]
  currentAffirmation: Affirmation | null
  loading: boolean
  error: string | null
  fetchRandomAffirmation: (category?: string) => Promise<void>
  fetchAllAffirmations: (category?: string) => Promise<void>
  nextAffirmation: () => void
}

export const useAffirmations = (): UseAffirmationsReturn => {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const fetchRandomAffirmation = async (category?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      params.append('random', 'true')
      if (category && category !== 'all') {
        params.append('category', category)
      }

      const response = await fetch(`/api/affirmations?${params.toString()}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch affirmation')
      }

      if (result.data) {
        setCurrentAffirmation({
          ...result.data,
          id: result.data._id
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching random affirmation:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllAffirmations = async (category?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') {
        params.append('category', category)
      }

      const response = await fetch(`/api/affirmations?${params.toString()}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch affirmations')
      }

      const processedAffirmations = result.data.map((affirmation: any) => ({
        ...affirmation,
        id: affirmation._id
      }))

      setAffirmations(processedAffirmations)
      if (processedAffirmations.length > 0) {
        setCurrentAffirmation(processedAffirmations[0])
        setCurrentIndex(0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching affirmations:', err)
    } finally {
      setLoading(false)
    }
  }

  const nextAffirmation = () => {
    if (affirmations.length > 0) {
      const nextIndex = (currentIndex + 1) % affirmations.length
      setCurrentIndex(nextIndex)
      setCurrentAffirmation(affirmations[nextIndex])
    }
  }

  // Initialize with random affirmation on mount
  useEffect(() => {
    fetchRandomAffirmation()
  }, [])

  return {
    affirmations,
    currentAffirmation,
    loading,
    error,
    fetchRandomAffirmation,
    fetchAllAffirmations,
    nextAffirmation
  }
} 