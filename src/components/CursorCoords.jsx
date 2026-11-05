import { useEffect, useRef, useState } from 'react'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const OFFSET_X = 18
const OFFSET_Y = 20

export default function CursorCoords() {
  const ref = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER)
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const node = ref.current
    if (!node) return

    let frame = 0
    let x = 0
    let y = 0
    let width = node.offsetWidth
    let height = node.offsetHeight
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight
    let visible = false

    const hide = () => {
      visible = false
      node.style.visibility = 'hidden'
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const render = () => {
      frame = 0
      let left = x + OFFSET_X
      let top = y + OFFSET_Y
      if (left + width > viewportWidth) left = x - width - OFFSET_X
      if (top + height > viewportHeight) top = y - height - OFFSET_Y
      node.textContent = `x ${String(x).padStart(4, '0')} · y ${String(y).padStart(4, '0')}`
      node.style.transform = `translate3d(${left}px, ${top}px, 0)`
      if (!visible) {
        visible = true
        node.style.visibility = 'visible'
      }
    }

    const onPointerMove = (event) => {
      x = Math.round(event.clientX)
      y = Math.round(event.clientY)
      if (!frame) frame = requestAnimationFrame(render)
    }

    const onResize = () => {
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') hide()
    }

    node.style.visibility = 'hidden'
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('resize', onResize)
    document.documentElement.addEventListener('pointerleave', hide)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-coords pointer-events-none fixed left-0 top-0 z-[105] select-none whitespace-nowrap font-mono text-meta tabular-nums tracking-[0.04em] text-neutral-500 opacity-70 transition-none print:hidden"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      x 0000 · y 0000
    </div>
  )
}
