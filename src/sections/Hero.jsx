import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaCopy, FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { FaXTwitter } from 'react-icons/fa6'
import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { profile } from '../constants/portfolio'

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
  Resume: HiOutlineArrowUpRight,
}

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const copyTimer = useRef(null)

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    },
    []
  )

  const showCopied = () => {
    setCopied(true)
    if (copyTimer.current) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 1500)
  }

  const copyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.email).then(showCopied)
    } else {
      const ta = document.createElement('textarea')
      ta.value = profile.email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      showCopied()
    }
  }

  return (
    <section id="home" aria-labelledby="home-heading" className="w-full pt-6">
      <header>
        <div className="relative">
          <div className="relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)]">
            <img
              src="/anime.jpg"
              alt="Street scene with utility poles, traffic lights, and clouds against a blue sky"
              width={2048}
              height={1366}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="block aspect-[7/3] w-full select-none rounded-[14px] object-cover object-[right_center] transition-[filter] duration-[400ms] ease-[ease] motion-reduce:transition-none"
              style={{ filter: 'var(--banner-filter)' }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: 'var(--banner-shade)' }}
            />
          </div>

        </div>

        <div className="mt-4 flex min-h-[88px] items-center gap-4">
          <div
            className="z-10 box-border grid h-[88px] w-[88px] shrink-0 place-items-center overflow-hidden rounded-full border-4 border-[var(--background)] bg-neutral-100 font-sans text-sm font-bold text-neutral-900 sm:text-base"
            style={{
              boxShadow: '0 0 0 1px var(--avatar-ring)',
            }}
          >
            {profile.image && !imageFailed ? (
              <img
                src={profile.image}
                alt={profile.name}
                width={88}
                height={88}
                loading="eager"
                decoding="async"
                onError={() => setImageFailed(true)}
                draggable={false}
                className="h-full w-full select-none rounded-full object-cover"
                style={{ filter: 'var(--avatar-filter)' }}
              />
            ) : (
              profile.initials
            )}
          </div>
          <div className="min-w-0">
            <h1
              id="home-heading"
              className="font-sans text-[22px] font-bold leading-[1.1] text-neutral-900 sm:text-title"
            >
              {profile.name}
            </h1>
            <p className="mt-1 font-mono text-meta font-medium text-metadata">{profile.subtitle}</p>
          </div>
        </div>
      </header>

      <p className="mt-4 max-w-xl font-sans text-body font-normal text-[var(--foreground-secondary)]">
        {profile.tagline}
      </p>

      <div className="mt-3 flex items-center gap-2 font-mono text-meta text-metadata sm:gap-2.5">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${
            profile.status.online ? 'animate-status-pulse bg-[var(--online)]' : 'bg-neutral-600'
          }`}
        />
        <span>{profile.status.label}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={`mailto:${profile.email}`}
          className="font-sans text-body text-[var(--foreground-secondary)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          aria-label={profile.email}
        >
          {profile.email}
        </a>
        <div className="relative">
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--foreground)]"
            aria-label={copied ? 'Email copied' : 'Copy email'}
          >
            {copied ? (
              <FaCheck className="h-2.5 w-2.5 text-[var(--online)]" />
            ) : (
              <FaCopy className="h-2.5 w-2.5" />
            )}
          </button>
          <span
            role="status"
            aria-live="polite"
            className={`pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-secondary)] shadow-sm transition-all duration-150 ${
              copied ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'
            }`}
          >
            {copied ? 'Copied' : ''}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {profile.social
          .filter((item) => item.label !== 'Email')
          .map((s, index) => {
            const Icon = SOCIAL_ICONS[s.label]
            if (!Icon) return null
            const isExternal = s.href.startsWith('http')
            const isResume = s.label === 'Resume'

            return (
              <a
                key={s.label}
                href={s.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                aria-label={s.label}
                className={
                  isResume
                    ? 'inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-wide text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--hover)]'
                    : `inline-flex items-center gap-1.5 rounded-md py-1 font-mono text-[12px] uppercase tracking-wide text-[var(--foreground)] opacity-80 transition-all duration-200 hover:bg-[var(--hover)] hover:text-[var(--foreground)] hover:opacity-100 ${
                        index === 0 ? 'pl-0 pr-2' : 'px-2'
                      }`
                }
              >
                {!isResume && <Icon className="h-[14px] w-[14px]" />}
                <span>{s.label}</span>
                {isResume && <HiOutlineArrowUpRight className="h-[13px] w-[13px]" aria-hidden="true" />}
              </a>
            )
          })}
      </div>
    </section>
  )
}
