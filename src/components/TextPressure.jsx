import { useEffect, useRef, useMemo } from 'react';

export default function TextPressure({
  text = 'MAHENDER',
  fontSize = 'clamp(3rem, 8vw, 7rem)',
  lineHeight = '0.9',
  fontWeight = 100,
  scaleY = 1,
  maxFontSize = 600,
  minFontSize = 12,
  stroke = false,
  tracking = -0.02,
  color = '#F0EDE6',
  strokeColor = '#F0EDE6',
  fontFamily = "'Roboto Flex', -apple-system, sans-serif",
  fontUrl = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght,wdth,GRAD,ital@8..144,100..1000,25..151,-200..150,0..1&display=swap"
}) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const spanRectsRef = useRef([]);
  const resizeObserverRef = useRef(null);

  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [fontUrl]);

  // Cache span rects on mount and on resize
  useEffect(() => {
    const updateRects = () => {
      if (!containerRef.current || !titleRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const spans = spansRef.current.filter(Boolean);
      spanRectsRef.current = spans.map((span) => {
        const spanRect = span.getBoundingClientRect();
        return {
          centerX: spanRect.left + spanRect.width / 2 - containerRect.left,
          centerY: spanRect.top + spanRect.height / 2 - containerRect.top,
        };
      });
    };

    updateRects();

    const resizeObserver = new ResizeObserver(updateRects);
    resizeObserver.observe(titleRef.current);
    resizeObserverRef.current = resizeObserver;

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Mousemove handler - uses ref, no state update
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop - reads from refs, no re-renders
  useEffect(() => {
    const animate = () => {
      if (!containerRef.current || !titleRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const maxDist = Math.max(containerRect.width, containerRect.height) * 0.7;

      spansRef.current.filter(Boolean).forEach((span, i) => {
        const cached = spanRectsRef.current[i];
        if (!cached) return;

        const dx = mouseRef.current.x - cached.centerX;
        const dy = mouseRef.current.y - cached.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedDist = Math.min(distance / maxDist, 1);
        const influence = 1 - normalizedDist;

        const wght = 100 + influence * 900;
        const wdth = 50 + influence * 150;
        const opsz = minFontSize + influence * (maxFontSize - minFontSize);
        const slnt = influence * -12;
        const grad = influence * 150;
        const alpha = 0.15 + influence * 0.85;

        span.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}, "opsz" ${opsz}, "slnt" ${slnt}, "GRAD" ${grad}`;
        span.style.opacity = alpha;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [maxFontSize, minFontSize]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }}
    >
      <h1
        ref={titleRef}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight,
          width: '100%',
          letterSpacing: `${tracking}em`,
          color: stroke ? 'transparent' : color,
          WebkitTextStroke: stroke ? `1px ${strokeColor}` : 'none',
          paintOrder: stroke ? 'stroke fill' : 'normal',
          willChange: 'font-variation-settings, opacity',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : color,
              transition: 'opacity 0.1s ease-out',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
}