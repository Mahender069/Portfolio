import { skillCategories } from '../constants/data'
import TechStack from '../components/TechStack'

export default function Skills() {
  return (
    <section id="skills" className="w-full">
      <h2 className="font-display text-[28px] font-bold text-neutral-900">Skills</h2>
      <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-7">
        {skillCategories.map((c) => (
          <div key={c.name}>
             <h3 className="font-display text-[11px] font-bold uppercase tracking-widest text-neutral-400 sm:text-xs">
              {c.name}
            </h3>
            <TechStack items={c.skills} />
          </div>
        ))}
      </div>
    </section>
  )
}