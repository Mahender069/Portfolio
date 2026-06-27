import { useEffect, useRef, useCallback } from 'react'


const STACK = [
  { category: 'Languages',       items: ['Python', 'TypeScript', 'JavaScript', 'SQL'] },
  { category: 'Backend',         items: ['Node.js', 'Express', 'Prisma', 'REST APIs'] },
  { category: 'ML / AI',         items: ['LangChain', 'FAISS', 'OpenAI', 'RAG'] },
  { category: 'Infrastructure',  items: ['Docker', 'PostgreSQL', 'Redis', 'Railway'] },
  { category: 'Tools',           items: ['Git', 'Swagger', 'Postman', 'VS Code'] },
]

const MARQUEE_ITEMS = [
  'Python', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker',
  'LangChain', 'OpenAI', 'Redis', 'Prisma', 'Express',
  'FAISS', 'Railway', 'Git', 'REST APIs',
]


export default function About() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const rippleTimeoutsRef = useRef([])
  const rippleElementsRef = useRef([])

  const handleWordClick = useCallback((e) => {
    const el = e.currentTarget
    el.classList.add('word-flash')
    const timeoutId = setTimeout(() => el.classList.remove('word-flash'), 500)
    rippleTimeoutsRef.current.push(timeoutId)

    const ripple = document.createElement('span')
    ripple.className = 'word-ripple'
    const rect = el.getBoundingClientRect()
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top = `${e.clientY - rect.top}px`
    ripple.style.width = '40px'
    ripple.style.height = '40px'
    el.appendChild(ripple)
    rippleElementsRef.current.push(ripple)

    const cleanupRipple = () => ripple.remove()
    ripple.addEventListener('animationend', cleanupRipple)
    ripple._cleanup = cleanupRipple
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
          '.about__label',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.about', start: 'top 80%' } }
        )

        gsap.fromTo(
          '.about__headline-word',
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power4.out',
            scrollTrigger: { trigger: '.about__headline', start: 'top 75%' } }
        )

        gsap.fromTo(
          '.about__bio',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.about__bio', start: 'top 85%' } }
        )

        gsap.fromTo(
          '.about__stack-group',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: '.about__stack', start: 'top 85%' } }
        )

        gsap.fromTo(
          '.about__stack-item',
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.02, ease: 'power3.out',
            scrollTrigger: { trigger: '.about__stack', start: 'top 80%' } }
        )
      }, sectionRef)

      return () => ctx.revert()
    }

    init()

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    return () => {
      rippleTimeoutsRef.current.forEach(clearTimeout)
      rippleElementsRef.current.forEach((el) => {
        if (el && el._cleanup) el._cleanup()
        if (el && el.parentNode) el.parentNode.removeChild(el)
      })
      rippleTimeoutsRef.current = []
      rippleElementsRef.current = []
    }
  }, [])

  const headlineWords = ['Minimal', 'surface.', '', 'Deep', 'architecture.']

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about relative bg-bg-alt overflow-hidden"
    >
      <div className="min-h-screen flex flex-col justify-center py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-20 items-start">
            {/* Left: Headline + Bio */}
            <div className="flex flex-col gap-6">
              <span className="about__label section-label block font-body text-[0.55rem] font-semibold tracking-widest uppercase text-accent">
                About
              </span>

              <h2
                ref={headlineRef}
                className="about__headline font-serif font-light text-[clamp(2rem,4.5vw,4rem)] leading-[0.95] tracking-tight text-ink"
              >
                {headlineWords.map((word, i) =>
                  word === '' ? <br key={i} /> : (
                    <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.3em]">
                      <span className="about__headline-word inline-block cursor-default">
                        {i === 3 ? <em className="italic font-normal text-accent">{word}</em> : word}
                      </span>
                    </span>
                  )
                )}
              </h2>

              <p className="about__bio text-[clamp(0.85rem,1vw,1rem)] leading-relaxed text-ink-mid max-w-[48ch]">
                I'm{' '}
                <strong
                  className="about__word text-ink font-semibold cursor-pointer relative"
                  onClick={handleWordClick}
                >
                  Mahender
                </strong>{' '}
                — an AI & Backend Engineer working at the intersection of{' '}
                <strong
                  className="about__word text-ink font-semibold cursor-pointer relative"
                  onClick={handleWordClick}
                >
                  machine learning
                </strong>
                ,{' '}
                <strong
                  className="about__word text-ink font-semibold cursor-pointer relative"
                  onClick={handleWordClick}
                >
                  distributed systems
                </strong>
                , and{' '}
                <strong
                  className="about__word text-ink font-semibold cursor-pointer relative"
                  onClick={handleWordClick}
                >
                  production engineering
                </strong>.
              </p>
            </div>

            {/* Right: Tech Stack */}
            <div className="about__stack flex flex-col gap-5">
              {STACK.map((group) => (
                <div key={group.category} className="about__stack-group">
                  <h3 className="text-[0.5rem] font-semibold tracking-widest uppercase text-accent mb-2 flex items-center gap-2 cursor-default">
                    <span className="w-4 h-px bg-accent/40" />
                    {group.category}
                  </h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="about__stack-item text-[0.75rem] text-ink-mid px-3 py-1 rounded-sm border border-line cursor-default relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:text-ink hover:bg-accent/[0.06] hover:scale-105 hover:shadow-[0_2px_12px_rgba(139,92,246,0.15)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Marquee Strip */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item group" style={{ '--i': i }}>
              {item}
              <span className="marquee-dot group-hover:scale-150 group-hover:bg-accent transition-all duration-300" />
            </span>
          ))}
        </div>
      </div>
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track reverse">
          {[...MARQUEE_ITEMS.slice().reverse(), ...MARQUEE_ITEMS.slice().reverse()].map((item, i) => (
            <span key={i} className="marquee-item group" style={{ '--i': i }}>
              {item}
              <span className="marquee-dot group-hover:scale-150 group-hover:bg-accent transition-all duration-300" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}