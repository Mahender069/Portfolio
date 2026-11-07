import { FaCode } from 'react-icons/fa6'
import {
  SiCloudinary,
  SiCss,
  SiCursor,
  SiGit,
  SiHtml5,
  SiLangchain,
  SiLanggraph,
  SiMongodb,
  SiNeovim,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiRabbitmq,
  SiRailway,
  SiReact,
  SiRedis,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
  SiZedindustries,
  SiZod,
} from 'react-icons/si'
import { ExpressIcon, JavascriptIcon, JwtIcon, ShadcnUIIcon, FastAPIIcon, MistralIcon } from './TechStackIcons'

const ICON_MAP = {
  'Node.js': SiNodedotjs,
  'Express.js': ExpressIcon,
  TypeScript: SiTypescript,
  PostgreSQL: SiPostgresql,
  Prisma: SiPrisma,
  JWT: JwtIcon,
  Zod: SiZod,
  Swagger: SiSwagger,
  Railway: SiRailway,
  MongoDB: SiMongodb,
  RabbitMQ: SiRabbitmq,
  'React.js': SiReact,
  'Tailwind CSS': SiTailwindcss,
  'shadcn/ui': ShadcnUIIcon,
  Cloudinary: SiCloudinary,
  Python: SiPython,
  LangChain: SiLangchain,
  Mistral: MistralIcon,
  JavaScript: JavascriptIcon,
  FastAPI: FastAPIIcon,
  Redis: SiRedis,
  LangGraph: SiLanggraph,
  HTML: SiHtml5,
  CSS: SiCss,
  Git: SiGit,
  Postman: SiPostman,
  Neovim: SiNeovim,
  Cursor: SiCursor,
  Zed: SiZedindustries,
}

const ICON_COLORS = {
  'Node.js': '#5FA04E',
  'Express.js': 'var(--foreground)',
  TypeScript: '#3178C6',
  PostgreSQL: '#4169E1',
  Prisma: '#5A67D8',
  JWT: '#D63AFF',
  Zod: '#3E67B1',
  Swagger: '#65A30D',
  Railway: 'var(--foreground)',
  MongoDB: '#47A248',
  RabbitMQ: '#EA580C',
  'React.js': '#0284C7',
  'Tailwind CSS': '#0891B2',
  'shadcn/ui': 'var(--foreground)',
  Cloudinary: '#4F6BFF',
  Python: '#3776AB',
  LangChain: '#16A34A',
  Mistral: '#EA580C',
  FastAPI: '#009688',
  Redis: '#FF4438',
  LangGraph: '#16A34A',
  HTML: '#E34F26',
  CSS: '#8B5CF6',
  Git: '#F05032',
  Postman: '#EA580C',
  Neovim: '#57A143',
  'VS Code': '#007ACC',
  Cursor: 'var(--foreground)',
  Zed: '#3B82F6',
}

const PILL_STYLES = {
  project: 'rounded-[6px] px-2 py-1 font-mono text-[11px]',
  skill: 'rounded-lg px-3 py-1.5 font-mono text-[13px]',
}

const LABEL_STYLES =
  'ml-0 max-w-0 overflow-hidden whitespace-nowrap leading-none opacity-0 transition-[margin-left,max-width,opacity] duration-200 ease-out group-hover:ml-1 group-hover:max-w-[12rem] group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:ml-1 [@media(hover:none)]:max-w-[12rem] [@media(hover:none)]:opacity-100'

export default function TechStack({ items, variant = 'skill' }) {
  const isProject = variant === 'project'

  return (
    <div className={`flex flex-wrap items-center ${isProject ? 'gap-1.5' : 'gap-2'}`}>
      {items.map((t) => {
        const Icon = ICON_MAP[t] ?? FaCode
        const color = ICON_COLORS[t]
        return (
          <span
            key={t}
            className={`group inline-flex items-center border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--meta)] transition-colors duration-150 hover:border-[color-mix(in_srgb,var(--foreground)_30%,var(--border))] ${PILL_STYLES[variant]}`}
          >
            <Icon
              style={color ? { color } : undefined}
              className={`${isProject ? 'h-3 w-3' : 'h-4 w-4'} shrink-0`}
              aria-hidden="true"
            />
            <span className={LABEL_STYLES}>{t}</span>
          </span>
        )
      })}
    </div>
  )
}
