import { FaGithub } from 'react-icons/fa6'
import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { projects } from '../constants/data'
import TechStack from '../components/TechStack'

const LINK_STYLES =
  'inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--foreground-secondary)] transition-colors duration-150 hover:border-[var(--foreground-secondary)] hover:text-[var(--foreground)]'

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="w-full">
      <h2 id="projects-heading" className="font-sans text-title font-bold text-neutral-900">
        Projects
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {projects.map((p) => (
          <article
            key={p.id}
            className="project-card flex h-full flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <p className="font-mono text-meta text-metadata">{p.index}</p>
            <h3 className="mt-2 font-sans text-[17px] font-semibold leading-snug text-neutral-900">
              {p.title}
            </h3>
            <p className="mt-2 line-clamp-3 font-sans text-[14px] leading-[1.6] text-[var(--foreground-muted)]">
              {p.tagline}
            </p>
            <div className="mt-4">
              <TechStack items={p.stack} variant="project" />
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              {p.links.github && (
                <a
                  href={p.links.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${p.title} on GitHub`}
                  className={LINK_STYLES}
                >
                  <FaGithub className="h-3.5 w-3.5" aria-hidden="true" />
                  GitHub
                </a>
              )}
              {p.links.demo && (
                <a
                  href={p.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${p.title} live`}
                  className={LINK_STYLES}
                >
                  <HiOutlineArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  Live
                </a>
              )}
              {!p.links.github && !p.links.demo && (
                <span className="font-mono text-[11px] text-[var(--foreground-muted)]">
                  {/* TODO: Add a GitHub or live link for this project. */}
                  Link coming soon
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
