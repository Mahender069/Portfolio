import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="
      /* Mobile: Fixed at the bottom */
      fixed bottom-0 left-0 w-full h-16 px-6
      flex flex-row justify-center items-center
      border-t border-white/10 z-50 bg-black/80 backdrop-blur-md
      
      /* Desktop: Sidebar layout */
      sm:relative sm:w-[240px] sm:h-full sm:flex-col sm:justify-center sm:items-center
      sm:border-t-0 sm:border-r sm:bg-transparent
    ">
      <ul className="flex flex-row gap-x-6 list-none sm:flex-col sm:list-none sm:gap-x-0 sm:gap-y-6 sm:items-start">
        {[
          { to: "/", label: "Home" },
          { to: "/techstack", label: "TechStack" },
          { to: "/projects", label: "Projects" },
        ].map(({ to, label }) => (
          <li key={to} className="flex items-center gap-2 group">
            {/* Custom bullet for desktop centering look */}
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-purple-400 underline underline-offset-4 text-sm sm:text-base"
                  : "text-white/70 hover:text-white transition-colors text-sm sm:text-base"
              }
              viewTransition
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Vertical decorative line for desktop */}
      <div className="hidden sm:block absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </nav>
  );
}