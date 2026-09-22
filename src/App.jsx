import { useState, useEffect, useCallback } from 'react'
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

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#101010' : '#F5F7FA')
    }
  }, [theme])

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
    const onClick = (e) => {
      if (e.target && e.target.closest('a, button, [role="button"], input, select, textarea')) {
        playWaterDrop()
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <>
      <CustomCursor />
      <Dock onOpenPalette={() => setPaletteOpen(true)} onToggleTheme={toggleTheme} theme={theme} />
      <MainLayout>
        <main className="flex-1 w-full flex flex-col gap-12">
          <Hero />
          <Experience />
          <Projects />
          <Skills />
        </main>
        <Footer />
      </MainLayout>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  )
}
