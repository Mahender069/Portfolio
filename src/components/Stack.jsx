const CATEGORIES = [
  {
    num: '01',
    name: 'Languages',
    tools: [
      { name: 'Python',     note: 'Primary'    },
      { name: 'TypeScript', note: 'Typed JS'   },
      { name: 'JavaScript', note: 'Web'        },
      { name: 'Go',         note: 'Systems'    },
      { name: 'SQL',        note: 'Queries'    },
      { name: 'Bash',       note: 'Scripting'  },
    ],
  },
  {
    num: '02',
    name: 'AI / ML',
    tools: [
      { name: 'PyTorch',      note: 'Deep Learning' },
      { name: 'LangChain',    note: 'LLM Ops'       },
      { name: 'Hugging Face', note: 'Models'         },
      { name: 'scikit-learn', note: 'Classical ML'   },
      { name: 'FAISS',        note: 'Vector Search'  },
      { name: 'OpenAI API',   note: 'GPT'            },
    ],
  },
  {
    num: '03',
    name: 'Backend & Data',
    tools: [
      { name: 'FastAPI',    note: 'REST / Async' },
      { name: 'PostgreSQL', note: 'Relational'   },
      { name: 'MongoDB',    note: 'Document'     },
      { name: 'Redis',      note: 'Cache'        },
      { name: 'Kafka',      note: 'Streaming'    },
      { name: 'GraphQL',    note: 'API Layer'    },
    ],
  },
  {
    num: '04',
    name: 'Infrastructure',
    tools: [
      { name: 'Docker',     note: 'Containers'    },
      { name: 'Kubernetes', note: 'Orchestration' },
      { name: 'AWS',        note: 'Cloud'         },
      { name: 'Terraform',  note: 'IaC'           },
      { name: 'GitHub CI',  note: 'Pipelines'     },
      { name: 'Prometheus', note: 'Observability' },
    ],
  },
]

export default function Stack() {
  return (
    <section id="stack" className="stack-section">

      <div className="stack-header">
        <div className="stack-header-left reveal">
          <span className="about-section-tag">03 / Stack</span>
          <h2 className="section-hed" style={{ marginTop: '1.5rem' }}>
            Tools &amp;<br /><em>Stack.</em>
          </h2>
        </div>
        <div className="stack-header-right reveal d1">
          <p className="section-sub">
            The languages, frameworks, and infrastructure I reach for
            when building production-grade AI and backend systems.
          </p>
        </div>
      </div>

      <div className="stack-grid">
        {CATEGORIES.map((cat, i) => (
          <div key={cat.num} className={`stack-cat reveal d${i % 4}`}>

            <div className="cat-head">
              <span className="cat-num">{cat.num}</span>
            </div>

            <div className="cat-name">{cat.name}</div>

            <div className="cat-tools-expanded">
              {cat.tools.map((t) => (
                <div className="exp-item" key={t.name}>
                  <span className="ei-name">{t.name}</span>
                  <span className="ei-note">{t.note}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}