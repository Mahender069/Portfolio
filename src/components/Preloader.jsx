import { useEffect, useRef } from 'react'

function pad(n) {
  return String(Math.round(n)).padStart(3, '0')
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

const EASE = {
  linear: (t) => t,
  out3: (t) => 1 - (1 - t) ** 3,
  out4: (t) => 1 - (1 - t) ** 4,
  in2: (t) => t * t,
  inOut2: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  inOut3: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
}

const COUNT = [
  [0, 0, 0.35, 'linear'],
  [0, 2, 0.1, 'out3'],
  [2, 8, 0.18, 'out3'],
  [8, 15, 0.2, 'in2'],
  [15, 18, 0.08, 'out3'],
  [18, 32, 0.25, 'in2'],
  [32, 40, 0.18, 'out3'],
  [40, 42, 0.08, 'linear'],
  [42, 60, 0.28, 'inOut2'],
  [60, 68, 0.15, 'out3'],
  [68, 70, 0.1, 'linear'],
  [70, 85, 0.25, 'inOut3'],
  [85, 90, 0.15, 'out3'],
  [90, 90, 0.1, 'linear'],
  [90, 96, 0.2, 'inOut2'],
  [96, 100, 0.3, 'out4'],
]

const TOTAL_DUR = COUNT.reduce((s, c) => s + c[2], 0)

export default function Preloader({ onDone }) {
  const wrapRef = useRef(null)
  const numRef = useRef(null)
  const val = useRef(0)

  useEffect(() => {
    let cancelled = false
    let raf
    let lastTime = 0
    let ctx = null

    async function run() {
      const { gsap } = await import('gsap')
      if (cancelled) return

      const wrap = wrapRef.current
      const num = numRef.current
      if (!wrap || !num) return

      ctx = gsap.context(() => {
        gsap.set(wrap, { opacity: 1 })
        gsap.set(num, { scale: 1, opacity: 1 })

        let seg = 0
        let elapsed = 0

        const tick = (now) => {
          if (cancelled) return
          if (!lastTime) lastTime = now
          const dt = (now - lastTime) / 1000
          lastTime = now
          elapsed += dt

          if (seg < COUNT.length) {
            const [from, to, dur, easeName] = COUNT[seg]
            const t = Math.min(elapsed / dur, 1)
            val.current = lerp(from, to, EASE[easeName](t))
            if (t >= 1) { seg++; elapsed = 0 }
          }

          num.textContent = pad(val.current)

          if (seg < COUNT.length || val.current < 100) {
            raf = requestAnimationFrame(tick)
          }
        }
        raf = requestAnimationFrame(tick)

        const exit = gsap.timeline({
          delay: TOTAL_DUR + 0.15,
          onComplete: () => onDone?.(),
        })

        exit.to(num, {
          scale: 20,
          duration: 1.0,
          ease: 'power3.inOut',
        }, 0.2)

        exit.to(num, {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.in',
        }, 0.3)

        exit.to(wrap, {
          opacity: 0,
          duration: 1.0,
          ease: 'power2.inOut',
        }, 0.4)
      }, wrapRef)
    }

    run()

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      ctx?.revert()
    }
  }, [onDone])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
          background: '#08080D',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(240,237,230,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <span
        ref={numRef}
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: "'DM Sans', -apple-system, sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(4rem, 15vw, 14rem)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: '#F0EDE6',
          fontVariantNumeric: 'tabular-nums',
          userSelect: 'none',
          willChange: 'transform',
        }}
      >
        000
      </span>
    </div>
  )
}
