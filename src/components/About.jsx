export default function About() {
  return (
    <section id="about">

      {/* Info grid */}
      <div className="about-grid">

        {/* Main cell */}
        <div className="about-cell about-cell-main reveal">
          <span className="about-section-tag">02 / About</span>
          <h2 className="about-headline">
            Minimal surface.<br />
            <em>Deep architecture.</em>
          </h2>
        </div>

        <div className="about-cell reveal d1">
          <p className="cell-label">Approach</p>
          <p className="cell-val">
            Research first.<br />
            Then design.<br />
            Then build &amp; ship.
          </p>
          <div className="cell-tags">
            <span className="cell-tag">Research</span>
            <span className="cell-tag">Design</span>
            <span className="cell-tag">Build</span>
            <span className="cell-tag">Ship</span>
          </div>
        </div>

        <div className="about-cell reveal d2">
          <p className="cell-label">Currently</p>
          <p className="cell-val">
            RAG pipelines &amp;<br />
            production backend<br />
            systems.
          </p>
          <div className="cell-tags">
            <span className="cell-tag">LLM Ops</span>
            <span className="cell-tag">Infra</span>
          </div>
        </div>

        <div className="about-cell reveal d3">
          <p className="cell-label">Available for</p>
          <p className="cell-val">
            Freelance work.<br />
            Full-time roles.<br />
            Remote-friendly.
          </p>
          <div className="cell-tags">
            <span className="cell-tag">Freelance</span>
            <span className="cell-tag">Full-time</span>
          </div>
        </div>

      </div>
    </section>
  )
}