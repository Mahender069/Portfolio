import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { experiences } from '../constants/data'

export default function Experience() {
  return (
    <section id="experience" className="w-full">
      <h2 className="font-display text-[28px] font-bold text-neutral-900">Experience</h2>
      <div className="mt-5 space-y-[24px]">
        {experiences.map((e) => (
          <div
            key={e.id}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 py-2.5 border-b border-neutral-100 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-[16px] font-bold text-neutral-900">
                  {e.company}
                </span>
                {e.current && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    Working
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-[13px] font-normal text-neutral-500">{e.role}</p>
            </div>
            <div className="sm:text-right sm:min-w-[110px]">
              <p className="font-mono text-[12px] font-medium text-neutral-500">{e.date}</p>
              <p className="mt-0.5 font-mono text-[12px] font-medium text-neutral-400">{e.location}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-7 inline-flex h-[34px] items-center gap-2 rounded-[10px] border border-neutral-200 bg-white px-[12px] font-mono text-[10px] uppercase tracking-widest text-neutral-500 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-900"
      >
        Show all work experiences
        <HiOutlineArrowUpRight className="h-2.5 w-2.5" />
      </button>
    </section>
  )
}