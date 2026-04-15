import { motion } from "framer-motion";
import React, { useState } from "react";
import StackIcon from "tech-stack-icons";

const stack = [
  {
    category: "Languages",
    accent: "#f472b6",
    hoverBg: "rgba(244,114,182,0.13)",
    glowColor: "#f472b6",
    shadowColor: "rgba(244,114,182,0.25)",
    items: [
      { name: "Python", icon: "python" },
      { name: "C++", icon: "c++" },
      { name: "JavaScript", icon: "js" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Rust", icon: "rust" },
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css3" },
    ],
  },
  {
    category: "Frontend",
    accent: "#a78bfa",
    hoverBg: "rgba(167,139,250,0.13)",
    glowColor: "#a78bfa",
    shadowColor: "rgba(167,139,250,0.25)",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind", icon: "tailwindcss" },
      { name: "Vite", icon: "vitejs" },
      { name: "Framer", icon: "framer" },
    ],
  },
  {
    category: "Backend",
    accent: "#34d399",
    hoverBg: "rgba(52,211,153,0.13)",
    glowColor: "#34d399",
    shadowColor: "rgba(52,211,153,0.25)",
    items: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "expressjs" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    category: "DevOps & Tools",
    accent: "#38bdf8",
    hoverBg: "rgba(56,189,248,0.13)",
    glowColor: "#38bdf8",
    shadowColor: "rgba(56,189,248,0.25)",
    items: [
      { name: "Docker", icon: "docker" },
      { name: "GitHub", icon: "github" },
      { name: "AWS", icon: "aws" },
      { name: "Vercel", icon: "vercel" },
      { name: "GraphQL", icon: "graphql" },
    ],
  },
];

function TechCard({ item, accent, hoverBg, glowColor, shadowColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      style={{
        borderRadius: 18,
        padding: "20px 12px", // Increased padding
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12, // Increased gap
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        transition: "background 0.25s, border 0.25s, box-shadow 0.25s",
        background: hovered ? hoverBg : "rgba(255,255,255,0.04)",
        border: hovered ? `1px solid ${accent}55` : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered ? `0 20px 50px ${shadowColor}` : "0 4px 15px rgba(0,0,0,0.4)",
      }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute", top: -30, left: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: glowColor, filter: "blur(40px)",
          opacity: 0.2, pointerEvents: "none",
        }}
      />

      <motion.div
        animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 5 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{ width: 44, height: 44, transformOrigin: "center", flexShrink: 0 }} // Increased icon size
      >
        <StackIcon name={item.icon} style={{ width: "100%", height: "100%" }} />
      </motion.div>

      <div style={{
        fontSize: 13, // Increased font size
        fontWeight: 700,
        color: hovered ? accent : "#f0eeff",
        fontFamily: "'Syne', 'DM Sans', sans-serif",
        letterSpacing: "-0.01em",
        textAlign: "center",
        lineHeight: 1.2,
        transition: "color 0.25s",
      }}>
        {item.name}
      </div>
    </motion.div>
  );
}

function CategorySection({ group, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.15 + index * 0.1 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: group.accent, boxShadow: `0 0 10px ${group.accent}`, flexShrink: 0,
        }} />
        <span style={{
          fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase",
          color: group.accent, fontWeight: 800, fontFamily: "monospace",
        }}>
          {group.category}
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", // Increased min column width
        gap: 12, // Increased gap between cards
      }}>
        {group.items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.2 + index * 0.1 + i * 0.05 }}
          >
            <TechCard
              item={item}
              accent={group.accent}
              hoverBg={group.hoverBg}
              glowColor={group.glowColor}
              shadowColor={group.shadowColor}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.9, x: "20%" }}
      animate={{ opacity: 1, scale: 1, x: "0%" }}
      exit={{ opacity: 0, scale: 0.95, x: "-10%", filter: "blur(10px)" }}
      transition={{ duration: 0.42, ease: "easeInOut" }}
      style={{ color: "#e2e8f0", position: "relative", overflow: "auto" }}
    >
      <div
        className="tech-scroll"
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "clamp(24px, 5vw, 60px)", // Increased padding
          position: "relative",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1], x: [0, 18, 0], y: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: -120, left: -100,
            width: "min(600px, 90vw)", height: "min(600px, 90vw)", // Increased glow size
            borderRadius: "50%",
            background: "radial-gradient(circle, #6d28d9 0%, #4c1d95 40%, transparent 70%)",
            filter: "blur(80px)", opacity: 0.7, pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(30px, 5vw, 60px)", position: "relative" }}>
          {stack.map((group, i) => (
            <CategorySection key={group.category} group={group} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}