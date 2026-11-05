import { useEffect, useRef } from 'react'
import { cn } from '../utils/cn'

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

function parseRgb(value, fallback) {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return fallback
  const [r, g, b] = match[1].split(',').map((n) => Math.round(parseFloat(n)))
  return [r, g, b]
}

export default function Dithered({ src, alt, scale = 3, lens = 90, className }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const img = imgRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!wrap || !canvas || !img || !ctx) return

    let alive = true
    let resizeTimer = 0
    let width = 0
    let height = 0

    function paint() {
      if (!alive || !img.complete || !img.naturalWidth) return
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      const pw = Math.max(1, Math.ceil(width / scale))
      const ph = Math.max(1, Math.ceil(height / scale))

      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }

      const dark = document.documentElement.getAttribute('data-theme') === 'dark'
      const styles = getComputedStyle(canvas)
      const pageBg = parseRgb(
        getComputedStyle(wrap).backgroundColor,
        dark ? [16, 16, 16] : [255, 255, 255]
      )
      const ink = parseRgb(styles.color, dark ? [232, 229, 223] : [10, 10, 10])

      const ratio = img.naturalWidth / img.naturalHeight
      const boxRatio = pw / ph
      let dw
      let dh
      if (ratio > boxRatio) {
        dh = ph
        dw = ph * ratio
      } else {
        dw = pw
        dh = pw / ratio
      }

      ctx.clearRect(0, 0, pw, ph)
      ctx.drawImage(img, (pw - dw) / 2, (ph - dh) / 2, dw, dh)

      let pixels
      try {
        pixels = ctx.getImageData(0, 0, pw, ph).data
      } catch {
        canvas.style.display = 'none'
        return
      }

      const out = ctx.createImageData(pw, ph).data
      for (let y = 0; y < ph; y += 1) {
        for (let x = 0; x < pw; x += 1) {
          const i = (y * pw + x) * 4
          let lum = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]
          if (!dark) lum = 255 - lum
          const threshold = ((BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16) * 255
          const on = lum > threshold
          const rgb = on ? ink : pageBg
          out[i] = rgb[0]
          out[i + 1] = rgb[1]
          out[i + 2] = rgb[2]
          out[i + 3] = 255
        }
      }
      ctx.putImageData(new ImageData(out, pw, ph), 0, 0)
    }

    function schedulePaint() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(paint, 120)
    }

    function onPointer(e) {
      const rect = wrap.getBoundingClientRect()
      wrap.style.setProperty('--x', `${e.clientX - rect.left}px`)
      wrap.style.setProperty('--y', `${e.clientY - rect.top}px`)
    }

    function onPointerLeave() {
      wrap.style.setProperty('--x', '-9999px')
      wrap.style.setProperty('--y', '-9999px')
    }

    const resizeObserver = new ResizeObserver(schedulePaint)
    resizeObserver.observe(wrap)

    const themeObserver = new MutationObserver(paint)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    wrap.addEventListener('pointermove', onPointer)
    wrap.addEventListener('pointerdown', onPointer)
    wrap.addEventListener('pointerleave', onPointerLeave)
    img.addEventListener('load', paint)

    if (img.complete && img.naturalWidth) paint()

    return () => {
      alive = false
      window.clearTimeout(resizeTimer)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      wrap.removeEventListener('pointermove', onPointer)
      wrap.removeEventListener('pointerdown', onPointer)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      img.removeEventListener('load', paint)
    }
  }, [src, scale])

  const mask = `radial-gradient(circle ${lens}px at var(--x, -9999px) var(--y, -9999px), transparent 55%, #000 100%)`

  return (
    <div
      ref={wrapRef}
      className={cn('relative overflow-hidden bg-white', className)}
      style={{ '--x': '-9999px', '--y': '-9999px' }}
    >
      <img ref={imgRef} src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-neutral-900"
        style={{
          imageRendering: 'pixelated',
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  )
}
