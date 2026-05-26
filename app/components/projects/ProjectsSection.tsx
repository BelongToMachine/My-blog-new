import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import {
  ChatAIIcon,
  DatabaseDollarIcon,
  HumanAgentIcon,
} from "./PixelProjectIcons"
import SectionHeading from "../system/SectionHeading"

type ProjectKey = "financial" | "uxAgent" | "aiChat"
type ProjectRoleKey = "frontend" | "fullstack"
type ProjectTrackKey = "architecture" | "aiTooling" | "agentProduct"

interface ProjectConfig {
  key: ProjectKey
  roleKey: ProjectRoleKey
  trackKey: ProjectTrackKey
  tech: string[]
  highlightsCount: number
  icon: ReactNode
}

const projects: ProjectConfig[] = [
  {
    key: "financial",
    roleKey: "frontend",
    trackKey: "architecture",
    tech: ["React", "TypeScript", "TanStack Query", "Zustand", "Vite", "MUI"],
    highlightsCount: 3,
    icon: <DatabaseDollarIcon className="h-12 w-12 text-primary md:h-14 md:w-14" />,
  },
  {
    key: "uxAgent",
    roleKey: "fullstack",
    trackKey: "aiTooling",
    tech: ["GitHub Copilot", "TypeScript", "Node.js", "CLI", "React", "MUI"],
    highlightsCount: 3,
    icon: (
      <HumanAgentIcon className="h-12 w-12 text-[hsl(var(--signal-amber))] md:h-14 md:w-14" />
    ),
  },
  {
    key: "aiChat",
    roleKey: "fullstack",
    trackKey: "agentProduct",
    tech: ["OpenAI", "React", "WebSocket", "Python"],
    highlightsCount: 3,
    icon: <ChatAIIcon className="h-12 w-12 text-[hsl(var(--signal-green))] md:h-14 md:w-14" />,
  },
]

export default async function ProjectsSection() {
  const t = await getTranslations("projects")
  const [featuredProject, ...secondaryProjects] = projects

  return (
    <section className="mb-10 space-y-5 md:mb-14 md:space-y-6">
      <div data-curve-target-anchor data-projects-heading-anchor>
        <SectionHeading title={t("heading")} align="left" className="mb-0" />
      </div>

      <div>
        <ProjectFeatureCard
          project={featuredProject}
          projectIndex="01"
          featuredLabel={t("featuredLabel")}
          roleLabel={t(`roles.${featuredProject.roleKey}`)}
          trackLabel={t(`tracks.${featuredProject.trackKey}`)}
          title={t(`${featuredProject.key}.title`)}
          description={t(`${featuredProject.key}.description`)}
          highlights={Array.from(
            { length: featuredProject.highlightsCount },
            (_, index) => t(`${featuredProject.key}.highlight${index + 1}`),
          )}
          highlightsLabel={t("highlightsLabel")}
          stackLabel={t("stackLabel")}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {secondaryProjects.map((project, index) => (
          <ProjectSupportCard
            key={project.key}
            project={project}
            projectIndex={`0${index + 2}`}
            roleLabel={t(`roles.${project.roleKey}`)}
            trackLabel={t(`tracks.${project.trackKey}`)}
            title={t(`${project.key}.title`)}
            description={t(`${project.key}.description`)}
            highlights={Array.from(
              { length: project.highlightsCount },
              (_, highlightIndex) =>
                t(`${project.key}.highlight${highlightIndex + 1}`),
            )}
            stackLabel={t("stackLabel")}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectFeatureCard({
  project,
  projectIndex,
  featuredLabel,
  roleLabel,
  trackLabel,
  title,
  description,
  highlights,
  highlightsLabel,
  stackLabel,
}: {
  project: ProjectConfig
  projectIndex: string
  featuredLabel: string
  roleLabel: string
  trackLabel: string
  title: string
  description: string
  highlights: string[]
  highlightsLabel: string
  stackLabel: string
}) {
  return (
    <article
      className="pixel-panel panel-grid overflow-hidden border border-border/80 bg-card/88 p-6 transition-colors duration-200 hover:border-primary/50 md:p-8 lg:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-3">
          <div className="font-pixel text-[10px] uppercase tracking-[0.24em] text-primary/80">
            {featuredLabel}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MetaPill>{projectIndex}</MetaPill>
            <MetaPill>{roleLabel}</MetaPill>
            <MetaPill>{trackLabel}</MetaPill>
          </div>
        </div>
        <div className="flex h-20 w-20 shrink-0 items-center justify-center border-2 border-border/70 bg-background/78 text-foreground">
          {project.icon}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-editorial max-w-[20ch] text-[clamp(1.75rem,2.6vw,2.6rem)] leading-[1.02] tracking-[-0.035em] text-foreground">
          {title}
        </h3>
        <p className="mt-4 max-w-[64ch] text-pretty text-[15px] leading-7 text-foreground/82 md:text-base md:leading-8">
          {description}
        </p>
      </div>

      <div className="mt-8 grid gap-6 border-t border-border/60 pt-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <p className="font-pixel text-[10px] uppercase tracking-[0.22em] text-primary/80">
            {highlightsLabel}
          </p>
          <div className="mt-4 space-y-3">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-3">
                <span className="mt-2 block h-1.5 w-1.5 shrink-0 bg-primary/70" />
                <span className="text-sm leading-7 text-foreground/84">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-pixel text-[10px] uppercase tracking-[0.22em] text-primary/80">
            {stackLabel}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectSupportCard({
  project,
  projectIndex,
  roleLabel,
  trackLabel,
  title,
  description,
  highlights,
  stackLabel,
}: {
  project: ProjectConfig
  projectIndex: string
  roleLabel: string
  trackLabel: string
  title: string
  description: string
  highlights: string[]
  stackLabel: string
}) {
  return (
    <article
      className="pixel-panel panel-grid overflow-hidden border border-border/80 bg-card/88 p-6 transition-colors duration-200 hover:border-primary/50 md:p-7"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <MetaPill>{projectIndex}</MetaPill>
            <MetaPill>{roleLabel}</MetaPill>
          </div>
          <p className="font-pixel text-[10px] uppercase tracking-[0.22em] text-primary/80">
            {trackLabel}
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-border/70 bg-background/78">
          {project.icon}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-editorial max-w-[16ch] text-[clamp(1.4rem,2vw,2rem)] leading-[1.06] tracking-[-0.03em] text-foreground">
          {title}
        </h3>
        <p className="mt-3 text-pretty text-[15px] leading-7 text-foreground/80">
          {description}
        </p>
      </div>

      <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
        {highlights.map((highlight) => (
          <div key={highlight} className="flex items-start gap-3">
            <span className="mt-2 block h-1.5 w-1.5 shrink-0 bg-primary/70" />
            <span className="text-sm leading-7 text-foreground/82">{highlight}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="font-pixel text-[10px] uppercase tracking-[0.22em] text-primary/80">
          {stackLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 font-pixel text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  )
}
