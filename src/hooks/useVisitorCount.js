import { useState, useEffect, useRef } from 'react'

export default function useVisitorCount() {
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    fetch('/.netlify/functions/visitors')
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count ?? null)
        setLoading(false)
        setError(false)
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })
  }, [])

  return { count, loading, error }
}
