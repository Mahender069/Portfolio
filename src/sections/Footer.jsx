import { FaHeart } from 'react-icons/fa6'
import { profile } from '../constants/portfolio'
import { scrollToId } from '../utils/scroll'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mx-auto mt-12 flex w-full flex-col items-center border-t border-[var(--border)] pt-6 text-center">
      <p className="font-mono text-meta uppercase tracking-widest text-metadata animate-fade-up stagger-3">
        &copy; {year} {profile.name} •{' '}
        <span className="inline-flex items-center gap-1">
          <FaHeart
            className="h-2.5 w-2.5 text-[var(--foreground-muted)] animate-bounce-once"
            aria-hidden="true"
          />{' '}
          Built with love
        </span>
      </p>

      <p className="mt-3 font-mono text-meta text-metadata">
        build {__COMMIT__} · {__BUILT__.slice(0, 10)}
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-4 font-mono text-meta uppercase text-metadata animate-fade-up stagger-3">
        {profile.navigation.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToId(item.id)}
            className="text-metadata transition-all duration-200 hover:text-neutral-900 hover:translate-y-[-1px]"
            aria-label={item.label}
          >
            {item.label}
          </button>
        ))}
      </div>
    </footer>
  )
}
