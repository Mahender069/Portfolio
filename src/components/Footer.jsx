export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-cell">
        <span className="footer-name">Mahender</span>
      </div>
      <div className="footer-cell">
        <span className="footer-mid">© {year} · All rights reserved</span>
      </div>
      <div className="footer-cell">
        <a href="mailto:you@email.com" className="footer-hire">
          Available for hire ↗
        </a>
      </div>
    </footer>
  )
}