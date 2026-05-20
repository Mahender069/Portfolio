import { NavLink } from "react-router-dom";

export default function NavBar({ dark, onToggleDark }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric"
  });

  return (
    <>
      {/* Masthead */}
      <div className="masthead">
        <span className="masthead-name">Mahender · Portfolio</span>
        <span className="masthead-title">AI & Backend Engineer</span>
        <div className="masthead-right">
          <span className="masthead-date">{dateStr}</span>
          <button className="theme-toggle" onClick={onToggleDark}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* Nav strip */}
      <nav className="nav-strip">
        {[
          { to: "/",         label: "Index"     },
          { to: "/tech",     label: "Stack"     },
          { to: "/projects", label: "Work"      },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            {label}
          </NavLink>
        ))}

        <div className="nav-status">
          <span className="status-dot" />
          Open to work
        </div>
      </nav>
    </>
  );
}