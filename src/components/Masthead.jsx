import { useEffect, useState } from 'react'

const NAV = [
  { label: 'Identity', href: '#hero'     },
  { label: 'About',    href: '#about'    },
  { label: 'Stack',    href: '#stack'    },
  { label: 'Work',     href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
]

export default function Masthead() {
  const [dateStr, setDateStr] = useState('')
  const [active, setActive]   = useState('hero')

  useEffect(() => {
    const now = new Date()
    setDateStr(now.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    }))
  }, [])

  useEffect(() => {
    const ids = NAV.map((n) => n.href.replace('#', ''))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { threshold: 0.4 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="masthead">
      <span className="masthead-name">Mahender</span>
      <nav className="masthead-links">
        {NAV.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={`masthead-link${active === href.replace('#', '') ? ' active' : ''}`}
            onClick={(e) => scrollTo(e, href)}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="masthead-right">
        <span className="masthead-date">{dateStr}</span>
      </div>
    </header>
  )
}