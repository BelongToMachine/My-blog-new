import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import {
  ChatAIIcon,
  DatabaseDollarIcon,
  HumanAgentIcon,
} from "./PixelProjectIcons"

const metaTextClassName =
  "text-[11px] font-medium leading-none tracking-[0.04em] text-muted-foreground"
const accentLabelClassName =
  "text-[13px] font-semibold uppercase tracking-[0.08em] text-primary/80"

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
  accentColor: "primary" | "amber" | "green"
}

const projects: ProjectConfig[] = [
  {
    key: "financial",
    roleKey: "frontend",
    trackKey: "architecture",
    tech: ["React", "TypeScript", "TanStack Query", "Zustand", "Vite", "MUI"],
    highlightsCount: 3,
    icon: <DatabaseDollarIcon className="h-12 w-12 text-primary md:h-14 md:w-14" />,
    accentColor: "primary",
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
    accentColor: "amber",
  },
  {
    key: "aiChat",
    roleKey: "fullstack",
    trackKey: "agentProduct",
    tech: ["OpenAI", "React", "WebSocket", "Python"],
    highlightsCount: 3,
    icon: <ChatAIIcon className="h-12 w-12 text-[hsl(var(--signal-green))] md:h-14 md:w-14" />,
    accentColor: "green",
  },
]

function accentBorder(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "border-[hsl(var(--signal-amber))]/30 hover:border-[hsl(var(--signal-amber))]/55"
  if (color === "green") return "border-[hsl(var(--signal-green))]/30 hover:border-[hsl(var(--signal-green))]/55"
  return "border-border/40 hover:border-primary/40"
}

function accentBar(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "bg-gradient-to-r from-[hsl(var(--signal-amber))]/60 via-[hsl(var(--signal-amber))]/30 to-transparent"
  if (color === "green") return "bg-gradient-to-r from-[hsl(var(--signal-green))]/60 via-[hsl(var(--signal-green))]/30 to-transparent"
  return ""
}

function accentBullet(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "bg-[hsl(var(--signal-amber))]/60"
  if (color === "green") return "bg-[hsl(var(--signal-green))]/60"
  return "bg-primary/60"
}

function accentText(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "!text-[hsl(var(--signal-amber))]/80"
  if (color === "green") return "!text-[hsl(var(--signal-green))]/80"
  return ""
}

export default async function ProjectsSection() {
  const t = await getTranslations("projects")
  const [featuredProject, ...secondaryProjects] = projects

  return (
    <section id="projects">
      <div className="mb-4 flex items-center gap-3 md:mb-5">
        <span className="font-pixel text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
          {t("featuredLabel")}
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      <ProjectFeatureCard
        project={featuredProject}
        projectIndex="01"
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

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
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
  roleLabel: string
  trackLabel: string
  title: string
  description: string
  highlights: string[]
  highlightsLabel: string
  stackLabel: string
}) {
  return (
    <article className="pixel-panel group relative overflow-hidden border border-border/40 bg-card/88 p-6 transition-colors duration-200 hover:border-primary/40 md:p-8 lg:p-10">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-3">
          <div className={accentLabelClassName}>
            {projectIndex}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MetaPill>{roleLabel}</MetaPill>
            <MetaPill>{trackLabel}</MetaPill>
          </div>
        </div>
        <div className="flex h-20 w-20 shrink-0 items-center justify-center border-2 border-border/50 bg-primary/5 text-foreground">
          {project.icon}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="max-w-[28ch] text-[clamp(1.75rem,2.6vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground">
          {title}
        </h3>
        <p className="mt-4 max-w-[72ch] text-pretty text-[15px] leading-[1.7] text-foreground/78 md:text-base md:leading-[1.75]">
          {description}
        </p>
      </div>

      <div className="mt-8 grid gap-6 border-t border-border/60 pt-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <p className={accentLabelClassName}>
            {highlightsLabel}
          </p>
          <div className="mt-4 space-y-3">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-2.5">
                <span className="mt-[5px] block h-4 w-[2px] shrink-0 rounded-full bg-primary/60" />
                <span className="text-[14px] leading-relaxed text-foreground/80">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className={accentLabelClassName}>
            {stackLabel}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] font-medium leading-none tracking-[0.04em] text-muted-foreground"
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
    <article className={cn(
      "pixel-panel relative overflow-hidden border bg-card/88 p-6 transition-colors duration-200 md:p-7",
      accentBorder(project.accentColor),
    )}>
      <div className={cn("absolute inset-x-0 top-0 h-[2px]", accentBar(project.accentColor))} />
      <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <MetaPill>{projectIndex}</MetaPill>
            <MetaPill>{roleLabel}</MetaPill>
          </div>
          <p className={cn(accentLabelClassName, accentText(project.accentColor))}>
            {trackLabel}
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-border/50 bg-primary/5">
          {project.icon}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="max-w-[20ch] text-[clamp(1.4rem,2vw,2rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-foreground">
          {title}
        </h3>
        <p className="mt-3 text-pretty text-[15px] leading-[1.7] text-foreground/78">
          {description}
        </p>
      </div>

      <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
        {highlights.map((highlight) => (
          <div key={highlight} className="flex items-start gap-2.5">
            <span className={cn("mt-[5px] block h-4 w-[2px] shrink-0 rounded-full", accentBullet(project.accentColor))} />
            <span className="text-[14px] leading-relaxed text-foreground/80">{highlight}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className={accentLabelClassName}>
          {stackLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] font-medium leading-none tracking-[0.04em] text-muted-foreground"
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
    <span
      className={cn(
        "inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1",
        metaTextClassName,
      )}
    >
      {children}
    </span>
  )
}