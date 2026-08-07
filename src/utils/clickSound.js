let ctx = null

function ensureCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playClickSound() {
  try {
    const c = ensureCtx()
    if (!c) return
    const t = c.currentTime
    const duration = 0.018
    const buf = c.createBuffer(1, c.sampleRate * duration, c.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.2)
    }
    const noise = c.createBufferSource()
    noise.buffer = buf
    const hp = c.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.setValueAtTime(1200, t)
    const gain = c.createGain()
    gain.gain.setValueAtTime(0.06, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    noise.connect(hp).connect(gain).connect(c.destination)
    noise.start(t)
    noise.stop(t + duration)
  } catch {}
}

export function preloadClickSound() {
  try {
    ensureCtx()
  } catch {}
}
