import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'
import Dock from './components/Dock'
import CustomCursor from './components/CustomCursor'
import MainLayout from './layouts/MainLayout'
import { playWaterDrop } from './utils/clickSound'
import Hero from './sections/Hero'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Footer from './sections/Footer'

const THEME_COLOR = { dark: '#101010', light: '#F5F7FA' }

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function syncTheme(theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  try {
    localStorage.setItem('theme', theme)
  } catch {}
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLOR[theme])
}

export default function App() {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    syncTheme(theme)
  }, [theme])

  useEffect(() => {
    const handleVisibilityChange = () => {
      document.title =
        document.visibilityState === 'hidden' ? "I'm waiting for you..." : 'Mahender'
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    handleVisibilityChange()
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (e.target && e.target.closest('a, button, [role="button"], input, select, textarea')) {
        playWaterDrop()
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const toggleTheme = useCallback(
    (event) => {
      const next = theme === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const rect = event?.currentTarget?.getBoundingClientRect?.()
      const fromPointer = Boolean(event && (event.detail > 0 || event.clientX || event.clientY))
      const x = fromPointer ? event.clientX : rect ? rect.left + rect.width / 2 : null
      const y = fromPointer ? event.clientY : rect ? rect.top + rect.height / 2 : null
      const useTransition = document.startViewTransition && !reduce && x !== null

      if (!useTransition) {
        root.classList.add('theme-vt')
        flushSync(() => setThemeState(next))
        syncTheme(next)
        requestAnimationFrame(() => root.classList.remove('theme-vt'))
        return
      }

      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      root.style.setProperty('--vt-x', `${x}px`)
      root.style.setProperty('--vt-y', `${y}px`)
      root.style.setProperty('--vt-r', `${radius}px`)
      root.classList.add('theme-vt')

      const transition = document.startViewTransition(() => {
        flushSync(() => setThemeState(next))
        syncTheme(next)
      })

      transition.finished.finally(() => {
        root.classList.remove('theme-vt')
        root.style.removeProperty('--vt-x')
        root.style.removeProperty('--vt-y')
        root.style.removeProperty('--vt-r')
      })
    },
    [theme]
  )

  return (
    <>
      <CustomCursor />
      <Dock onToggleTheme={toggleTheme} theme={theme} />
      <MainLayout>
        <main className="flex-1 w-full flex flex-col gap-12">
          <Hero />
          <Experience />
          <Projects />
          <Skills />
        </main>
        <Footer />
      </MainLayout>
    </>
  )
}
