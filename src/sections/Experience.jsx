import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { experiences } from '../constants/data'

export default function Experience() {
  return (
    <section id="experience" className="w-full">
      <h2 className="font-sans text-title font-bold text-neutral-900">
        <span className="mr-2 font-mono text-meta font-normal text-metadata">01 /</span>
        Experience
      </h2>
      <div className="mt-5 space-y-[24px]">
        {experiences.map((e) => (
          <div
            key={e.id}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 py-2.5 border-b border-neutral-100 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-sans text-item font-bold text-neutral-900">
                  {e.company}
                </span>
                {e.current && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-meta font-semibold text-metadata">
                    <span className="h-1 w-1 rounded-full bg-neutral-400" />
                    Working
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-meta font-normal text-metadata">{e.role}</p>
            </div>
            <div className="sm:text-right sm:min-w-[110px]">
              <p className="font-mono text-meta font-medium text-metadata">{e.date}</p>
              <p className="mt-0.5 font-mono text-meta font-medium text-metadata">{e.location}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-7 inline-flex h-[34px] items-center gap-2 rounded-[10px] border border-neutral-200 bg-white px-[12px] font-sans text-body uppercase text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-900"
      >
        Show all work experiences
        <HiOutlineArrowUpRight className="h-2.5 w-2.5" />
      </button>
    </section>
  )
}