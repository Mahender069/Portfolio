let ctx = null
let lastPlay = 0

function ensureCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playWaterDrop() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const now = performance.now()
    if (now - lastPlay < 40) return
    lastPlay = now

    const c = ensureCtx()
    if (!c) return
    const t = c.currentTime
    const dur = 0.22

    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1600, t)
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.08)
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.12)

    const filter = c.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2200, t)
    filter.Q.setValueAtTime(1.5, t)

    const gain = c.createGain()
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)

    osc.connect(filter).connect(gain).connect(c.destination)
    osc.start(t)
    osc.stop(t + dur)
  } catch {}
}

export function preloadClickSound() {
  try {
    ensureCtx()
  } catch {}
}
