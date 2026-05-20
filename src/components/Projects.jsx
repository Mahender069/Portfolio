const PROJECTS = [
  {
    num: '01',
    meta: 'AI Platform',
    title: 'Neural Query Engine',
    desc: 'Semantic search infrastructure built on vector embeddings. Processes 10M+ documents with sub-50ms retrieval latency using FAISS and LangChain orchestration.',
    tags: ['Python', 'FastAPI', 'FAISS', 'LangChain'],
    href: '#',
  },
  {
    num: '02',
    meta: 'Analytics Platform',
    title: 'Signal Commerce',
    desc: 'Real-time revenue and conversion dashboard. Event-driven architecture handling 50k events per second across a distributed Kafka cluster.',
    tags: ['Go', 'Kafka', 'PostgreSQL', 'Redis'],
    href: '#',
  },
  {
    num: '03',
    meta: 'Infrastructure',
    title: 'Mono Deploy',
    desc: 'Zero-downtime deployment pipeline with automated rollback, health-check gates, and full Kubernetes integration for monorepo environments.',
    tags: ['K8s', 'Docker', 'AWS', 'Terraform'],
    href: '#',
  },
  {
    num: '04',
    meta: 'ML Research',
    title: 'Adaptive RAG',
    desc: 'Context-aware retrieval system that dynamically adjusts chunk size and retrieval strategy based on query complexity and domain classification.',
    tags: ['Python', 'LangChain', 'OpenAI', 'Pinecone'],
    href: '#',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="projects-section">

      <div className="projects-header">
        <div className="projects-header-left reveal">
          <span className="about-section-tag">04 / Work</span>
        </div>
        <div className="projects-header-right reveal d1">
          <h2 className="section-hed">
            Selected<br /><em>work.</em>
          </h2>
        </div>
      </div>

      {PROJECTS.map((p, i) => (
        <a
          key={p.num}
          href={p.href}
          className={`proj-row reveal d${i % 3}`}
        >
          <span className="proj-num">{p.num}</span>

          <div className="proj-info">
            <p className="proj-meta">{p.meta}</p>
            <h3 className="proj-title">{p.title}</h3>
            <p className="proj-desc">{p.desc}</p>
          </div>

          <div className="proj-tags-col">
            {p.tags.map((t) => (
              <span key={t} className="proj-tag">{t}</span>
            ))}
          </div>

          <span className="proj-arrow">↗</span>
        </a>
      ))}

    </section>
  )
}