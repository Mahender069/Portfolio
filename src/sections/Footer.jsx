import { FaEnvelope, FaGithub, FaHeart, FaLinkedinIn } from 'react-icons/fa6'
import { FaXTwitter } from 'react-icons/fa6'
import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { profile } from '../constants/portfolio'
import { scrollToId, scrollToTop } from '../utils/scroll'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="relative mx-auto w-full max-w-[800px] border-neutral-200 px-4 py-8 text-center sm:px-6 sm:py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(147,197,253,0.15),transparent_60%)]" />
      <div
        className="absolute inset-0 -z-20 opacity-[0.15]"
        style={{
          backgroundImage: `radial(circle(circle at var(--tw-bg-opacity), 1px, 1px),
            radial(circle(circle at var(--tw-bg-opacity), 1px, 1px))`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative animate-fade-up">
        <h2 className="font-display text-[24px] font-bold leading-[1.2] tracking-[-0.01em] text-neutral-900 sm:text-[28px]">
          Let&apos;s Build Something Together.
        </h2>
      </div>

      <div className="my-6 flex justify-center gap-3 animate-fade-up stagger-1">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition-all duration-300 hover:bg-neutral-200"
        >
          <FaGithub className="h-4 w-4" />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition-all duration-300 hover:bg-neutral-200"
        >
          <FaLinkedinIn className="h-4 w-4" />
        </a>
        <a
          href="https://x.com/Mahender_36"
          target="_blank"
          rel="noreferrer"
          aria-label="X (Twitter)"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition-all duration-300 hover:bg-neutral-200"
        >
          <FaXTwitter className="h-4 w-4" />
        </a>
        <a
          href={`mailto:${profile.email}`}
          aria-label="Email"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition-all duration-300 hover:bg-neutral-200"
        >
          <FaEnvelope className="h-4 w-4" />
        </a>
      </div>

      <div className="relative my-6 h-px w-full overflow-hidden animate-fade-up stagger-2">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
      </div>

      <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 animate-fade-up stagger-3">
        &copy; {year} {profile.name} •{' '}
        <span className="inline-flex items-center gap-1">
          <FaHeart className="h-2.5 w-2.5 text-red-400 animate-bounce-once" /> Built with love
        </span>
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500 animate-fade-up stagger-3">
        {profile.navigation.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToId(item.id)}
            className="text-neutral-500 transition-all duration-200 hover:text-neutral-900 hover:translate-y-[-1px]"
            aria-label={item.label}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/50 bg-white/30 backdrop-blur-xl shadow-lg shadow-black/5 transition-all duration-300 hover:scale-110 hover:border-neutral-300 hover:shadow-xl animate-fade-up stagger-4"
      >
        <HiOutlineArrowUpRight className="h-4 w-4 rotate-45 text-neutral-600 transition-all duration-300 group-hover:text-neutral-900 group-hover:rotate-[495deg]" />
      </button>
    </footer>
  )
}
