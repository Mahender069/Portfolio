import { useEffect, useRef, useState } from "react";

const CMDS = [
  "initializing system",
  "loading environment",
  "bootstrapping modules",
  "checking dependencies",
  "compiling assets",
  "connecting to database",
  "running ai processes",
  "starting services",
  "launching interface",
  "system ready",
];

function Cursor() {
  return (
    <span style={{
      display: "inline-block", width: 6, height: 11,
      background: "rgba(255,255,255,0.6)", borderRadius: 1,
      marginLeft: 4, verticalAlign: "middle",
      animation: "blink 1.1s ease-in-out infinite",
    }} />
  );
}

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(0);
  const [isExiting, setIsExiting] = useState(false); // New state for fade out
  const fillRef = useRef(null);
  const pctRef = useRef(null);
  const pct = useRef(0);
  const target = useRef(0);

  useEffect(() => {
    let raf;
    const loop = () => {
      pct.current += (target.current - pct.current) * 0.08;
      if (Math.abs(pct.current - target.current) < 0.05) pct.current = target.current;
      if (pctRef.current) pctRef.current.textContent = Math.round(pct.current) + "%";
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${pct.current / 100})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let cum = 0;
    const timers = CMDS.map((_, i) => {
      const delay = i === 0 ? 150 : (cum += 100 + Math.random() * 150 + (i > 6 ? 50 : 0));
      return setTimeout(() => {
        target.current = Math.round(((i + 1) / CMDS.length) * 100);
        setVisible(i + 1);
        
        if (i === CMDS.length - 1) {
          // Trigger fade out after a brief pause on "System Ready"
          setTimeout(() => {
            setIsExiting(true);
            // Call onComplete after the CSS transition finishes (800ms)
            setTimeout(() => onComplete?.(), 800);
          }, 500);
        }
      }, delay);
    });
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes blink{0%,45%{opacity:1}55%,100%{opacity:0}}
      `}</style>
      <div style={{
        position: "fixed", 
        inset: 0, 
        background: "#080808",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        zIndex: 9999,
        // Fade and Blur transition logic
        opacity: isExiting ? 0 : 1,
        filter: isExiting ? "blur(20px)" : "none",
        transition: "opacity 0.8s ease-in-out, filter 0.8s ease-in-out",
        pointerEvents: isExiting ? "none" : "auto",
      }}>
        <div style={{ 
          width: 360, 
          padding: "0 1.5rem",
          transform: isExiting ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.8s ease-in-out"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {CMDS.map((cmd, i) => {
              const isActive = i === visible - 1;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  opacity: i < visible ? 1 : 0,
                  transform: i < visible ? "translateY(0)" : "translateY(4px)",
                  transition: "opacity .2s, transform .2s",
                }}>
                  <span style={{
                    width: 4, height: 4, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)",
                    transition: "background .2s",
                  }} />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, letterSpacing: "0.04em",
                    color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)",
                    transition: "color .2s",
                  }}>
                    {cmd}
                    {isActive && <Cursor />}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: "1.75rem",
            opacity: visible > 0 ? 1 : 0,
            transition: "opacity .4s",
          }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
              <div ref={fillRef} style={{
                position: "absolute", inset: 0,
                background: "rgba(255,255,255,0.25)",
                transformOrigin: "left", transform: "scaleX(0)", willChange: "transform",
              }} />
            </div>
            <div style={{ textAlign: "right", marginTop: 5 }}>
              <span ref={pctRef} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: "rgba(255,255,255,0.2)",
              }}>0%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}