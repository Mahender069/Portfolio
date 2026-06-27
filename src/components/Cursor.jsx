import { useEffect, useRef, useCallback } from 'react'
import { scrollProgressCallback } from './scrollProgressCallback'

export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const rootRef = useRef(null)
  const crosshairRef = useRef(null)
  const progressRingRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const crossPos = useRef({ x: -100, y: -100 })
  const prevMouse = useRef({ x: -100, y: -100 })
  const velocity = useRef(0)
  const rafId = useRef(null)
  const started = useRef(false)
  const isHovering = useRef(false)
  const lastMoveTime = useRef(0)
  const isIdle = useRef(true)
  const scrollProgressRef = useRef(0)

  const startLoopRef = useRef(null)

  const onMove = useCallback((e) => {
    const dx = e.clientX - prevMouse.current.x
    const dy = e.clientY - prevMouse.current.y
    velocity.current = Math.min(Math.sqrt(dx * dx + dy * dy), 80)

    prevMouse.current.x = e.clientX
    prevMouse.current.y = e.clientY
    target.current.x = e.clientX
    target.current.y = e.clientY

    lastMoveTime.current = performance.now()

    if (!started.current) {
      started.current = true
      ringPos.current.x = e.clientX
      ringPos.current.y = e.clientY
      crossPos.current.x = e.clientX
      crossPos.current.y = e.clientY
    }

    if (isIdle.current) {
      isIdle.current = false
      startLoopRef.current?.()
    }
  }, [])

  const startLoop = useCallback(() => {
    if (rafId.current) return

    const loop = () => {
      // Stop loop if idle for 1 second or tab hidden
      const now = performance.now()
      if (now - lastMoveTime.current > 1000 || document.hidden) {
        isIdle.current = true
        rafId.current = null
        return
      }

      velocity.current *= 0.92

      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.1
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.1

      crossPos.current.x += (target.current.x - crossPos.current.x) * 0.18
      crossPos.current.y += (target.current.y - crossPos.current.y) * 0.18

      if (ringRef.current) {
        const stretch = Math.min(velocity.current / 40, 0.3)
        const angle = Math.atan2(target.current.y - ringPos.current.y, target.current.x - ringPos.current.x)
        ringRef.current.style.transform =
          `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) rotate(${angle}rad) scaleX(${1 + stretch}) scaleY(${1 - stretch * 0.3})`
      }

      if (dotRef.current) {
        const dotScale = 1 + Math.min(velocity.current / 60, 0.4)
        dotRef.current.style.transform =
          `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%) scale(${dotScale})`
      }

      if (crosshairRef.current) {
        crosshairRef.current.style.transform =
          `translate(${crossPos.current.x}px, ${crossPos.current.y}px) translate(-50%, -50%)`
      }

      if (progressRingRef.current) {
        const circumference = 2 * Math.PI * 16
        progressRingRef.current.style.strokeDashoffset = circumference * (1 - scrollProgressRef.current)
      }

      rafId.current = requestAnimationFrame(loop)
    }

    rafId.current = requestAnimationFrame(loop)
  }, [])

  // Assign to ref for stable access from onMove
  useEffect(() => {
    startLoopRef.current = startLoop
  }, [startLoop])

  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true })

    const hide = () => rootRef.current?.classList.add('opacity-0')
    const show = () => rootRef.current?.classList.remove('opacity-0')
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)

    const onEnter = (e) => {
      const el = e.target.closest('a, button, input, textarea, .project__card, .tech-item, .contact__info-item')
      if (!el || isHovering.current) return
      isHovering.current = true

      const isCard = el.classList.contains('project__card')
      const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
      const isTech = el.classList.contains('tech-item')

      if (ringRef.current) {
        ringRef.current.style.width = isCard ? '80px' : isInput ? '32px' : '56px'
        ringRef.current.style.height = isCard ? '80px' : isInput ? '32px' : '56px'
        ringRef.current.style.borderColor = 'var(--accent)'
        ringRef.current.style.borderWidth = '1.5px'
        ringRef.current.classList.add('cursor-ring--active')
      }

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%) scale(0)`
      }

      if (crosshairRef.current) {
        crosshairRef.current.classList.add('cursor-cross--active')
        if (isCard) {
          crosshairRef.current.style.width = '24px'
          crosshairRef.current.style.height = '24px'
          crosshairRef.current.style.borderRadius = '50%'
          crosshairRef.current.style.border = '1px solid var(--accent)'
          crosshairRef.current.style.background = 'transparent'
        } else if (isTech) {
          crosshairRef.current.style.width = '16px'
          crosshairRef.current.style.height = '16px'
          crosshairRef.current.style.borderRadius = '2px'
          crosshairRef.current.style.border = '1.5px solid var(--accent)'
          crosshairRef.current.style.background = 'transparent'
          crosshairRef.current.style.clipPath = ''
        } else {
          crosshairRef.current.style.width = '20px'
          crosshairRef.current.style.height = '20px'
          crosshairRef.current.style.borderRadius = '0'
          crosshairRef.current.style.border = 'none'
          crosshairRef.current.style.background = 'var(--accent)'
          crosshairRef.current.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        }
      }
    }

    const onLeave = (e) => {
      const el = e.target.closest('a, button, input, textarea, .project__card, .tech-item, .contact__info-item')
      if (!el) return
      const related = e.relatedTarget?.closest('a, button, input, textarea, .project__card, .tech-item, .contact__info-item')
      if (related && related === el) return
      isHovering.current = false

      if (ringRef.current) {
        ringRef.current.style.width = ''
        ringRef.current.style.height = ''
        ringRef.current.style.borderColor = ''
        ringRef.current.style.borderWidth = ''
        ringRef.current.classList.remove('cursor-ring--active')
      }

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%) scale(1)`
      }

      if (crosshairRef.current) {
        crosshairRef.current.classList.remove('cursor-cross--active')
        crosshairRef.current.style.width = ''
        crosshairRef.current.style.height = ''
        crosshairRef.current.style.borderRadius = ''
        crosshairRef.current.style.border = ''
        crosshairRef.current.style.background = ''
        crosshairRef.current.style.clipPath = ''
      }
    }

    document.addEventListener('mouseenter', onEnter, true)
    document.addEventListener('mouseleave', onLeave, true)

    // Scroll progress updated via ScrollTrigger in App.jsx - no need for RAF

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
      document.removeEventListener('mouseenter', onEnter, true)
      document.removeEventListener('mouseleave', onLeave, true)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
        rafId.current = null
      }
    }
  }, [onMove])

  // Synchronous scroll progress setter - available immediately
  scrollProgressCallback.current = (progress) => {
    scrollProgressRef.current = progress
    if (progressRingRef.current) {
      const circumference = 2 * Math.PI * 16
      progressRingRef.current.style.strokeDashoffset = circumference * (1 - progress)
    }
  }

  return (
    <div
      ref={rootRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998] transition-opacity duration-300 hidden md:block"
      aria-hidden="true"
    >
      <svg
        ref={progressRingRef}
        className="fixed bottom-6 right-6 z-[9998]"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        style={{ opacity: 0.5 }}
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="rgba(237,235,245,0.08)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="url(#progress-grad)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray={2 * Math.PI * 16}
          strokeDashoffset={2 * Math.PI * 16}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
        <defs>
          <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div
        ref={crosshairRef}
        className="cursor-cross absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />
      <div
        ref={dotRef}
        className="absolute w-1.5 h-1.5 rounded-full bg-ink -translate-x-1/2 -translate-y-1/2 will-change-transform z-10"
      />
      <div
        ref={ringRef}
        className="cursor-ring absolute w-8 h-8 rounded-full border border-ink/20 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />
    </div>
  )
}