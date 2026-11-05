import { useEffect, useRef } from 'react'
import { getLenis } from '../utils/scroll'

const RAMP = ' .:-=+*#%@'
const RAMP_MAX = RAMP.length - 1
const BLOB_R = [0.55, 0.45, 0.42, 0.38, 0.34]
const F1 = [0.41, 0.53, 0.67, 0.79, 0.88]
const F2 = [0.47, 0.61, 0.73, 0.83, 0.37]
const F3 = [0.59, 0.43, 0.71, 0.51, 0.89]
const P1 = [0.0, 1.7, 3.1, 4.4, 5.6]
const P2 = [2.2, 0.4, 5.1, 1.3, 3.8]
const P3 = [4.0, 2.9, 0.7, 5.5, 1.9]
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const SMIN_K = 0.6
const RIPPLE = 0.025
const MARCH_STEPS = 28
const EPS = 0.003
const MAX_T = 7
const SPHERE_R = 2.4
const CAM_Z = -3.4
const FOCAL = 1.7
const POINTER_CLAMP = 2.0
const POINTER_PAD = 200
const LIGHT_LEN = Math.sqrt(1.25)
const LX = -0.5 / LIGHT_LEN
const LY = 0.8 / LIGHT_LEN
const LZ = -0.6 / LIGHT_LEN
const SIN_SIZE = 2048
const SIN_SCALE = SIN_SIZE / (Math.PI * 2)
const SIN_MASK = SIN_SIZE - 1
const SIN_LUT = new Float32Array(SIN_SIZE + 1)
for (let i = 0; i <= SIN_SIZE; i += 1) {
  SIN_LUT[i] = Math.sin((i / SIN_SIZE) * Math.PI * 2)
}

function fastSin(x) {
  return SIN_LUT[((x * SIN_SCALE) | 0) & SIN_MASK]
}

