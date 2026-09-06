import { skillCategories } from '../constants/data'
import TechStack from '../components/TechStack'

export default function Skills() {
  return (
    <section id="skills" className="w-full">
      <h2 className="font-sans text-[28px] font-bold text-neutral-900">Skills</h2>
      <div className="mt-5 space-y-6 sm:mt-6 sm:space-y-7">
        {skillCategories.map((c) => (
          <div key={c.name}>
            <h3 className="font-sans text-[11px] font-bold uppercase text-neutral-400 sm:text-xs">
              {c.name}
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <TechStack items={c.skills} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}