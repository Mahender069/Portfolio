import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  LuBriefcaseBusiness,
  LuFolderGit2,
  LuHouse,
  LuMail,
  LuMoon,
  LuSun,
  LuWrench,
} from 'react-icons/lu'
import { profile } from '../constants/portfolio'
import { scrollToId } from '../utils/scroll'

const MAX_SCALE = 1.65
const INFLUENCE_RADIUS = 130

const ICONS = {
  home: LuHouse,
  experience: LuBriefcaseBusiness,
  projects: LuFolderGit2,
  skills: LuWrench,
  contact: LuMail,
}

function bellFalloff(distance) {
  const t = Math.min(Math.abs(distance) / INFLUENCE_RADIUS, 1)
  return 0.5 * (1 + Math.cos(Math.PI * t))
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

function DockItem({
  mouseX,
  magnify,
  reducedMotion,
  label,
  tooltip,
  Icon,
  active = false,
  href,
  onClick,
  bouncing = false,
}) {
  const ref = useRef(null)

  const distance = useTransform(mouseX, (x) => {
    if (!magnify || !ref.current || !Number.isFinite(x)) return Infinity
    const rect = ref.current.getBoundingClientRect()
    return x - (rect.left + rect.width / 2)
  })

  const scaleTarget = useTransform(distance, (d) =>
    Number.isFinite(d) ? 1 + (MAX_SCALE - 1) * bellFalloff(d) : 1
  )

  const scale = useSpring(scaleTarget, {
    stiffness: 240,
    damping: 16,
    mass: 0.15,
  })

  const width = useMotionTemplate`calc(var(--dock-item) * ${scale})`
  const tooltipBottom = useMotionTemplate`calc(var(--dock-item) * ${scale} + 10px)`

  const sharedClassName =
    'relative flex h-[var(--dock-item)] w-[var(--dock-item)] origin-bottom items-center justify-center rounded-[12px] text-[var(--foreground-secondary)] transition-colors duration-200'

  const sharedStyle = magnify ? { scale } : undefined

  const content = (
    <motion.span
      aria-hidden="true"
      tabIndex={-1}
      className="flex items-center justify-center"
      initial={false}
      animate={bouncing ? { y: [0, -10, 0, -4, 0] } : { y: 0 }}
      transition={bouncing ? { duration: 0.55, ease: 'easeOut' } : { duration: 0.2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
    </motion.span>
  )

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="group relative flex h-[var(--dock-item)] shrink-0 items-end justify-center"
    >
      <motion.span
        aria-hidden="true"
        style={{ bottom: tooltipBottom }}
        className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-mono text-[12px] font-medium uppercase tracking-wider text-[var(--foreground-secondary)] opacity-0 shadow-sm transition-[opacity,transform] duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
          magnify ? 'group-hover:translate-y-0 group-hover:opacity-100' : ''
        }`}
      >
        {tooltip}
      </motion.span>

      {href ? (
        <motion.a
          href={href}
          onClick={(event) => {
            event.preventDefault()
            onClick()
          }}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
          style={sharedStyle}
          className={`${sharedClassName} ${
            magnify ? 'hover:text-[var(--foreground)]' : ''
          }`}
        >
          {content}
        </motion.a>
      ) : (
        <motion.button
          type="button"
          onClick={onClick}
          aria-label={label}
          style={sharedStyle}
          className={`${sharedClassName} ${
            magnify ? 'hover:text-[var(--foreground)]' : ''
          }`}
        >
          {content}
        </motion.button>
      )}

      {active && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[2px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--foreground)]"
        />
      )}
    </motion.div>
  )
}

export default function Dock({ onToggleTheme, theme }) {
  const [active, setActive] = useState(profile.navigation[0]?.id ?? 'home')
  const [magnify, setMagnify] = useState(false)
  const [bounce, setBounce] = useState({ id: null, tick: 0 })
  const mouseX = useMotionValue(Infinity)
  const reducedMotion = usePrefersReducedMotion()
  const bounceTimer = useRef(null)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setMagnify(query.matches && !reducedMotion)

    update()
    if (query.addEventListener) {
      query.addEventListener('change', update)
      return () => query.removeEventListener('change', update)
    }
    query.addListener(update)
    return () => query.removeListener(update)
  }, [reducedMotion])

  useEffect(() => {
    if (!magnify) mouseX.set(Infinity)
  }, [magnify, mouseX])

  useEffect(() => {
    const ids = profile.navigation.map((item) => item.id)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element) => element !== null)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      if (bounceTimer.current) window.clearTimeout(bounceTimer.current)
    },
    []
  )

  const triggerBounce = useCallback(
    (id) => {
      if (reducedMotion) return
      setBounce((current) => ({ id, tick: current.tick + 1 }))
      if (bounceTimer.current) window.clearTimeout(bounceTimer.current)
      bounceTimer.current = window.setTimeout(() => {
        setBounce((current) => ({ ...current, id: null }))
      }, 600)
    },
    [reducedMotion]
  )

  const handleNavigate = useCallback(
    (id) => {
      setActive(id)
      scrollToId(id)
      triggerBounce(id)
    },
    [triggerBounce]
  )

  const handleThemeClick = useCallback(
    (event) => {
      onToggleTheme(event)
      triggerBounce('theme')
    },
    [onToggleTheme, triggerBounce]
  )

  const handleMouseMove = useCallback(
    (event) => {
      if (!magnify) return
      mouseX.set(event.clientX)
    },
    [magnify, mouseX]
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Infinity)
  }, [mouseX])

  const ThemeIcon = theme === 'dark' ? LuMoon : LuSun

  return (
    <motion.nav
      aria-label="Primary"
      initial={reducedMotion ? false : { x: '-50%', y: 48, opacity: 0 }}
      animate={{ x: '-50%', y: 0, opacity: 1 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 220, damping: 26, delay: 0.1 }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--dock-item': 'clamp(40px, 11vw, 44px)',
        background: 'var(--background)',
        backgroundColor: 'color-mix(in srgb, var(--background) 72%, transparent)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(14px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      className="fixed bottom-5 left-1/2 z-[100] flex items-end gap-1 rounded-[22px] border px-2.5 py-2 sm:gap-2"
    >
      {profile.navigation.map((item) => {
        const Icon = ICONS[item.id] ?? LuHouse

        return (
          <DockItem
            key={item.id}
            mouseX={mouseX}
            magnify={magnify}
            reducedMotion={Boolean(reducedMotion)}
            label={`Go to ${item.label}`}
            tooltip={item.label}
            Icon={Icon}
            active={active === item.id}
            href={`#${item.id}`}
            onClick={() => handleNavigate(item.id)}
            bouncing={bounce.id === item.id}
          />
        )
      })}

      <span aria-hidden="true" className="mx-1 h-6 w-px self-center bg-[var(--border)]" />

      <DockItem
        mouseX={mouseX}
        magnify={magnify}
        reducedMotion={Boolean(reducedMotion)}
        label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        Icon={ThemeIcon}
        onClick={handleThemeClick}
        bouncing={bounce.id === 'theme'}
      />
    </motion.nav>
  )
}
