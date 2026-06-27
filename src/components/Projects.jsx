import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Projects.jsx — PROJECTS array
const PROJECTS = [
  {
    id: 1,
    title: "College Discovery Platform",
    desc: "REST API for discovering and comparing Indian engineering colleges — with courses, reviews, and search. Built with Node.js, TypeScript, Express, Prisma, and PostgreSQL. Deployed on Railway with live Swagger UI.",
    tags: ["Node.js", "TypeScript", "Express", "Prisma", "PostgreSQL", "Railway"],
    color: "#8B5CF6",
    href: "https://github.com/Mahender069/internship_project",
  },
  {
    id: 2,
    title: "Modern Blog Platform",
    desc: "Scalable microservices-based blogging platform with content management, full-text search, media handling, and event-driven communication via RabbitMQ. Features independent Auth, Post, Media, and Search services behind an API Gateway.",
    tags: ["Node.js", "Express", "MongoDB", "RabbitMQ", "React", "Cloudinary"],
    color: "#F59E0B",
    href: "https://github.com/Mahender069/BlogApplication",
  },
];

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects__label",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );

      gsap.fromTo(
        ".projects__headline-word",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: { trigger: ".projects__headline", start: "top 75%" },
        },
      );

      gsap.fromTo(
        ".projects__card",
        { opacity: 0, y: 40, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".projects__grid", start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = ["Selected", "Projects"];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects relative bg-bg overflow-hidden"
    >
      <div className="min-h-screen flex flex-col justify-center py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="flex flex-col gap-6 mb-16">
            <span className="projects__label section-label block font-body text-[0.55rem] font-semibold tracking-widest uppercase text-accent">
              Projects
            </span>

            <h2 className="projects__headline font-serif font-light text-[clamp(2rem,4.5vw,4rem)] leading-[0.95] tracking-tight text-ink">
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom mr-[0.3em]"
                >
                  <span className="projects__headline-word inline-block cursor-default">
                    {i === 1 ? (
                      <em className="italic font-normal text-shimmer">
                        {word}
                      </em>
                    ) : (
                      word
                    )}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div className="projects__grid grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="projects__card group relative block rounded-lg border border-line bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
              >
                {/* Left accent border */}
                <div
                  className="absolute left-0 top-0 w-[2px] h-0 transition-all duration-500 ease-out group-hover:h-full"
                  style={{ backgroundColor: project.color }}
                />

                {/* Content */}
                <div className="relative p-6 pl-7">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-125"
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="font-display text-lg font-semibold text-ink tracking-tight transition-colors duration-300 group-hover:text-accent">
                        {project.title}
                      </h3>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-ink-light mt-0.5 transition-all duration-300 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>

                  <p className="font-body text-[0.8rem] leading-relaxed text-ink-mid mb-5">
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-hover text-[0.65rem] font-medium text-ink-light px-2.5 py-1 rounded-sm border border-line bg-bg-alt transition-all duration-300 group-hover:border-accent/25 group-hover:text-ink"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
