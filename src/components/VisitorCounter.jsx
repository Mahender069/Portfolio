import useVisitorCount from '../hooks/useVisitorCount'

function pad(n) {
  return String(n).padStart(3, '0')
}

export default function VisitorCounter() {
  const { count, loading, error } = useVisitorCount()

  if (error) return null

  const isLoading = loading || count === null
  const displayNum = !isLoading ? pad(count) : null

  return (
    <section className="relative w-full max-w-[800px] mx-auto px-4 pb-24">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--border)]" />

      <div className="flex items-start justify-between pt-8">
        <div className="flex flex-col gap-3 pl-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)]">
            VISITOR INDEX
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)]">
            {isLoading ? 'INITIALIZING' : `ENTRY_${displayNum}`}
          </span>
        </div>

        <div className="font-display font-bold text-[var(--foreground)] tabular-nums select-none transition-all duration-200 hover:tracking-[0.06em]">
          {isLoading ? (
            <span className="text-[var(--foreground-muted)]">...</span>
          ) : (
            <span style={{ fontSize: 'clamp(10rem, 22vw, 24rem)', lineHeight: 0.9 }}>
              {displayNum}
            </span>
          )}
        </div>
      </div>

      <div className="mt-16 pl-6 flex items-baseline gap-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)]">
          YOU ARE VISITOR NO.
        </span>
        {!isLoading && (
          <span className="font-display font-bold text-[var(--foreground)]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1 }}>
            {displayNum}
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)]" />
    </section>
  )
}
