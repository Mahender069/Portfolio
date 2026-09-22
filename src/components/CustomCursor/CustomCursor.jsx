import { useRef, useEffect, useState } from 'react'

const INTERACTIVE_SELECTORS = 'a, button, [role="button"], input, select, textarea'
const BREAKPOINT = 768

export default function CustomCursor() {
  const xLineRef = useRef(null)
  const yLineRef = useRef(null)
  const coordRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const enabledRef = useRef(false)
  const labelWidthRef = useRef(60)
  const labelHeightRef = useRef(18)
  const isInteractingRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const smallScreen = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`)
    const coarsePointer = window.matchMedia('(pointer: coarse)')

    function checkConditions() {
      const shouldEnable =
        !prefersReduced.matches &&
        !coarsePointer.matches &&
        !smallScreen.matches
      enabledRef.current = shouldEnable
      setEnabled(shouldEnable)
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

    const xLine = xLineRef.current
    const yLine = yLineRef.current
    const coord = coordRef.current
    if (!xLine || !yLine || !coord) return

    let x = 0
    let y = 0
    let rafId = 0
    let pending = false

    function updateLines() {
      if (!enabledRef.current) {
        rafId = requestAnimationFrame(updateLines)
        return
      }

      xLine.style.transform = `translateY(${y}px)`
      yLine.style.transform = `translateX(${x}px)`

      const lineColor = isInteractingRef.current ? '#A09C95' : '#303030'
      const coordColor = isInteractingRef.current ? '#A09C95' : '#77736D'
      xLine.style.backgroundColor = lineColor
      yLine.style.backgroundColor = lineColor
      coord.style.color = coordColor

      const vw = window.innerWidth
      const vh = window.innerHeight
      const lw = labelWidthRef.current
      const lh = labelHeightRef.current

      const clampedX = Math.min(x + 14, vw - lw - 8)
      const clampedY = Math.min(y + 14, vh - lh - 8)

      coord.style.left = `${clampedX}px`
      coord.style.top = `${clampedY}px`
      coord.textContent = `x: ${Math.round(x)}\ny: ${Math.round(y)}`
    }

    function handleMouseMove(e) {
      x = e.clientX
      y = e.clientY

      if (coordRef.current) {
        labelWidthRef.current = coordRef.current.offsetWidth || 60
        labelHeightRef.current = coordRef.current.offsetHeight || 18
      }

      isInteractingRef.current = !!e.target?.closest?.(INTERACTIVE_SELECTORS)

      if (!pending) {
        pending = true
        rafId = requestAnimationFrame(() => {
          updateLines()
          pending = false
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })

    rafId = requestAnimationFrame(updateLines)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  return (
    <>
      <div
        ref={xLineRef}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          height: '1px',
          backgroundColor: '#303030',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translateY(0px)',
          willChange: 'transform',
          opacity: enabled ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />
      <div
        ref={yLineRef}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '1px',
          backgroundColor: '#303030',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translateX(0px)',
          willChange: 'transform',
          opacity: enabled ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />
      <div
        ref={coordRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9998,
          fontFamily: "'Geist Mono', monospace",
          fontSize: '10px',
          lineHeight: '14px',
          color: '#77736D',
          letterSpacing: '0.02em',
          whiteSpace: 'pre',
          opacity: enabled ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />
    </>
  )
}
