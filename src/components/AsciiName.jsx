import { useEffect, useRef } from 'react'
import { profile } from '../constants/portfolio'
import { getLenis } from '../utils/scroll'

const RAMP = ' .·:-=+*#%@'
const FONT = "'Geist', 'Space Grotesk', sans-serif"
const RIPPLE_SIGMA = 130

function hash(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export default function AsciiName({
  text = profile.firstName.toUpperCase(),
  cell = 12,
  enabled = true,
  className = '',
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!enabled) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseMq = window.matchMedia('(pointer: coarse)')
    const staticMode = () => reduceMq.matches || coarseMq.matches
    const cellSize = () => (coarseMq.matches ? 11 : cell)

    let mask = new Float32Array(0)
    let cols = 0
    let rows = 0
    let width = 0
    let height = 0
    let buildKey = ''
    let color = getComputedStyle(canvas).color
    let colorCheck = 0
    let time = 0
    let energy = 0
    let lastFrame = 0
    let lastScroll = 0
    let rafId = 0
    let visible = true
    let alive = true
    let resizeTimer = 0
    let fontTimer = 0
    let pointerX = -9999
    let pointerY = -9999

    function readScroll() {
      const lenis = getLenis()
      return lenis ? lenis.scroll : window.scrollY
    }

    function drawFrame(isStatic) {
      if (!cols || !rows) return
      const c = cellSize()
      const cw = c * 0.6

      if (!isStatic) {
        const now = performance.now()
        if (now - colorCheck > 1000) {
          color = getComputedStyle(canvas).color
          colorCheck = now
        }
      }

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = color
      ctx.font = `900 ${c}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let gy = 0; gy < rows; gy += 1) {
        for (let gx = 0; gx < cols; gx += 1) {
          const px = gx * cw + cw / 2
          const py = gy * c + c / 2

          let sx = gx
          let sy = gy

          if (!isStatic) {
            const dx = px - pointerX
            const dy = py - pointerY
            const d2 = dx * dx + dy * dy
            const f = Math.exp(-d2 / (2 * RIPPLE_SIGMA * RIPPLE_SIGMA))
            if (f > 0.015) {
              const d = Math.sqrt(d2)
              const phase = d * 0.06 - time * 6
              sx += (f * 4 * Math.sin(phase)) / cw
              sy += (f * 4 * Math.cos(phase)) / c
            }
          }

          const mx = Math.min(cols - 1, Math.max(0, Math.round(sx)))
          const my = Math.min(rows - 1, Math.max(0, Math.round(sy)))
          const m = mask[my * cols + mx]

          let n = 0.5
          if (!isStatic) {
            n =
              0.5 +
              (Math.sin(gx * 0.13 + time * 0.8) +
                Math.sin(gy * 0.17 - time * 0.6) +
                Math.sin((gx + gy) * 0.09 + time * 0.5)) /
                6
          }

          let v = n * 0.28 * (1 - m) + m * (0.6 + 0.4 * n)
          if (!isStatic) v -= energy * m * hash(my * cols + mx) * 0.7
          if (v <= 0.08) continue

          const glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))]
          if (glyph === ' ') continue

          ctx.globalAlpha = 0.12 + Math.min(v, 1) * 0.85
          ctx.fillText(glyph, px, py)
        }
      }
      ctx.globalAlpha = 1
    }

    function drawStatic() {
      drawFrame(true)
    }

    function buildMask(force = false) {
      if (!alive) return
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      const c = cellSize()
      const key = `${width}x${height}x${c}`
      if (!force && key === buildKey) return
      buildKey = key

      cols = Math.max(1, Math.ceil(width / (c * 0.6)))
      rows = Math.max(1, Math.ceil(height / c))

      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return

      octx.font = `900 100px ${FONT}`
      const metrics = octx.measureText(text)
      const textW = metrics.width || 1
      const textH =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent || 72
      const size = Math.min(
        (cols * 0.92 * 100) / textW,
        (rows * 0.8 * 100) / (textH * 0.6)
      )

      octx.font = `900 ${size}px ${FONT}`
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.save()
      octx.translate(cols / 2, rows / 2)
      octx.scale(1, 0.6)
      octx.fillText(text, 0, 0)
      octx.restore()

      const data = octx.getImageData(0, 0, cols, rows).data
      mask = new Float32Array(cols * rows)
      for (let i = 0; i < mask.length; i += 1) mask[i] = data[i * 4 + 3] / 255

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      color = getComputedStyle(canvas).color
      colorCheck = performance.now()

      if (staticMode()) drawStatic()
    }

    function frame(now) {
      rafId = 0
      if (!alive || staticMode() || !visible || document.hidden) return
      if (!lastFrame) {
        lastFrame = now
        lastScroll = readScroll()
      }
      const dt = Math.min(0.05, (now - lastFrame) / 1000)
      lastFrame = now

      const scroll = readScroll()
      const target = Math.min(1, Math.abs(scroll - lastScroll) / 30)
      lastScroll = scroll
      energy += (target - energy) * 0.08
      time += dt * (1 + energy * 2.5)

      drawFrame(false)
      rafId = requestAnimationFrame(frame)
    }

    function start() {
      if (rafId || staticMode() || !visible || document.hidden) return
      lastFrame = 0
      rafId = requestAnimationFrame(frame)
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      lastFrame = 0
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect()
      pointerX = e.clientX - rect.left
      pointerY = e.clientY - rect.top
    }

    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => buildMask(), 100)
    }

    function onFontsDone() {
      window.clearTimeout(fontTimer)
      fontTimer = window.setTimeout(() => buildMask(true), 120)
    }

    function onThemeChange() {
      color = getComputedStyle(canvas).color
      colorCheck = performance.now()
      if (staticMode()) drawStatic()
    }

    function onMediaChange() {
      buildMask()
      if (staticMode()) {
        stop()
        drawStatic()
      } else {
        start()
      }
    }

    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 }
    )
    intersection.observe(wrap)

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(wrap)

    const themeObserver = new MutationObserver(onThemeChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    reduceMq.addEventListener('change', onMediaChange)
    coarseMq.addEventListener('change', onMediaChange)

    let fontsAlive = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (fontsAlive && alive) buildMask(true)
      })
    }
    document.fonts?.addEventListener?.('loadingdone', onFontsDone)

    buildMask(true)
    start()

    return () => {
      alive = false
      fontsAlive = false
      stop()
      intersection.disconnect()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      window.clearTimeout(resizeTimer)
      window.clearTimeout(fontTimer)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      reduceMq.removeEventListener('change', onMediaChange)
      coarseMq.removeEventListener('change', onMediaChange)
      document.fonts?.removeEventListener?.('loadingdone', onFontsDone)
    }
  }, [cell, enabled, text])

  return (
    <>
      <h1 className="sr-only">{text}</h1>
      {enabled && (
        <div ref={wrapRef} className={`relative w-full overflow-hidden ${className}`}>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full text-neutral-900"
          />
        </div>
      )}
    </>
  )
}
