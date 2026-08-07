import { useEffect, useMemo, useRef, useState } from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaArrowDown,
  FaEnvelope,
  FaGithub,
  FaLinkedinIn,
} from 'react-icons/fa6'
import {
  HiOutlineArrowRight,
  HiOutlineArrowUp,
  HiOutlineCodeBracket,
  HiOutlineEnvelope,
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
} from 'react-icons/hi2'
import { profile } from '../constants/portfolio'
import { scrollToId, scrollToTop } from '../utils/scroll'
import { cn } from '../utils/cn'

const SECTION_ICONS = {
  about: HiOutlineUser,
  skills: HiOutlineCodeBracket,
  work: HiOutlineCodeBracket,
  contact: HiOutlineEnvelope,
}

export default function CommandPalette({ open, onOpenChange }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setIndex(0)
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  const items = useMemo(
    () => [
      ...profile.navigation.map((n) => ({
        id: `go-${n.id}`,
        label: `Go to ${n.label}`,
        hint: 'Jump',
        Icon: SECTION_ICONS[n.id] || HiOutlineArrowRight,
        run: () => {
          scrollToId(n.id)
          onOpenChange(false)
        },
      })),
      { id: 'github', label: 'Open GitHub', hint: 'G', Icon: FaGithub, run: () => window.open(profile.github, '_blank') },
      { id: 'linkedin', label: 'Open LinkedIn', hint: 'L', Icon: FaLinkedinIn, run: () => window.open(profile.linkedin, '_blank') },
      { id: 'email', label: `Email ${profile.email}`, hint: 'M', Icon: FaEnvelope, run: () => window.open(`mailto:${profile.email}`) },
      { id: 'X', label: `Open X`, hint: 'X', Icon: FaXTwitter, run: () => window.open(`https://x.com/Mahender_36`) },
      { id: 'resume', label: 'Download resume', hint: 'PDF', Icon: FaArrowDown, run: () => { window.open(profile.resumeUrl, '_blank'); onOpenChange(false) } },
      { id: 'top', label: 'Back to top', hint: 'Top', Icon: HiOutlineArrowUp, run: () => scrollToTop() },
    ],
    [onOpenChange]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q))
  }, [items, query])

  const run = (item) => item.run()

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[index]) run(filtered[index])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] bg-black/70 p-4 backdrop-blur-md md:p-10"
          onClick={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-4">
              <HiOutlineMagnifyingGlass className="h-5 w-5 text-neutral-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIndex(0)
                }}
                onKeyDown={onKeyDown}
                placeholder="Type a command or section…"
                className="flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                aria-label="Search commands"
              />
               <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">ESC to close</span>
            </div>

            <ul className="max-h-[50vh] overflow-y-auto p-2.5" role="listbox">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-neutral-400">
                  No commands match “{query}”
                </li>
              )}
              {filtered.map((item, i) => (
                <li key={item.id}>
                  <button
                    role="option"
                    aria-selected={i === index}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(item)}
                    className={cn(
                      'flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-left transition-colors duration-150',
                      i === index ? 'text-neutral-900' : 'text-neutral-500'
                    )}
                  >
                    <item.Icon className="h-4.5 w-4.5 text-electric" />
                    <span className="flex-1 text-sm">{item.label}</span>
                     <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">{item.hint}</span>
                  </button>
                </li>
              ))}
            </ul>

             <div className="flex items-center gap-4 border-t border-neutral-200 px-5 py-3 font-mono text-[11px] text-neutral-400">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
