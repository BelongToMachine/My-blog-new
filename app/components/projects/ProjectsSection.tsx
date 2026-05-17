import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import SectionHeading from "../system/SectionHeading"
import { DatabaseDollarIcon, HumanAgentIcon, ChatAIIcon } from "./PixelProjectIcons"

interface ProjectConfig {
  key: string
  tech: string[]
  highlightsCount: number
  icon: React.ReactNode
}

const projects: ProjectConfig[] = [
  {
    key: "financial",
    tech: ["React", "TypeScript", "TanStack Query", "Zustand", "Vite", "MUI"],
    highlightsCount: 3,
    icon: <DatabaseDollarIcon className="text-foreground/80 group-hover:text-primary transition-colors duration-200" />,
  },
  {
    key: "uxAgent",
    tech: ["GitHub Copilot", "TypeScript", "Node.js", "CLI", "React", "MUI"],
    highlightsCount: 3,
    icon: <HumanAgentIcon className="text-foreground/80 group-hover:text-primary transition-colors duration-200" />,
  },
  {
    key: "aiChat",
    tech: ["OpenAI", "React", "WebSocket", "Python"],
    highlightsCount: 3,
    icon: <ChatAIIcon className="text-foreground/80 group-hover:text-primary transition-colors duration-200" />,
  },
]

export default async function ProjectsSection() {
  const t = await getTranslations("projects")

  return (
    <section className="mb-6 space-y-4 md:mb-8 md:space-y-5">
      <div data-projects-heading-anchor>
        <SectionHeading
          title={t("heading")}
          description={t("description")}
          align="left"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {projects.map((project) => (
          <div
            key={project.key}
            className={cn(
              "pixel-panel group flex flex-col gap-4 border border-border/80 bg-card/88 p-6 transition-all duration-200",
              "hover:border-primary/60 hover:shadow-[var(--shadow-elevated)]",
              "sm:p-7",
            )}
          >
            <div className="flex h-20 w-full items-center justify-center border-b border-border/40 pb-4">
              {project.icon}
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <h3 className="font-pixel text-sm uppercase tracking-[0.16em] text-foreground transition-colors duration-200 group-hover:text-primary md:text-base">
                {t(`${project.key}.title`)}
              </h3>

              <p className="text-sm leading-[1.75] text-foreground/85 text-pretty md:text-[14px] md:leading-7">
                {t(`${project.key}.description`)}
              </p>

              <div className="space-y-2 border-t border-border/30 pt-4">
                {Array.from({ length: project.highlightsCount }, (_, i) => i + 1).map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-[4px] block h-1.5 w-1.5 shrink-0 bg-primary/60" />
                    <span className="text-[12px] leading-[1.6] text-muted-foreground/90">
                      {t(`${project.key}.highlight${i}`)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="border border-border/60 bg-background/70 px-2 py-0.5 font-pixel text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
