import { useEffect, useRef } from 'react'

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    let destroyed = false

    async function setup() {
      const [lenisModule, gsapModule, scrollTriggerModule] = await Promise.all([
        import('@studio-freight/lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (destroyed) return

      const Lenis = lenisModule.default
      const { gsap } = gsapModule
      const { ScrollTrigger } = scrollTriggerModule

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      function raf(time) {
        if (destroyed) return
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    setup()

    return () => {
      destroyed = true
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return lenisRef
}