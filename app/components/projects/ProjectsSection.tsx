import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
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
  highlights: string[]
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
  const secondaryProjects = projects.filter(
    (project) => !timelineProjectKeys.includes(project.key),
  )

  return (
    <section id="projects">
      <div className="mb-4 flex items-center gap-3 md:mb-5">
        <span className="font-pixel text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
          {t("featuredLabel")}
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute bottom-0 left-[27px] top-0 w-[2px] bg-border/90 sm:left-[35px] md:left-[43px]" />
        <div className="relative z-10 space-y-5">
          <ProjectTimelineCard
            period={t("stateStreet.period")}
            title={t("stateStreet.company")}
            subtitle={t("stateStreet.roleTitle")}
            description={t("stateStreet.description")}
            tags={[
              t("stateStreet.tags.ux"),
              t("stateStreet.tags.mfe"),
              t("stateStreet.tags.knowledge"),
            ]}
            projects={[]}
            contributionsLabel={t("contributionsLabel")}
            logoSrc="/icons/state-street-symbol.png"
          />
          <ProjectTimelineCard
            period={t("sscTech.period")}
            title={t("sscTech.company")}
            subtitle={t("sscTech.roleTitle")}
            description={t("sscTech.description")}
            tags={[t("sscTech.tags.architecture"), t("sscTech.tags.integration")]}
            projects={[]}
            contributionsLabel={t("contributionsLabel")}
            logoSrc="/icons/ssc-tech.png"
          />
          <ProjectTimelineCard
            period={t("xiaoAn.period")}
            title={t("xiaoAn.company")}
            subtitle={t("xiaoAn.roleTitle")}
            description={t("xiaoAn.description")}
            tags={[t("xiaoAn.tags.visualEditor"), t("xiaoAn.tags.cms")]}
            projects={[]}
            contributionsLabel={t("contributionsLabel")}
            logoSrc="/icons/xiao-an-symbol.svg"
          />
        </div>
      </div>

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
  subtitle,
  description,
  tags,
  projects,
  contributionsLabel,
  logoSrc,
}: {
  period: string
  title: string
  subtitle?: string
  description: string
  tags?: string[]
  projects: FeaturedProjectSection[]
  contributionsLabel: string
  logoSrc: string
}) {
  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)] items-stretch gap-4 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-5 md:grid-cols-[88px_minmax(0,1fr)] md:gap-6">
      <div className="relative flex justify-center">
        <div className="absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 bg-border/90 md:w-[3px]" />
      <Image
        src={logoSrc}
        alt=""
        width={36}
        height={36}
        className="hero-interactive relative z-30 mt-6 h-9 w-9 origin-center transition-transform hover:scale-[1.095] active:scale-[1.12] motion-reduce:hover:scale-100 motion-reduce:active:scale-100 md:mt-8 md:h-10 md:w-10"
        aria-hidden="true"
      />
      </div>

      <div className="group relative min-w-0">
        {/* Left border and tail share one path, so no rectangular border segment exists behind the tail. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-0 z-20 h-full w-[43px] overflow-hidden sm:hidden"
        >
          <path
            d="M41.5 34 L14 42 L41.5 50 Z"
            fill="hsl(var(--card) / 0.88)"
            stroke="none"
          />
          <path
            className="stroke-border transition-colors duration-200 group-hover:stroke-primary/40"
            d="M41.5 0 V34 L14 42 L41.5 50 V5000"
            fill="none"
            strokeWidth={3}
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
        </svg>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-0 z-20 hidden h-full w-[43px] overflow-hidden sm:block md:hidden"
        >
          <path
            d="M41.5 34 L2 42 L41.5 50 Z"
            fill="hsl(var(--card) / 0.88)"
            stroke="none"
          />
          <path
            className="stroke-border transition-colors duration-200 group-hover:stroke-primary/40"
            d="M41.5 0 V34 L2 42 L41.5 50 V5000"
            fill="none"
            strokeWidth={3}
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
        </svg>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-0 z-20 hidden h-full w-[43px] overflow-hidden md:block"
        >
          <path
            d="M41.5 52 L1.5 60 L41.5 68 Z"
            fill="hsl(var(--card) / 0.88)"
            stroke="none"
          />
          <path
            className="stroke-border transition-colors duration-200 group-hover:stroke-primary/40"
            d="M41.5 0 V52 L1.5 60 L41.5 68 V5000"
            fill="none"
            strokeWidth={3}
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
        </svg>

        <article className="relative z-10 cursor-pointer overflow-visible border-[3px] border-l-transparent border-r-border border-y-border bg-card/88 px-5 py-6 transition-colors duration-200 group-hover:border-r-primary/40 group-hover:border-y-primary/40 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="border-b border-border/60 pb-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 md:flex-nowrap">
              <h3 className="min-w-0 cursor-text text-[clamp(1.2rem,2.2vw,2rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground md:whitespace-nowrap">
                {title}
              </h3>
              <p className="shrink-0 cursor-text text-[clamp(0.85rem,1.25vw,1.1rem)] font-medium leading-none tracking-[-0.02em] text-muted-foreground/78">
                ({period})
              </p>
            </div>
            {subtitle ? (
              <p className="w-full max-w-none cursor-text text-sm font-medium leading-[1.5] text-muted-foreground/80 md:text-[15px]">
                {subtitle}
              </p>
            ) : null}
            <p className="w-full max-w-none cursor-text text-pretty text-[15px] leading-[1.7] text-foreground/78 md:text-base md:leading-[1.75]">
              {description}
            </p>
            {tags?.length ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="hero-interactive inline-flex origin-center items-center border-2 border-primary/30 bg-primary/[0.04] px-2.5 py-1.5 font-pixel text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-primary/85 transition-[transform,background-color,border-color,color] hover:scale-[1.03] hover:border-primary/70 hover:bg-primary/[0.09] hover:text-foreground active:scale-[1.08] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="mt-6 space-y-7">
            {projects.map((project, index) => (
              <section
                key={project.label}
                className={cn(index > 0 && "border-t border-border/60 pt-7")}
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h4 className="cursor-text text-[clamp(1.1rem,1.65vw,1.45rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
                    <span>{project.label}:</span>{" "}
                    <span className="text-foreground/92">{project.title}</span>
                  </h4>
                </div>

                <div className="mt-5">
                  <p className={cn(accentLabelClassName, "cursor-text")}>{contributionsLabel}</p>
                  <ol className="mt-3 space-y-3">
                    {project.highlights.map((highlight, highlightIndex) => (
                      <li
                        key={highlight}
                        className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3"
                      >
                        <span className="pt-0.5 text-[13px] font-semibold leading-none text-primary/76">
                          {highlightIndex + 1}.
                        </span>
                        <span className="cursor-text text-[14px] leading-relaxed text-foreground/80">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

              </section>
            ))}
          </div>
        ) : null}
      </article>
      </div>
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
