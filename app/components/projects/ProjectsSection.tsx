import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import {
  DatabaseDollarIcon,
  HumanAgentIcon,
} from "./PixelProjectIcons"

const metaTextClassName =
  "text-[11px] font-medium leading-none tracking-[0.04em] text-muted-foreground"
const accentLabelClassName =
  "text-[13px] font-semibold uppercase tracking-[0.08em] text-primary/76"

type ProjectKey = "financial" | "uxAgent"
type ProjectRoleKey = "frontend" | "fullstack"
type ProjectTrackKey = "architecture" | "aiTooling"

interface ProjectConfig {
  key: ProjectKey
  roleKey: ProjectRoleKey
  trackKey: ProjectTrackKey
  tech: string[]
  highlightsCount: number
  icon: ReactNode
  accentColor: "primary" | "amber" | "green"
}

interface FeaturedProjectSection {
  label: string
  title: string
  description: string
  highlights: string[]
  tech: string[]
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
      <HumanAgentIcon className="h-12 w-12 text-[hsl(var(--signal-amber))]/85 md:h-14 md:w-14" />
    ),
    accentColor: "amber",
  },
]

function accentBorder(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "border-border/40 hover:border-[hsl(var(--signal-amber))]/34"
  if (color === "green") return "border-border/40 hover:border-primary/40"
  return "border-border/40 hover:border-primary/40"
}

function accentBar(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "bg-gradient-to-r from-[hsl(var(--signal-amber))]/42 via-primary/12 to-transparent"
  if (color === "green") return "bg-gradient-to-r from-primary/66 via-primary/22 to-transparent"
  return ""
}

function accentBullet(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "bg-[hsl(var(--signal-amber))]/54"
  if (color === "green") return "bg-primary/58"
  return "bg-primary/60"
}

function accentText(color: ProjectConfig["accentColor"]) {
  if (color === "amber") return "!text-[hsl(var(--signal-amber))]/76"
  if (color === "green") return "!text-primary/78"
  return ""
}

function accentIconShell(color: ProjectConfig["accentColor"]) {
  if (color === "amber") {
    return "border-[hsl(var(--signal-amber))]/20 bg-[hsl(var(--signal-amber))]/8"
  }
  if (color === "green") return "border-primary/18 bg-primary/8"
  return "border-primary/18 bg-primary/8"
}

export default async function ProjectsSection() {
  const t = await getTranslations("projects")
  const timelineProjectKeys: ProjectKey[] = ["financial", "uxAgent"]
  const stateStreetProjects = projects.filter((project) =>
    timelineProjectKeys.includes(project.key),
  )
  const secondaryProjects = projects.filter(
    (project) => !timelineProjectKeys.includes(project.key),
  )
  const featuredProjectSections: FeaturedProjectSection[] = stateStreetProjects.map(
    (project, index) => ({
      label: t("projectLabel", { index: index + 1 }),
      title: t(`stateStreet.workstream${index + 1}`),
      description: t(`${project.key}.description`),
      highlights: Array.from(
        { length: project.highlightsCount },
        (_, highlightIndex) => t(`${project.key}.highlight${highlightIndex + 1}`),
      ),
      tech: project.tech,
    }),
  )

  return (
    <section id="projects">
      <div className="mb-4 flex items-center gap-3 md:mb-5">
        <span className="font-pixel text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
          {t("featuredLabel")}
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      <ProjectTimelineCard
        period={t("stateStreet.period")}
        title={t("stateStreet.roleTitle")}
        description={t("stateStreet.description")}
        projects={featuredProjectSections}
        contributionsLabel={t("contributionsLabel")}
        toolsUsedLabel={t("toolsUsedLabel")}
      />

      {secondaryProjects.length > 0 ? (
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
      ) : null}
    </section>
  )
}

function ProjectTimelineCard({
  period,
  title,
  description,
  projects,
  contributionsLabel,
  toolsUsedLabel,
}: {
  period: string
  title: string
  description: string
  projects: FeaturedProjectSection[]
  contributionsLabel: string
  toolsUsedLabel: string
}) {
  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)] items-stretch gap-4 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-5 md:grid-cols-[88px_minmax(0,1fr)] md:gap-6">
      <div className="relative flex justify-center">
        <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-border/70" />
        <div className="relative z-10 mt-6 flex h-12 w-12 items-center justify-center border-2 border-primary/40 bg-background md:mt-8 md:h-14 md:w-14">
          <span className="block h-3 w-3 bg-primary/78 md:h-3.5 md:w-3.5" />
        </div>
      </div>

      <article className="pixel-panel !shadow-none group relative overflow-hidden border border-border/40 bg-card/88 px-5 py-6 transition-colors duration-200 hover:border-primary/40 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="border-b border-border/60 pb-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <h3 className="max-w-[24ch] text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground">
                {title}
              </h3>
              <p className="text-[clamp(0.98rem,1.55vw,1.3rem)] font-medium leading-none tracking-[-0.02em] text-muted-foreground/78">
                ({period})
              </p>
            </div>
            <p className="max-w-[72ch] text-pretty text-[15px] leading-[1.7] text-foreground/78 md:text-base md:leading-[1.75]">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-7">
          {projects.map((project, index) => (
            <section
              key={project.label}
              className={cn(index > 0 && "border-t border-border/60 pt-7")}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h4 className="text-[clamp(1.1rem,1.65vw,1.45rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
                  <span>{project.label}:</span>{" "}
                  <span className="text-foreground/92">{project.title}</span>
                </h4>
              </div>

              <p className="mt-3 max-w-[72ch] text-pretty text-[15px] leading-[1.7] text-foreground/78 md:text-base md:leading-[1.75]">
                {project.description}
              </p>

              <div className="mt-5">
                <p className={accentLabelClassName}>{contributionsLabel}</p>
                <ol className="mt-3 space-y-3">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li
                      key={highlight}
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3"
                    >
                      <span className="pt-0.5 text-[13px] font-semibold leading-none text-primary/76">
                        {highlightIndex + 1}.
                      </span>
                      <span className="text-[14px] leading-relaxed text-foreground/80">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-5">
                <p className={accentLabelClassName}>{toolsUsedLabel}</p>
                <ul className="mt-3 grid gap-2 text-[14px] leading-relaxed text-foreground/80 sm:grid-cols-2">
                  {project.tech.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-[9px] block h-[5px] w-[5px] shrink-0 rounded-full bg-primary/62" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
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
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center border-2",
            accentIconShell(project.accentColor),
          )}
        >
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
        <p className={cn(accentLabelClassName, accentText(project.accentColor))}>
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
