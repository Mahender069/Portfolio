import { useEffect, useCallback, useRef, useState, memo } from 'react'
import { AtSign, Globe, ArrowUpRight, MapPin, Check } from 'lucide-react'
// Contact.jsx — CONTACTS array
const CONTACTS = [
  { icon: AtSign,      label: 'Email',    value: 'tnmahender@gmail.com',  href: 'mailto:tnmahender@gmail.com' },
  { icon: Globe,       label: 'GitHub',   value: '@Mahender069',          href: 'https://github.com/Mahender069' },
  { icon: ArrowUpRight,label: 'LinkedIn', value: 'in/mahender',           href: 'https://www.linkedin.com/in/t-n-mahender-8b8482309/' },
  { icon: MapPin,      label: 'Location', value: 'Hyderabad, India',      href: null },
]


function InputField({ label, type, value, onChange, onKeyDown, disabled, className = '' }) {
  return (
    <div className={`contact__field relative ${className}`}>
      <input
        className={`peer input-glow w-full p-3.5 bg-card border border-line text-ink text-[0.8rem] outline-none rounded-sm transition-all duration-300 focus:border-accent`}
        type={type}
        placeholder=" "
        required
        onKeyDown={onKeyDown}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="absolute top-3.5 left-3.5 text-[0.7rem] font-medium text-ink-light pointer-events-none transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-[-0.5rem] peer-[:not(:placeholder-shown)]:left-[0.6rem] peer-[:not(:placeholder-shown)]:text-[0.5rem] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-accent peer-[:not(:placeholder-shown)]:bg-bg peer-[:not(:placeholder-shown)]:px-1 peer-focus:top-[-0.5rem] peer-focus:left-[0.6rem] peer-focus:text-[0.5rem] peer-focus:font-semibold peer-focus:text-accent peer-focus:bg-bg peer-focus:px-1">
        {label}
      </label>
      <div className="focus-line" />
    </div>
  )
}

const MemoizedInputField = memo(InputField)


function TextareaField({ label, value, onChange, onKeyDown, disabled, className = '' }) {
  return (
    <div className={`contact__field relative ${className}`}>
      <textarea
        className={`peer input-glow w-full p-3.5 bg-card border border-line text-ink text-[0.8rem] outline-none rounded-sm transition-all duration-300 focus:border-accent min-h-[120px] resize-y`}
        placeholder=" "
        required
        onKeyDown={onKeyDown}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="absolute top-3.5 left-3.5 text-[0.7rem] font-medium text-ink-light pointer-events-none transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[0.7rem] peer-[:not(:placeholder-shown)]:top-[-0.5rem] peer-[:not(:placeholder-shown)]:left-[0.6rem] peer-[:not(:placeholder-shown)]:text-[0.5rem] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-accent peer-[:not(:placeholder-shown)]:bg-bg peer-[:not(:placeholder-shown)]:px-1 peer-focus:top-[-0.5rem] peer-focus:left-[0.6rem] peer-focus:text-[0.5rem] peer-focus:font-semibold peer-focus:text-accent peer-focus:bg-bg peer-focus:px-1">
        {label}
      </label>
      <div className="focus-line" />
    </div>
  )
}

const MemoizedTextareaField = memo(TextareaField)


