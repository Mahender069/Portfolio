const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Mahender069/', arr: '↗', external: true  },
  { label: 'LinkedIn', href: 'https://linkedin.com',             arr: '↗', external: true  },
  { label: 'Email',    href: 'mailto:you@email.com',             arr: '↗', external: false },
  { label: 'Resume',   href: '#',                                arr: '↓', external: false },
]

export default function Hero() {
  return (
    <section id="hero" className="hero-grid">

      {/* A — big headline, spans full width */}
      <div className="hg-cell hg-a">
        <p className="hg-a-label reveal d1">AI &amp; Backend Engineer</p>
        <h1 className="hg-hed reveal d2">
          Building<br />
          <em>intelligent</em><br />
          systems.
        </h1>
      </div>

      {/* C — status */}
      <div className="hg-cell hg-c reveal d3">
        <div className="hg-avail">
          <span className="avail-dot" />
          Open to work
        </div>
        <span className="hg-loc">India · Remote-friendly</span>
      </div>

      {/* D — bio */}
      <div className="hg-cell hg-d reveal d3">
        <p className="hg-bio">
          I'm <strong>Mahender</strong> — an AI &amp; Backend Engineer working at the
          intersection of <strong>machine learning</strong>,{' '}
          <strong>distributed systems</strong>, and{' '}
          <strong>production engineering</strong>. Every system starts with
          clarity. Every decision ends with precision.
        </p>
      </div>

      {/* E — links */}
      <div className="hg-cell hg-e reveal d4">
        <nav className="hg-links">
          {LINKS.map(({ label, href, arr, external }) => (
            <a
              key={label}
              href={href}
              className="hg-link"
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="hg-link-label">{label}</span>
              <span className="hg-link-arr">{arr}</span>
            </a>
          ))}
        </nav>
      </div>

    </section>
  )
}