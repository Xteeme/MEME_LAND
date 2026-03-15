'use client'

import { useState, useEffect } from 'react'

// Safe localStorage functions that only run on client side
export const useLocalStorage = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getItem = (key: string) => {
    if (!isClient) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return null
    }
  }

  const setItem = (key: string, value: string) => {
    if (!isClient) return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeItem = (key: string) => {
    if (!isClient) return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return { getItem, setItem, removeItem, isClient }
}
