import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaCopy, FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { FaXTwitter } from 'react-icons/fa6'
import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { profile } from '../constants/portfolio'

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
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
    <section id="contact" aria-labelledby="contact-heading" className="w-full">
      <h2 id="contact-heading" className="font-sans text-title font-bold text-neutral-900">
        Contact
      </h2>
      <p className="mt-4 max-w-xl font-sans text-body text-[var(--foreground-secondary)]">
        {profile.status.label}. Let&apos;s Build Something Together.
      </p>

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
          .map((social) => {
            const Icon = SOCIAL_ICONS[social.label]
            const isExternal = social.href.startsWith('http')
            const isResume = social.label === 'Resume'

            return (
              <a
                key={social.label}
                href={social.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                aria-label={social.label}
                className={
                  isResume
                    ? 'inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-wide text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--hover)]'
                    : 'inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[12px] uppercase tracking-wide text-[var(--foreground)] opacity-80 transition-all duration-200 hover:bg-[var(--hover)] hover:text-[var(--foreground)] hover:opacity-100'
                }
              >
                {!isResume && Icon && <Icon className="h-[14px] w-[14px]" aria-hidden="true" />}
                <span>{social.label}</span>
                {isResume && (
                  <HiOutlineArrowUpRight className="h-[13px] w-[13px]" aria-hidden="true" />
                )}
              </a>
            )
          })}
      </div>
    </section>
  )
}
