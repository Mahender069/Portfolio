import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: -100, y: -100 })
  const last    = useRef({ x: -100, y: -100 })
  const dot     = useRef({ x: -100, y: -100 })
  const ring    = useRef({ x: -100, y: -100 })
  const velocity = useRef(0)
  const raf     = useRef(null)

  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [visible,  setVisible]  = useState(false)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const lerp = (a, b, t) => a + (b - a) * t

    const onMove  = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; if (!visible) setVisible(true) }
    const onEnter = () => setHovering(true)
    const onLeave = () => setHovering(false)
    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    const tick = () => {
      const dx = mouse.current.x - last.current.x
      const dy = mouse.current.y - last.current.y
      velocity.current = Math.sqrt(dx * dx + dy * dy)
      last.current = { ...mouse.current }

      dot.current.x  = lerp(dot.current.x,  mouse.current.x, 0.28)
      dot.current.y  = lerp(dot.current.y,  mouse.current.y, 0.28)
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12)

      const speed   = Math.min(velocity.current, 40)
      const stretch = speed * 0.015
      let scaleX = 1 + stretch
      let scaleY = 1 - stretch
      if (hovering) { scaleX *= 1.2; scaleY *= 1.2 }
      if (clicking) { scaleX *= 1.3; scaleY *= 1.3 }

      const angle        = Math.atan2(dy, dx)
      const currentAngle = ringRef.current?._angle || 0
      const newAngle     = currentAngle + (angle - currentAngle) * 0.2
      if (ringRef.current) ringRef.current._angle = newAngle

      if (dotRef.current) {
        dotRef.current.style.left = `${dot.current.x}px`
        dotRef.current.style.top  = `${dot.current.y}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left      = `${ring.current.x}px`
        ringRef.current.style.top       = `${ring.current.y}px`
        ringRef.current.style.transform = `translate(-50%,-50%) rotate(${newAngle}rad) scale(${scaleX},${scaleY})`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(raf.current)
    }
  }, [visible, hovering, clicking])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <div className="cursor" style={{ opacity: visible ? 1 : 0 }}>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  )
}