export default function Contact({ lenisRef }) {
  const btnRef = useRef(null)
  const btnRectRef = useRef(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const submitTimeoutRef = useRef(null)

  const handleBtnMouseMove = useCallback((e) => {
    const btn = btnRef.current
    if (!btn || !btnRectRef.current) return
    const rect = btnRectRef.current
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.03)`

    const trailX = ((e.clientX - rect.left) / rect.width) * 100
    const trailY = ((e.clientY - rect.top) / rect.height) * 100
    btn.style.setProperty('--trail-x', `${trailX}%`)
    btn.style.setProperty('--trail-y', `${trailY}%`)
  }, [])

  const handleBtnMouseEnter = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    btnRectRef.current = btn.getBoundingClientRect()
  }, [])

  const handleBtnMouseLeave = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    btn.style.transform = ''
    btnRectRef.current = null
  }, [])

  const handleBtnClick = useCallback((e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'btn-ripple'
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top = `${e.clientY - rect.top}px`
    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
  }, [])

  const handleInfoClick = useCallback((e) => {
    const item = e.currentTarget
    const icon = item.querySelector('.info-icon')
    if (icon) {
      icon.classList.add('icon-ripple')
      setTimeout(() => icon.classList.remove('icon-ripple'), 500)
    }
  }, [])

  const handleInputKeyDown = useCallback((_e) => {
    // Typing particles removed for performance
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (cancelled) return

      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.contact__left',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact', start: 'top 75%' } }
        )

        gsap.fromTo(
          '.contact__info-item',
          { opacity: 0, x: -25 },
          { opacity: 1, x: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact__info', start: 'top 85%' } }
        )

        gsap.fromTo(
          '.contact__field, .contact__submit',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact__form', start: 'top 85%' } }
        )
      }, sectionRef)

      return () => ctx.revert()
    }

    init()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current)
    }
    submitTimeoutRef.current = setTimeout(() => {
      setSubmitted(false)
      submitTimeoutRef.current = null
    }, 3000)
  }

  const handleScrollTop = useCallback(() => {
    lenisRef?.current?.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  }, [lenisRef])

  const year = new Date().getFullYear()
  const sectionRef = useRef(null)

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
        submitTimeoutRef.current = null
      }
    }
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact relative bg-bg overflow-hidden"
    >
      <div className="min-h-screen flex items-center py-24 md:py-32">
        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-start">
          <div className="contact__left flex flex-col gap-4 md:gap-6">
            <span className="font-body text-[0.55rem] font-semibold tracking-widest uppercase text-accent section-label">
              Contact
            </span>
            <h2 className="contact__heading font-serif font-light text-[clamp(2.2rem,5vw,4.5rem)] tracking-tight leading-[0.92] text-ink">
              Let's build<br />
              something <em className="italic font-normal text-shimmer">precise.</em>
            </h2>
            <p className="contact__desc text-[0.85rem] leading-relaxed text-ink-mid max-w-[42ch]">
              Open to freelance engagements, full-time roles, and interesting
              problems at the edge of AI and backend systems.
            </p>

            <div className="contact__info flex flex-col gap-2 mt-2">
              {CONTACTS.map((item) => {
                const Icon = item.icon
                const content = (
                  <div
                    className="contact__info-item hover-lift relative flex items-center gap-3 py-2.5 border-b border-line transition-all duration-300 hover:border-accent/40 hover:pl-2 cursor-pointer group"
                    onClick={handleInfoClick}
                  >
                    <div className="info-icon w-8 h-8 rounded-full flex items-center justify-center text-ink-light border border-line flex-shrink-0 transition-all duration-300 group-hover:bg-accent/[0.12] group-hover:border-accent/40 group-hover:text-accent group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                      <Icon size={14} />
                    </div>
                    <div>
                      <div className="text-[0.5rem] font-semibold tracking-wider uppercase text-ink-light mb-0.5">
                        {item.label}
                      </div>
                      <div className="font-display font-medium text-[0.85rem] tracking-tight text-ink group-hover:text-accent-bright transition-all duration-300 group-hover:tracking-wide">
                        {item.value}
                      </div>
                    </div>
                  </div>
                )
                return item.href ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="no-underline">
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                )
              })}
            </div>
          </div>

          <div>
            <form className="contact__form flex flex-col gap-4" onSubmit={handleSubmit}>
              <MemoizedInputField
                label="Your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={submitted}
              />
              <MemoizedInputField
                label="Your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={submitted}
              />
              <MemoizedTextareaField
                label="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={submitted}
              />
              <button
                ref={btnRef}
                type="submit"
                className={`magnetic-btn btn-gradient contact__submit relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 text-bg text-[0.75rem] font-semibold rounded-sm transition-all duration-300 self-start active:scale-[0.97] ${submitted ? 'btn-success' : ''}`}
                onMouseMove={submitted ? undefined : handleBtnMouseMove}
                onMouseEnter={submitted ? undefined : handleBtnMouseEnter}
                onMouseLeave={submitted ? undefined : handleBtnMouseLeave}
                onClick={submitted ? undefined : handleBtnClick}
                disabled={submitted}
              >
                <span className="btn-gradient-trail" />
                <span className="relative z-10 flex items-center gap-2 btn-arrow-bounce">
                  {submitted ? <>Sent! <Check size={13} /></> : <>Send message <ArrowUpRight size={13} className="arrow-icon" /></>}
                </span>
              </button>
            </form>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-3 pt-8 mt-6 border-t border-line">
            <span className="footer-brand font-display font-semibold text-[0.85rem] tracking-tight text-ink text-shimmer" onClick={handleScrollTop} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleScrollTop()}>Mahender</span>
            <span className="text-[0.55rem] font-medium text-ink-light">&copy; {year} — All rights reserved</span>
            <div className="flex gap-4">
              {[
                { label: 'GitHub', href: 'https://github.com/Mahender069' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/t-n-mahender-8b8482309/' },
                { label: 'Email', href: 'mailto:tnmahender@email.com' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noreferrer'}
                  className="footer-link social-magnetic text-[0.6rem] font-medium text-ink-mid transition-colors duration-300 hover:text-accent-bright"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}