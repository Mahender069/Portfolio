import { useState } from 'react'
import { FaCheck, FaCopy, FaGithub, FaLinkedinIn, FaRegEnvelope } from 'react-icons/fa6'
import { FaXTwitter } from 'react-icons/fa6'
import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { profile } from '../constants/portfolio'

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  Email: FaRegEnvelope,
  X:FaXTwitter,
  Resume: HiOutlineArrowUpRight,
}

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.email).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      })
    } else {
      const ta = document.createElement('textarea')
      ta.value = profile.email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <section id="hero" className="w-full">
      <img
        src="/anime.jpg"
        alt="Street scene with utility poles, traffic lights, and clouds against a blue sky"
        width={2048}
        height={1366}
        loading="eager"
        decoding="async"
        draggable={false}
        className="mb-12 block aspect-[16/9] w-full select-none object-cover object-[center_40%] grayscale transition-[filter] duration-[400ms] ease-[ease] hover:grayscale-0 motion-reduce:transition-none [@media(hover:none)]:grayscale-0 md:aspect-[21/9]"
      />

      <div className="flex items-center gap-6 sm:gap-8">
        <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-neutral-100 font-sans text-sm font-bold text-neutral-900 sm:h-[72px] sm:w-[72px] sm:text-base">
          {profile.initials}
        </div>
        <div>
          <h1 className="font-sans text-[22px] font-bold leading-[1.2] text-neutral-900 sm:text-title">{profile.name}</h1>
          <p className="mt-1.5 font-mono text-meta font-medium text-metadata">{profile.subtitle}</p>
        </div>
      </div>

      <p className="mt-3 max-w-xl font-sans text-body font-normal text-neutral-600">{profile.tagline}</p>

      <div className="mt-3 flex items-center gap-2 font-mono text-meta text-metadata sm:gap-2.5">
        <span className={`h-1.5 w-1.5 rounded-full ${profile.status.online ? 'bg-neutral-500' : 'bg-neutral-600'}`} />
        <span>{profile.status.label}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-body text-neutral-600 sm:mt-6 sm:gap-3">
        <a
          href={`mailto:${profile.email}`}
          className="font-sans text-body text-neutral-700 hover:text-neutral-900"
          aria-label={profile.email}
        >
          {profile.email}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Copy email"
        >
          {copied ? (
            <FaCheck className="h-2.5 w-2.5 text-[var(--accent)]" />
          ) : (
            <FaCopy className="h-2.5 w-2.5 text-neutral-500" />
          )}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5 text-metadata sm:mt-6 sm:gap-4">
        {profile.social.map((s) => {
          const Icon = SOCIAL_ICONS[s.label]
          if (!Icon) return null
          const isExternal = s.href.startsWith('http')
          return (
            <a
              key={s.label}
              href={s.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
              aria-label={s.label}
              className="flex items-center gap-1 text-metadata hover:text-neutral-900 transition-colors duration-200"
            >
              <Icon className="h-[14px] w-[14px]" />
              <span className="font-mono text-meta uppercase">{s.label}</span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
