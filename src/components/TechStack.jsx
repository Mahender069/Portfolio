import { FaCode } from 'react-icons/fa6'
import StackIcon from 'tech-stack-icons'
import { ExpressIcon, JavascriptIcon, JwtIcon, ShadcnUIIcon } from './TechStackIcons'

const ICON_MAP = {
  React: 'react',
  'React.js': 'react',
  'Next.js': 'nextjs',
  TypeScript: 'typescript',
  Tailwind: 'tailwindcss',
  'Tailwind CSS': 'tailwindcss',
  JavaScript: 'javascript',
  'JS': 'javascript',
  Go: 'go',
  'Node.js': 'nodejs',
  'Express.js': 'express',
  Express: 'express',
  'REST APIs': 'rest',
  Microservices: 'microservices',
  PostgreSQL: 'postgresql',
  MongoDB: 'mongodb',
  Prisma: 'prisma',
  SQL: 'sql',
  Redis: 'redis',
  GraphQL: 'graphql',
  WebSockets: 'websockets',
  LangChain: 'langchain',
  'React Native': 'react',
  TensorFlow: 'tensorflow',
  Docker: 'docker',
  Vercel: 'vercel',
  'GitHub Actions': 'github',
  Git: 'git',
  'VS Code': 'vscode',
  Figma: 'figma',
  Postman: 'postman',
  Swagger: 'swagger',
  Railway: 'railway',
  PyTorch: 'pytorch',
  ClickHouse: 'clickhouse',
  Zustand: 'zustand',
  WASM: 'wasm',
  Python: 'python',
  'HTML / CSS': 'html5',
  HTML: 'html5',
  CSS: 'css3',
  JWT: 'jsonwebtoken',
  Zod: 'zod',
  RabbitMQ: 'rabbitmq',
  'shadcn/ui': 'shadcn',
  Cloudinary: 'cloudinary',
  Winston: 'winston',
}

const CUSTOM_ICONS = {
  Express: ExpressIcon,
  'Express.js': ExpressIcon,
  JavaScript: JavascriptIcon,
  JWT: JwtIcon,
  'shadcn/ui': ShadcnUIIcon,
}

export default function TechStack({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((t) => {
        const iconName = ICON_MAP[t]
        const CustomIcon = CUSTOM_ICONS[t]
        const Icon = CustomIcon
          ? CustomIcon
          : iconName
            ? (props) => <StackIcon name={iconName} {...props} />
            : FaCode
        return (
          <button
            key={t}
            type="button"
            title={t}
            aria-label={t}
            className="group inline-flex items-center gap-1 rounded-[10px] border border-neutral-200 bg-neutral-50 px-2.5 py-1 hover:border-neutral-300 transition-colors duration-200"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="h-4 max-w-0 overflow-hidden font-mono text-[11px] uppercase tracking-widest text-neutral-600 opacity-0 transition-all duration-200 group-hover:max-w-[6rem] group-hover:opacity-100">
              {t}
            </span>
          </button>
        )
      })}
    </div>
  )
}