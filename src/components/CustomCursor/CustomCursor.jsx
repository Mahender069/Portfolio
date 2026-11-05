import { useRef, useEffect, useState } from 'react'

const BREAKPOINT = 768

export default function CustomCursor() {
  const dotRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const smallScreen = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`)
    const coarsePointer = window.matchMedia('(pointer: coarse)')

    function checkConditions() {
      setEnabled(
        !prefersReduced.matches &&
          !coarsePointer.matches &&
          !smallScreen.matches
      )
    }

    checkConditions()

    prefersReduced.addEventListener('change', checkConditions)
    smallScreen.addEventListener('change', checkConditions)
    coarsePointer.addEventListener('change', checkConditions)

    return () => {
      prefersReduced.removeEventListener('change', checkConditions)
      smallScreen.removeEventListener('change', checkConditions)
      coarsePointer.removeEventListener('change', checkConditions)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    if (!dot) return

    const onMove = (e) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    return () => document.removeEventListener('mousemove', onMove)
  }, [enabled])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '6px',
        height: '6px',
        borderRadius: '999px',
        background: 'var(--foreground)',
        opacity: enabled ? 0.55 : 0,
        pointerEvents: 'none',
        zIndex: 9999,
        viewTransitionName: 'cursor',
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        willChange: 'transform',
        transition: 'opacity 0.15s ease',
      }}
    />
  )
}
