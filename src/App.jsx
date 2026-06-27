// App.jsx — full fixed file (Navigation removed)

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLenis } from './hooks/useLenis'
import Cursor from './components/Cursor'
import { scrollProgressCallback } from './components/scrollProgressCallback'
import Preloader from './components/Preloader'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import './App.css'

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const lenisRef = useLenis()
  const initedRef = useRef(false)
  const progressRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)
  const orbMouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    orbMouse.current.x = e.clientX
    orbMouse.current.y = e.clientY
  }, [])

  const handlePreloaderDone = useCallback(() => {
    setPreloaderDone(true)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Cached orb rects + scrollY to avoid layout thrash
  const orbRectsRef = useRef([])
  const scrollYRef = useRef(0)

  // Update orb rects on resize
  useEffect(() => {
    const updateRects = () => {
      orbRectsRef.current = [
        orb1Ref.current?.getBoundingClientRect(),
        orb2Ref.current?.getBoundingClientRect(),
        orb3Ref.current?.getBoundingClientRect(),
      ].filter(Boolean)
    }
    updateRects()
    const ro = new ResizeObserver(updateRects)
    ;[orb1Ref.current, orb2Ref.current, orb3Ref.current].forEach(el => el && ro.observe(el))
    return () => ro.disconnect()
  }, [])

  // Track scrollY without forcing layout on every frame
  useEffect(() => {
    const onScroll = () => { scrollYRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ambient orb repulsion
  useEffect(() => {
    if (!preloaderDone) return
    let raf
    const orbBase = [
      { el: orb1Ref, strength: 0.03, index: 0 },
      { el: orb2Ref, strength: 0.025, index: 1 },
      { el: orb3Ref, strength: 0.02, index: 2 },
    ]
    const loop = () => {
      const mx = orbMouse.current.x
      const my = orbMouse.current.y
      const scrollY = scrollYRef.current
      orbBase.forEach(({ el, strength, index }) => {
        if (!el.current) return
        const rect = orbRectsRef.current[index]
        if (!rect) return
        const ocx = rect.left + rect.width / 2
        const ocy = rect.top + rect.height / 2
        const dx = mx - ocx
        const dy = my - ocy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 400
        const parallaxOffset = scrollY * 0.02
        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * strength
          el.current.style.transform = `translate(${-(dx / dist) * force * 100}px, ${-(dy / dist) * force * 100 + parallaxOffset}px)`
        } else {
          el.current.style.transform = `translateY(${parallaxOffset}px)`
        }
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [preloaderDone])

// Scroll progress + reveal triggers
  useEffect(() => {
    if (!preloaderDone) return
    let refreshTimer

    async function init() {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { gsap } = await import('gsap')
      gsap.registerPlugin(ScrollTrigger)

      // Single ScrollTrigger for both top bar and cursor ring
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress
          // Top progress bar
          if (progressRef.current) {
            progressRef.current.style.setProperty('--scroll-progress', progress)
          }
          // Cursor progress ring
          if (scrollProgressCallback.current) {
            scrollProgressCallback.current(progress)
          }
        },
      })

      document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-rotate').forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 88%', once: true,
          onEnter: () => el.classList.add('revealed'),
        })
      })

      document.querySelectorAll('.section-line').forEach((line) => {
        ScrollTrigger.create({
          trigger: line, start: 'top 90%', once: true,
          onEnter: () => line.classList.add('revealed'),
        })
      })

      refreshTimer = setTimeout(() => {
        lenisRef.current?.resize()
        ScrollTrigger.refresh(true)
      }, 100)
    }

    init()

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer)
      }
    }
  }, [preloaderDone, lenisRef])

  useEffect(() => {
    if (!preloaderDone || initedRef.current) return
    initedRef.current = true
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [preloaderDone, lenisRef])

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Cursor />

      {preloaderDone && (
        <>
          <div ref={orb1Ref} className="ambient-orb ambient-orb--1" aria-hidden="true" />
          <div ref={orb2Ref} className="ambient-orb ambient-orb--2" aria-hidden="true" />
          <div ref={orb3Ref} className="ambient-orb ambient-orb--3" aria-hidden="true" />
        </>
      )}

      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />

        <main>
          <Hero ready={preloaderDone} />
          <div className="section-line" aria-hidden="true" />
          <About />
          <div className="section-line" aria-hidden="true" />
          <Projects />
          <div className="section-line" aria-hidden="true" />
          <Contact lenisRef={lenisRef} />
        </main>

      {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
    </>
  )
}