import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineCommandLine, HiOutlineXMark } from 'react-icons/hi2'
import { profile } from '../constants/portfolio'
import { scrollToId } from '../utils/scroll'

export default function Dock({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(profile.navigation[0].id)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = profile.navigation.map((n) => n.id)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

 const itemClass = (id) =>
      `font-mono text-[11px] font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900 ${
        active === id ? 'text-neutral-900' : ''
      }`

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed inset-x-0 top-0 z-[100]"
    >
      <div
        className={`mx-auto flex w-full max-w-[800px] items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 transition-all duration-300 ${
          scrolled
            ? 'border-b border-neutral-200/60 bg-white/70 shadow-sm backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
          className="rounded-full border border-neutral-200 bg-neutral-50 p-1.5 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-100 md:hidden"
        >
          {open ? (
            <HiOutlineXMark className="h-4 w-4" />
          ) : (
            <HiOutlineCommandLine className="h-4 w-4 text-electric" />
          )}
        </button>

        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex" aria-label="Primary">
          {profile.navigation.map((item) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => scrollToId(item.id)}
              className={itemClass(item.id)}
              aria-label={`Go to ${item.label}`}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          onClick={onOpenPalette}
           className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 font-mono text-[10px] text-neutral-500 hover:border-neutral-300 hover:bg-neutral-100 sm:px-2.5 sm:py-1.5 sm:text-[11px]"
          aria-label="Open command palette"
        >
          <HiOutlineCommandLine className="h-3.5 w-3.5 text-electric" />
          <span>⌘K</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="flex flex-col items-center gap-4"
              aria-label="Mobile menu"
            >
              {profile.navigation.map((item) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => {
                    scrollToId(item.id)
                    setOpen(false)
                  }}
                  className={`font-mono text-base uppercase tracking-widest transition-colors ${
                    active === item.id
                      ? 'text-neutral-900'
                      : 'text-neutral-400 hover:text-neutral-800'
                  }`}
                  aria-label={`Go to ${item.label}`}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}