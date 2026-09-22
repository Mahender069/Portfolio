import { useState, useEffect, useRef } from 'react'

export default function useVisitorCount() {
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    fetch('/.netlify/functions/visitors')
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return { count, loading }
}
