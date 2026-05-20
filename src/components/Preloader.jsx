import { useEffect, useRef, useState } from 'react'
import { motion, animate } from 'framer-motion'

const CELL_SIZE = 140
const DURATION  = 5500

// only 2 random pauses, feel natural not mechanical
const PAUSES = [
  { at: 0.35, ms: 600 },
  { at: 0.72, ms: 420 },
]

function OdometerDigit({ value }) {
  const yRef   = useRef(0)
  const divRef = useRef(null)

  useEffect(() => {
    const from = yRef.current
    const to   = -(value * CELL_SIZE)

    const ctrl = animate(from, to, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        yRef.current = v
        if (divRef.current) {
          divRef.current.style.transform = `translateY(${v}px)`
        }
      },
    })

    return () => ctrl.stop()
  }, [value])

  return (
    <div style={{ height: CELL_SIZE, overflow: 'hidden', position: 'relative' }}>
      <div
        ref={divRef}
        style={{ display: 'flex', flexDirection: 'column', willChange: 'transform' }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              height: CELL_SIZE,
              width: CELL_SIZE * 0.65,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 300,
              fontSize: CELL_SIZE * 0.88,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              color: '#EBEBEB',
              userSelect: 'none',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Preloader({ onDone }) {
  const [count,         setCount]   = useState(0)
  const [exit,          setExit]    = useState(false)
  const rafRef                      = useRef(null)
  const startRef                    = useRef(null)
  const pausedUntilRef              = useRef(0)
  const pauseTotalRef               = useRef(0)
  const triggeredPauses             = useRef(new Set())

  useEffect(() => {
    const tick = (now) => {
      if (!startRef.current) startRef.current = now

      // hold during pause window
      if (now < pausedUntilRef.current) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const elapsed = now - startRef.current - pauseTotalRef.current
      const t       = Math.min(elapsed / DURATION, 1)
      const eased   = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      const next    = Math.floor(eased * 99)

      setCount(next)

      // trigger pauses at defined progress points
      for (const p of PAUSES) {
        if (!triggeredPauses.current.has(p.at) && eased >= p.at) {
          triggeredPauses.current.add(p.at)
          pausedUntilRef.current = now + p.ms
          pauseTotalRef.current += p.ms
          rafRef.current = requestAnimationFrame(tick)
          return
        }
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCount(99)
        setTimeout(() => setExit(true), 400)
        setTimeout(() => onDone?.(), 1300)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onDone])

  const tens  = Math.floor(count / 10)
  const units = count % 10

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0,
        background: '#0D0D0D',
        zIndex: 8000,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '2.4rem',
      }}
      animate={{ opacity: exit ? 0 : 1 }}
      transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1] }}
    >
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        <OdometerDigit value={tens}  />
        <OdometerDigit value={units} />
      </div>

      <div style={{
        width: 120, height: 1,
        background: '#1F1F1F',
        position: 'relative', overflow: 'hidden',
      }}>
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: '#EBEBEB',
            transformOrigin: 'left',
          }}
          animate={{ scaleX: count / 99 }}
          transition={{ duration: 0.08, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}