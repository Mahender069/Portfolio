import { skillCategories } from '../constants/data'
import TechStack from '../components/TechStack'

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="w-full">
      <h2 id="skills-heading" className="font-sans text-title font-bold text-neutral-900">
        Skills
      </h2>
      <div className="mt-5 space-y-6">
        {skillCategories.map((c) => (
          <div key={c.name}>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
              {c.name}
            </h3>
            <div className="mt-2">
              <TechStack items={c.skills} variant="skill" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
