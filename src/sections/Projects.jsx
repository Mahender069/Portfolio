import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { projects } from '../constants/data'
import TechStack from '../components/TechStack'

export default function Projects() {
  return (
    <section id="work" className="w-full">
      <h2 className="font-display text-[28px] font-bold text-neutral-900">Projects</h2>
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
                  <span className="font-mono text-[10px] text-neutral-400 sm:text-[10px]">{p.index}</span>
                  <h3 className="font-display text-[18px] font-bold text-neutral-900 group-hover/card:text-electric sm:text-[18px]">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-1 max-w-xl text-[12px] font-normal text-neutral-600">{p.tagline}</p>
                <TechStack items={p.stack} />
              </div>
              <div className="mt-2 flex items-center gap-3 sm:mt-0 sm:text-right">
                <span className="font-mono text-[10px] text-neutral-400 sm:text-[10px]">{p.year}</span>
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
