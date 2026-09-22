import useVisitorCount from '../hooks/useVisitorCount'

function pad(n) {
  return String(n).padStart(3, '0')
}

export default function VisitorCounter() {
  const { count, loading, error } = useVisitorCount()

  if (error) return null

  const isLoading = loading || count === null
  const displayNum = !isLoading ? pad(count) : '—'

  return (
    <div className="py-8 px-4 text-center">
      <p className="font-sans font-medium tracking-[-0.04em] leading-[0.95] text-[var(--foreground)]">
        YOU ARE VISITOR :{' '}
        <span className="font-mono font-normal">{displayNum}</span>
      </p>
    </div>
  )
}
