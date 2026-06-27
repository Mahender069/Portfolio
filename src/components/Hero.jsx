import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextPressure from './TextPressure'

gsap.registerPlugin(ScrollTrigger)

const TAGLINE = 'I architect intelligent systems that learn, adapt, and scale.'
const BIO = 'Building at the intersection of intelligence and infrastructure — where models meet production.'
const FOCUS = ['Backend Engineering', 'AI / ML Systems', 'API Design & Infrastructure']

export default function Hero({ ready }) {
  const heroRef = useRef(null)

  useEffect(() => {
    if (!ready) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })

      tl.fromTo('.hero__label',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
      )

      tl.fromTo('.hero__name',
        { opacity: 0, yPercent: 100 },
        { opacity: 1, yPercent: 0, duration: 0.9, ease: 'power4.out' },
        '-=0.3'
      )

      tl.fromTo('.hero__tagline',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )

      tl.fromTo('.hero__bio',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )

      tl.fromTo('.hero__focus',
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
        '-=0.3'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [ready])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative bg-bg overflow-hidden min-h-screen flex items-center"
    >
      <div className="w-full py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-start">

            <div className="flex flex-col gap-6">
              <span className="hero__label section-label block font-body text-[0.55rem] font-semibold tracking-widest uppercase text-accent">
                Identity
              </span>

              <TextPressure
                className="hero__name"
                text="MAHENDER"
              />

              <p className="hero__tagline font-body text-[clamp(0.85rem,1vw,1rem)] leading-relaxed text-ink-mid max-w-[42ch] cursor-default">
                {TAGLINE}
              </p>

              <p className="hero__bio font-body text-[0.75rem] leading-relaxed text-ink-light/60 max-w-[38ch] cursor-default">
                {BIO}
              </p>
            </div>

            <div className="flex flex-col gap-5 md:pt-16">
              <h3 className="text-[0.5rem] font-semibold tracking-widest uppercase text-accent mb-1 flex items-center gap-2">
                <span className="w-4 h-px bg-accent/40" />
                Focus Areas
              </h3>
              {FOCUS.map((item, i) => (
                <div
                  key={i}
                  className="hero__focus group flex items-center gap-3 py-3 border-b border-line cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent group-hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300 group-hover:scale-125" />
                  <span className="font-display font-medium text-[clamp(0.85rem,1.1vw,1.05rem)] text-ink-light tracking-tight group-hover:text-accent transition-all duration-300 group-hover:tracking-wide">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}