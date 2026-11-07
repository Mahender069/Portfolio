// TODO: Add a live/demo URL (`links.demo`) to a project once one exists.
export const projects = [
  {
    id: 'college-discovery',
    index: '01',
    title: 'College Discovery Platform Backend',
    tagline: 'Production-grade REST API backend for a college discovery platform built with MVC architecture and repository pattern.',
    stack: ['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'JWT', 'Zod', 'Swagger', 'Railway'],
    links: { github: 'https://github.com/Mahender069/internship_project' },
  },
  {
    id: 'blog-platform',
    index: '02',
    title: 'Modern Blog Platform',
    tagline: 'Scalable microservices-based blogging platform with content management, full-text search, media handling, and event-driven communication.',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'RabbitMQ', 'React.js', 'Tailwind CSS', 'shadcn/ui', 'Cloudinary'],
    links: { github: 'https://github.com/Mahender069/BlogApplication' },
  },
  {
    id: 'multi-agent-research-assistant',
    index: '03',
    title: 'Multi-Agent Research Assistant',
    tagline: 'Built a Python-based multi-agent research assistant using LangChain and Mistral to search, scrape, synthesize, and critique web research into structured reports.',
    stack: ['Python', 'LangChain', 'Mistral'],
    links: { github: 'https://github.com/Mahender069/multi-agent-research-assistant' },
  },
]

// TODO: Add impact-oriented detail lines for this role and any earlier roles.
export const experiences = [
  {
    id: 'iiit',
    company: 'IIIT Hyderabad',
    role: 'Research Intern — Speech Analytics',
    current: true,
    date: 'July — Present',
    location: 'Hyderabad, India',
  },
]

export const skillCategories = [
  { name: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python'] },
  { name: 'Backend', skills: ['Node.js', 'Express.js', 'FastAPI', 'RabbitMQ', 'Redis'] },
  { name: 'AI / ML', skills: ['LangChain', 'LangGraph'] },
  { name: 'Frontend', skills: ['React.js', 'Tailwind CSS', 'HTML', 'CSS'] },
  { name: 'Databases & ORM', skills: ['PostgreSQL', 'MongoDB', 'Prisma'] },
  { name: 'Tools', skills: ['Git', 'Postman', 'Swagger', 'Railway', 'VS Code', 'Neovim', 'Cursor', 'Zed'] },
]
