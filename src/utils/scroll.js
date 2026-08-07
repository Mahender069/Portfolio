let lenisInstance = null

export function setLenis(lenis) {
  lenisInstance = lenis
}

export function getLenis() {
  return lenisInstance
}

export function scrollToId(id, offset = 0) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
