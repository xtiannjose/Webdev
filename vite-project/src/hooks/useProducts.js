import { useEffect, useState } from 'react'
import { fetchProducts } from '../lib/api.js'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        if (mounted) setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return { products, loading, error }
}
