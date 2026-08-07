import { useRef, useEffect, useState } from 'react'

const INTERACTIVE_SELECTORS =
  'a, button, [role="button"], input, select, textarea'

export default function CustomCursor() {
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth < 768

    if (prefersReduced || isTouch || isSmallScreen) return

    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const ring = ringRef.current
    if (!ring) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let velX = 0
    let velY = 0
    let prevX = 0
    let prevY = 0
    let targetScale = 1
    let currentScale = 1
    let isInteractive = false
    let isPressed = false
    let rafId = 0

    function initPosition(e) {
      currentX = targetX = e.clientX
      currentY = targetY = e.clientY
      prevX = targetX
      prevY = targetY
    }

    function getBaseScale() {
      if (isPressed) return 0.7
      if (isInteractive) return 1.5
      return 1
    }

    function applyTransform() {
      const speed = Math.sqrt(velX * velX + velY * velY)
      const stretchFactor = Math.min(speed / 20, 0.3)

      if (speed > 1 && !isPressed) {
        const angle = Math.atan2(velY, velX)
        const scaleX = currentScale * (1 + Math.cos(angle) * stretchFactor)
        const scaleY = currentScale * (1 + Math.sin(angle) * stretchFactor)
        ring.style.transform = `translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`
      } else {
        ring.style.transform = `translate(-50%, -50%) scale(${currentScale})`
      }
    }

    function handleMouseMove(e) {
      targetX = e.clientX
      targetY = e.clientY
      velX = targetX - prevX
      velY = targetY - prevY
      prevX = targetX
      prevY = targetY

      const wasInteractive = isInteractive
      isInteractive = !!e.target?.closest?.(INTERACTIVE_SELECTORS)
      if (wasInteractive !== isInteractive) {
        targetScale = getBaseScale()
      }
    }

    function handleMouseDown() {
      isPressed = true
      targetScale = getBaseScale()
    }

    function handleMouseUp() {
      isPressed = false
      targetScale = getBaseScale()
    }

    function handleMouseLeave() {
      isInteractive = false
      isPressed = false
      targetScale = getBaseScale()
    }

    function animate() {
      const posSpring = 0.25
      currentX += (targetX - currentX) * posSpring
      currentY += (targetY - currentY) * posSpring

      const scaleSpring = 0.2
      currentScale += (targetScale - currentScale) * scaleSpring

      ring.style.left = `${currentX}px`
      ring.style.top = `${currentY}px`

      applyTransform()

      velX *= 0.8
      velY *= 0.8

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', initPosition, { once: true })

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)

    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', initPosition)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  return (
    <div
      ref={ringRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '16px',
        height: '16px',
        pointerEvents: 'none',
        zIndex: 9998,
        borderRadius: '50%',
        border: '1px solid #1f2937',
        opacity: enabled ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    />
  )
}
