import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'
import Dock from './components/Dock'
import CommandPalette from './components/CommandPalette'
import CustomCursor from './components/CustomCursor'
import MainLayout from './layouts/MainLayout'
import { playWaterDrop } from './utils/clickSound'
import Hero from './sections/Hero'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Footer from './sections/Footer'

const THEME_COLOR = { dark: '#101010', light: '#F5F7FA' }

function getInitialAscii() {
  if (typeof window === 'undefined') return true
  try {
    return localStorage.getItem('ascii-hero') !== 'off'
  } catch {
    return true
  }
}

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
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [theme, setThemeState] = useState(getInitialTheme)
  const [asciiEnabled, setAsciiEnabled] = useState(getInitialAscii)

  useEffect(() => {
    syncTheme(theme)
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('ascii-hero', asciiEnabled ? 'on' : 'off')
    } catch {}
  }, [asciiEnabled])

  const toggleAscii = useCallback(() => {
    setAsciiEnabled((value) => !value)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
      const useTransition = document.startViewTransition && !reduce

      if (!useTransition) {
        root.classList.add('theme-vt')
        flushSync(() => setThemeState(next))
        syncTheme(next)
        requestAnimationFrame(() => root.classList.remove('theme-vt'))
        return
      }

      let x = window.innerWidth / 2
      let y = window.innerHeight / 2
      if (event && (event.detail > 0 || event.clientX || event.clientY)) {
        x = event.clientX
        y = event.clientY
      } else if (event?.currentTarget?.getBoundingClientRect) {
        const rect = event.currentTarget.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
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
      <Dock onOpenPalette={() => setPaletteOpen(true)} onToggleTheme={toggleTheme} theme={theme} />
      <MainLayout>
        <main className="flex-1 w-full flex flex-col gap-12">
          <Hero asciiEnabled={asciiEnabled} />
          <Experience />
          <Projects />
          <Skills />
        </main>
        <Footer />
      </MainLayout>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        asciiEnabled={asciiEnabled}
        onToggleAscii={toggleAscii}
        onToggleTheme={toggleTheme}
      />
    </>
  )
}
