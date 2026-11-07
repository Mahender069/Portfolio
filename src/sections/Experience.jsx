import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { experiences } from '../constants/data'

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="w-full">
      <h2 id="experience-heading" className="font-sans text-title font-bold text-neutral-900">
        Experience
      </h2>
      <div className="mt-5 space-y-6">
        {experiences.map((e) => (
          <div
            key={e.id}
            className="-mx-2 flex flex-col justify-between gap-2 rounded-[10px] border-b border-[var(--border)] px-2 py-3 transition-colors duration-150 last:border-0 hover:bg-[color-mix(in_srgb,var(--border)_40%,transparent)] sm:flex-row sm:items-start"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-sans text-item font-bold text-neutral-900">
                  {e.company}
                </span>
                {e.current && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-meta font-semibold text-metadata">
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--online)]" />
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-meta font-normal text-metadata">{e.role}</p>
              {/* TODO: Add impact-oriented detail lines for this role when available. */}
            </div>
            <div className="sm:min-w-[110px] sm:text-right">
              <p className="font-mono text-meta font-medium text-metadata">{e.date}</p>
              <p className="mt-1 font-mono text-meta font-medium text-metadata">{e.location}</p>
            </div>
          </div>
        ))}
      </div>
      {/* TODO: Wire this to a full experience list or page once more entries exist. */}
      <button
        type="button"
        className="mt-8 inline-flex h-9 items-center gap-2 rounded-[10px] border border-neutral-200 bg-white px-3 font-sans text-body uppercase text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-900"
      >
        Show all work experiences
        <HiOutlineArrowUpRight className="h-2.5 w-2.5" />
      </button>
    </section>
  )
}