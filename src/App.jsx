import { useState, useEffect } from 'react'
import { useLenis }  from './hooks/useLenis'
import Cursor    from './components/Cursor'
import Preloader from './components/Preloader'
import Masthead  from './components/Masthead'
import Hero      from './components/Hero'
import About     from './components/About'
import Stack     from './components/Stack'
import Projects  from './components/Projects'
import Contact   from './components/Contact'
import Footer    from './components/Footer'
import './App.css'

export default function App() {
  const [ready, setReady] = useState(false)

  useLenis()

  // Wire up reveal AFTER preloader finishes and DOM is painted
  useEffect(() => {
    if (!ready) return

    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal')

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08 }
      )

      els.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }, 100) // small delay lets DOM settle

    return () => clearTimeout(timer)
  }, [ready])

  return (
    <>
      <Cursor />
      {!ready && <Preloader onDone={() => setReady(true)} />}
      {ready && (
        <>
          <div className="site">
            <main className="main">
              <Masthead />
              <Hero />
              <About />
              <Stack />
              <Projects />
              <Contact />
              <Footer />
            </main>
          </div>
        </>
      )}
    </>
  )
}