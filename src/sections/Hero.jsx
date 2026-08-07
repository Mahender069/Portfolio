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
    navigator.clipboard.writeText(profile.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <section id="hero" className="w-full">
      <div className="flex items-center gap-6 sm:gap-8">
        <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-neutral-100 font-display text-sm font-bold text-neutral-900 sm:h-[72px] sm:w-[72px] sm:text-base">
          {profile.initials}
        </div>
        <div>
          <h1 className="font-display text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-neutral-900 sm:text-[28px]">{profile.name}</h1>
          <p className="mt-1.5 font-mono text-[13px] font-medium text-neutral-500 sm:text-[13px]">{profile.subtitle}</p>
        </div>
      </div>

      <p className="mt-3 max-w-xl text-[13px] font-normal text-neutral-600">{profile.tagline}</p>

      <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-neutral-500 sm:gap-2.5 sm:text-[11px]">
        <span className={`h-1.5 w-1.5 rounded-full ${profile.status.online ? 'bg-emerald-400' : 'bg-neutral-400'}`} />
        <span>{profile.status.label}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-neutral-600 sm:mt-6 sm:gap-3 sm:text-[11px]">
        <a
          href={`mailto:${profile.email}`}
          className="text-neutral-700 hover:text-neutral-900 sm:text-[11px]"
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
            <FaCheck className="h-2.5 w-2.5 text-electric" />
          ) : (
            <FaCopy className="h-2.5 w-2.5 text-neutral-500" />
          )}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5 text-neutral-500 sm:mt-6 sm:gap-4">
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
              className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
            >
              <Icon className="h-[14px] w-[14px]" />
              <span className="font-mono text-[10px] uppercase sm:text-[10px]">{s.label}</span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