export default function AsciiScene({ className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const root = document.documentElement
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseMq = window.matchMedia('(pointer: coarse)')

    let alive = true
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let cell = coarseMq.matches ? 10 : 12
    let cw = cell * 0.6
    let ch = cell
    let offsetX = 0
    let offsetY = 0
    let cells = 0
    let font = ''
    let ink = getComputedStyle(canvas).color
    let dark = root.getAttribute('data-theme') !== 'light'
    let buckets = new Float32Array(0)
    let counts = new Int32Array(RAMP.length)

    let rafId = 0
    let lastFrame = 0
    let visible = true
    let time = 0
    let energy = 0
    let impulse = 0
    let lastScroll = 0
    let ema = 0
    let slowFrames = 0
    let fastFrames = 0

    let pointerInside = false
    let presence = 0
    let pointerX = 0
    let pointerY = 0
    let targetX = 0
    let targetY = 0

    const bx = new Float32Array(5)
    const by = new Float32Array(5)
    const bz = new Float32Array(5)
    let twistCos = 1
    let twistSin = 0
    let rippleT1 = 0
    let rippleT2 = 0
    let rippleT3 = 0
    let pointerBlob = 0

    let resizeTimer = 0
    let fontTimer = 0

    function updateScene() {
      const amp = 0.9 * (1 + 0.5 * impulse + 0.5 * energy)
      for (let i = 0; i < 5; i += 1) {
        bx[i] = amp * Math.cos(time * F1[i] + P1[i])
        by[i] = amp * Math.sin(time * F2[i] + P2[i])
        bz[i] = 0.45 * amp * Math.sin(time * F3[i] + P3[i])
      }
      const twist = 0.35 + energy * 1.6
      twistCos = Math.cos(twist)
      twistSin = Math.sin(twist)
      rippleT1 = 1.3 * time
      rippleT2 = time
      rippleT3 = 0.7 * time
      pointerBlob = presence
    }

    function mapAt(x, y, z) {
      const rx = x * twistCos - y * twistSin
      const ry = x * twistSin + y * twistCos
      const rz = z

      let dx = rx - bx[0]
      let dy = ry - by[0]
      let dz = rz - bz[0]
      let d = Math.sqrt(dx * dx + dy * dy + dz * dz) - BLOB_R[0]

      for (let i = 1; i < 5; i += 1) {
        dx = rx - bx[i]
        dy = ry - by[i]
        dz = rz - bz[i]
        const b = Math.sqrt(dx * dx + dy * dy + dz * dz) - BLOB_R[i]
        const h = Math.max(SMIN_K - Math.abs(d - b), 0) / SMIN_K
        d = Math.min(d, b) - h * h * SMIN_K * 0.25
      }

      if (pointerBlob > 0.001) {
        dx = rx - pointerX
        dy = ry - pointerY
        dz = rz
        const b = Math.sqrt(dx * dx + dy * dy + dz * dz) - 0.4 * pointerBlob
        const h = Math.max(SMIN_K - Math.abs(d - b), 0) / SMIN_K
        d = Math.min(d, b) - h * h * SMIN_K * 0.25
      }

      const ripple =
        RIPPLE * fastSin(4 * rx + rippleT1) * fastSin(4 * ry - rippleT2) * fastSin(4 * rz + rippleT3)

      return (d + ripple) * 0.8
    }

    function rayDensity(u, v, gx, gy) {
      const len = Math.sqrt(u * u + v * v + FOCAL * FOCAL)
      const rdx = u / len
      const rdy = v / len
      const rdz = FOCAL / len

      const b = CAM_Z * rdz
      const disc = b * b - (CAM_Z * CAM_Z - SPHERE_R * SPHERE_R)
      const dith = (BAYER[(gy & 3) * 4 + (gx & 3)] / 16 - 0.5) * 0.1

      let hit = false
      let hx = 0
      let hy = 0
      let hz = 0
      let steps = 0
      let minD = 0

      if (disc < 0) return 0

      const t0 = -b - Math.sqrt(disc)
      let t = t0 > 0 ? t0 : 0
      minD = 1e9
      for (let i = 0; i < MARCH_STEPS; i += 1) {
        hx = rdx * t
        hy = rdy * t
        hz = CAM_Z + rdz * t
        const d = mapAt(hx, hy, hz)
        const real = d * 1.25
        if (real < minD) minD = real
        steps = i
        if (d < EPS) {
          hit = true
          break
        }
        t += d
        if (t > MAX_T) break
      }
      if (minD < 0) minD = 0

      if (!hit) {
        if (minD > 0.25) return 0
        const density = 0.22 * Math.exp(-6 * minD) + dith
        return density > 0 ? density : 0
      }

      const e = 0.0015
      const f1 = mapAt(hx + e, hy - e, hz - e)
      const f2 = mapAt(hx - e, hy - e, hz + e)
      const f3 = mapAt(hx - e, hy + e, hz - e)
      const f4 = mapAt(hx + e, hy + e, hz + e)
      let nx = f1 - f2 - f3 + f4
      let ny = -f1 - f2 + f3 + f4
      let nz = -f1 + f2 - f3 + f4
      const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
      nx /= nlen
      ny /= nlen
      nz /= nlen

      let diff = nx * LX + ny * LY + nz * LZ
      if (diff < 0) diff = 0

      const dn = rdx * nx + rdy * ny + rdz * nz
      const rx = rdx - 2 * dn * nx
      const ry = rdy - 2 * dn * ny
      const rz = rdz - 2 * dn * nz
      const rl = rx * LX + ry * LY + rz * LZ
      let spec = 0
      if (rl > 0) {
        const rl2 = rl * rl
        const rl4 = rl2 * rl2
        const rl8 = rl4 * rl4
        spec = rl8 * rl8 * rl8 * rl8 * rl8
      }

      let ndv = -dn
      if (ndv < 0) ndv = 0
      if (ndv > 1) ndv = 1
      const invFres = 1 - ndv
      const fres = invFres * invFres * invFres

      const envBase = 0.5 + 0.5 * fastSin(ry * 5.5 + rx * 2.0 + time * 0.3)
      const env = envBase * envBase * envBase
      const ao = 1 - steps / MARCH_STEPS
      const shade = (0.12 + 0.45 * diff + 0.55 * env * (0.4 + 0.6 * fres) + spec) * (0.6 + 0.4 * ao)

      let density
      if (dark) {
        density = shade + dith
      } else {
        density = 1 - shade + dith
        if (density < 0.18) density = 0.18
      }
      if (density < 0) density = 0
      if (density > 1) density = 1
      return density
    }

    function layout() {
      if (!alive) return
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      font = `${cell}px "Geist Mono", ui-monospace, monospace`
      ctx.font = font
      cw = ctx.measureText('M').width || cell * 0.6
      ch = cell
      cols = Math.max(1, Math.floor(width / cw))
      rows = Math.max(1, Math.floor(height / ch))
      offsetX = (width - cols * cw) / 2
      offsetY = (height - rows * ch) / 2
      cells = cols * rows

      const needed = RAMP.length * cells * 2
      if (buckets.length < needed) buckets = new Float32Array(needed)
      counts = new Int32Array(RAMP.length)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ink = getComputedStyle(canvas).color
      dark = root.getAttribute('data-theme') !== 'light'
      lastFrame = 0
      ema = 0
      slowFrames = 0
      fastFrames = 0
    }

    function drawFrame() {
      if (!cols || !rows) return 0
      const started = performance.now()
      updateScene()

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = ink
      ctx.font = font
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      counts.fill(0)

      const halfW = width / 2
      const halfH = height / 2

      for (let gy = 0; gy < rows; gy += 1) {
        const py = offsetY + gy * ch + ch / 2
        const v = -(py - halfH) / halfH
        for (let gx = 0; gx < cols; gx += 1) {
          const px = offsetX + gx * cw + cw / 2
          const u = (px - halfW) / halfH
          const density = rayDensity(u, v, gx, gy)
          if (density <= 0) continue
          let idx = (density * RAMP_MAX) | 0
          if (idx > RAMP_MAX) idx = RAMP_MAX
          if (idx <= 0) continue
          const o = idx * cells * 2 + counts[idx] * 2
          buckets[o] = px
          buckets[o + 1] = py
          counts[idx] += 1
        }
      }

      for (let i = 1; i <= RAMP_MAX; i += 1) {
        const n = counts[i]
        if (!n) continue
        ctx.globalAlpha = 0.22 + (i / RAMP_MAX) * 0.78
        const base = i * cells * 2
        const glyph = RAMP[i]
        for (let k = 0; k < n; k += 1) {
          const o = base + k * 2
          ctx.fillText(glyph, buckets[o], buckets[o + 1])
        }
      }
      ctx.globalAlpha = 1
      return performance.now() - started
    }

    function drawStatic() {
      time = 2.0
      energy = 0
      impulse = 0
      presence = 0
      drawFrame()
    }

    function start() {
      if (rafId || !alive || reduceMq.matches || !visible || document.hidden) return
      lastFrame = 0
      rafId = requestAnimationFrame(frame)
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      lastFrame = 0
    }

    function frame(now) {
      rafId = 0
      if (!alive || reduceMq.matches || !visible || document.hidden) return

      const lenis = getLenis()
      const scroll = lenis ? lenis.scroll : window.scrollY
      if (!lastFrame) {
        lastFrame = now
        lastScroll = scroll
        rafId = requestAnimationFrame(frame)
        return
      }

      const dt = Math.min(0.05, (now - lastFrame) / 1000)
      lastFrame = now
      if (dt <= 0) {
        rafId = requestAnimationFrame(frame)
        return
      }

      const velocity = lenis ? lenis.velocity || 0 : (scroll - lastScroll) / dt
      const targetEnergy = Math.min(1, Math.abs(velocity) / 45)
      energy += (targetEnergy - energy) * 0.08
      lastScroll = scroll

      const smooth = 1 - Math.pow(0.92, dt * 60)
      pointerX += (targetX - pointerX) * smooth
      pointerY += (targetY - pointerY) * smooth
      const targetPresence = pointerInside && !coarseMq.matches ? 1 : 0
      presence += (targetPresence - presence) * smooth
      impulse *= Math.pow(0.5, dt / 0.4)

      time += dt * 0.35 * (1 + energy * 3)

      const ms = drawFrame()

      ema = ema === 0 ? ms : ema * 0.9 + ms * 0.1
      const base = coarseMq.matches ? 10 : 12
      if (ema > 14) {
        fastFrames = 0
        slowFrames += 1
        if (slowFrames >= 30 && cell < 20) {
          cell = Math.min(20, cell + 2)
          layout()
          slowFrames = 0
        }
      } else if (ema < 5) {
        slowFrames = 0
        fastFrames += 1
        if (fastFrames >= 120 && cell > base) {
          cell = Math.max(base, cell - 2)
          layout()
          fastFrames = 0
        }
      } else {
        slowFrames = 0
        fastFrames = 0
      }

      rafId = requestAnimationFrame(frame)
    }

    function rebuild() {
      layout()
      if (reduceMq.matches) {
        stop()
        drawStatic()
      } else {
        start()
      }
    }

    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(rebuild, 100)
    }

    function onFontsDone() {
      window.clearTimeout(fontTimer)
      fontTimer = window.setTimeout(rebuild, 120)
    }

    function onThemeChange() {
      ink = getComputedStyle(canvas).color
      dark = root.getAttribute('data-theme') !== 'light'
      if (reduceMq.matches) drawStatic()
    }

    function onMediaChange() {
      cell = coarseMq.matches ? 10 : 12
      if (reduceMq.matches) {
        layout()
        stop()
        drawStatic()
      } else {
        layout()
        start()
      }
    }

    function onPointerMove(event) {
      if (coarseMq.matches) {
        pointerInside = false
        return
      }
      const rect = wrap.getBoundingClientRect()
      const lx = event.clientX - rect.left
      const ly = event.clientY - rect.top
      pointerInside =
        lx >= -POINTER_PAD &&
        lx <= rect.width + POINTER_PAD &&
        ly >= -POINTER_PAD &&
        ly <= rect.height + POINTER_PAD
      if (!pointerInside) return

      const halfH = rect.height / 2
      const u = (lx - rect.width / 2) / halfH
      const v = -(ly - rect.height / 2) / halfH
      let wx = u * 2
      let wy = v * 2
      const r = Math.sqrt(wx * wx + wy * wy)
      if (r > POINTER_CLAMP) {
        wx *= POINTER_CLAMP / r
        wy *= POINTER_CLAMP / r
      }
      targetX = wx
      targetY = wy
    }

    function onPointerOut(event) {
      if (!event.relatedTarget) pointerInside = false
    }

    function onPointerDown(event) {
      const rect = wrap.getBoundingClientRect()
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        impulse = 1
      }
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
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    reduceMq.addEventListener('change', onMediaChange)
    coarseMq.addEventListener('change', onMediaChange)

    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    let fontsAlive = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!fontsAlive || !alive) return
        rebuild()
      })
    }
    document.fonts?.addEventListener?.('loadingdone', onFontsDone)

    rebuild()

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
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibility)
      reduceMq.removeEventListener('change', onMediaChange)
      coarseMq.removeEventListener('change', onMediaChange)
      document.fonts?.removeEventListener?.('loadingdone', onFontsDone)
    }
  }, [])

  return (
    <div ref={wrapRef} className={`relative w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-neutral-900"
      />
    </div>
  )
}
