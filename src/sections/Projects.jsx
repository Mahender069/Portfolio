import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { projects } from '../constants/data'
import TechStack from '../components/TechStack'

export default function Projects() {
  return (
    <section id="work" className="w-full">
      <h2 className="font-sans text-title font-bold text-neutral-900">
        <span className="mr-2 font-mono text-meta font-normal text-metadata">02 /</span>
        Projects
      </h2>
      <div className="mt-5 space-y-[30px]">
        {projects.map((p) => (
          <a
            key={p.id}
            href={p.links.github || p.links.demo || '#'}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${p.title}`}
            className="group/card block w-full"
          >
            <div className="flex flex-col justify-between gap-2 sm:gap-3 py-2 sm:py-2.5 transition-colors hover:bg-neutral-50 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-meta text-metadata">{p.index}</span>
                  <h3 className="font-sans text-item font-bold text-neutral-900 group-hover/card:text-neutral-900">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-1 max-w-xl font-sans text-body font-normal text-neutral-600">{p.tagline}</p>
                <TechStack items={p.stack} />
              </div>
              <div className="mt-2 flex items-center gap-3 sm:mt-0 sm:text-right">
                <span className="font-mono text-meta text-metadata">{p.year}</span>
                {p.links.github && (
                  <span className="text-neutral-400 group-hover/card:text-neutral-900">
                    <HiOutlineArrowUpRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
