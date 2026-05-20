const CONTACT_ITEMS = [
  { label: 'Email',    val: 'you@email.com',              href: 'mailto:you@email.com',             arr: '↗' },
  { label: 'GitHub',   val: 'github.com/Mahender069',     href: 'https://github.com/Mahender069/',  arr: '↗' },
  { label: 'LinkedIn', val: 'linkedin.com/in/mahender',   href: 'https://linkedin.com',             arr: '↗' },
  { label: 'Resume',   val: 'Download PDF',               href: '#',                                arr: '↓' },
]

export default function Contact() {
  return (
    <section id="contact" className="contact-section">

      {/* Left */}
      <div className="contact-left">
        <div>
          <span className="about-section-tag reveal">05 / Contact</span>
          <h2 className="contact-hed reveal d1" style={{ marginTop: '1.5rem' }}>
            Let's build<br />
            something<br />
            <em>precise.</em>
          </h2>
        </div>
        <p className="contact-note reveal d2">
          I'm open to freelance engagements, full-time roles, and
          interesting problems at the edge of AI and backend systems.
          Remote-friendly from India.
        </p>
      </div>

      {/* Right */}
      <div className="contact-right reveal d2">

        <div className="contact-avail-block">
          <span className="cab-label">Current status</span>
          <p className="cab-status">
            Available for new projects &amp;<br />
            <em>full-time opportunities.</em>
          </p>
          <div className="cab-dot-row">
            <span className="avail-dot" />
            Open to work
          </div>
        </div>

        <nav className="contact-list">
          {CONTACT_ITEMS.map(({ label, val, href, arr }) => (
            <a
              key={label}
              href={href}
              className="contact-item"
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
            >
              <span className="ci-label">{label}</span>
              <span className="ci-val">{val}</span>
              <span className="ci-arr">{arr}</span>
            </a>
          ))}
        </nav>

      </div>

    </section>
  )
}