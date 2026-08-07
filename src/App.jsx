import { useState, useEffect } from 'react'
import Dock from './components/Dock'
import CommandPalette from './components/CommandPalette'
import CustomCursor from './components/CustomCursor'
import MainLayout from './layouts/MainLayout'
import { playClickSound } from './utils/clickSound'
import Hero from './sections/Hero'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Footer from './sections/Footer'

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)

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
        playClickSound()
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <CustomCursor />
      <Dock onOpenPalette={() => setPaletteOpen(true)} />
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
