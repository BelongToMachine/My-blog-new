"use client"
import "dotenv/config"
import React, { useRef } from "react"
import Link from "next/link"
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline"
import { Text } from "@radix-ui/themes"
import Skeleton from "../components/Skeleton"
import useProjects, {
  DjProject,
  generateDummyProjects,
  generateImageUrl,
} from "../api/projects/useProjects"
import { useSearchParams } from "next/navigation"
import Dialog from "./Dialog"
import { useTranslations } from "next-intl"

const ProjectsDetail = () => {
  const t = useTranslations("projects")
  const searchParams = useSearchParams()
  const params = searchParams.get("tag")
  const ref = useRef<HTMLDialogElement>(null)
  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string | null
  ) => {
    if (!link) {
      event.preventDefault()
      ref.current!.showModal()
    }
  }

  let { data: projects, isLoading } = useProjects()

  if (isLoading) return <Skeleton />

  projects = filterProjects(projects, params)

  if (projects?.length === 0 || !projects) {
    projects = generateDummyProjects()
  }

  return (
    <>
      <Dialog ref={ref} message={t("noLink")} />
      <section className="mb-16">
        <ul className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {projects?.map((project, index) => (
            <div key={index} className="space-y-3">
              <div
                className="group relative h-52 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-background-color)] md:h-72"
                style={{
                  backgroundImage: `url(${generateImageUrl(project)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 hidden items-center justify-center rounded-2xl bg-[rgba(11,18,32,0.78)] opacity-0 transition-all duration-300 group-hover:flex group-hover:opacity-100 dark:bg-[rgba(7,12,20,0.82)]">
                  <Link
                    href={project.repository || "#"}
                    className="group/link relative mr-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-slate-100 transition-colors hover:border-[var(--chart-link-color)] hover:bg-white/15"
                    onClick={(event) =>
                      handleLinkClick(event, project.repository)
                    }
                  >
                    <CodeBracketIcon className="h-7 w-7 transition-colors group-hover/link:text-[var(--chart-link-color)]" />
                  </Link>
                  <Link
                    href={project.website || "#"}
                    className="group/link relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-slate-100 transition-colors hover:border-[var(--chart-link-color)] hover:bg-white/15"
                    onClick={(event) => handleLinkClick(event, project.website)}
                  >
                    <EyeIcon className="h-7 w-7 transition-colors group-hover/link:text-[var(--chart-link-color)]" />
                  </Link>
                </div>
              </div>
              <Link href={project.website || ""}>
                <h5 className="mb-2 text-center text-xl font-semibold text-[var(--chart-link-color)] transition-opacity hover:opacity-80">
                  {project.title}
                </h5>
              </Link>
              <Text className="text-[color:var(--text-color)]/80">
                {project.description}
              </Text>
            </div>
          ))}
        </ul>
      </section>
    </>
  )
}

const filterProjects = (
  projects: DjProject[] | undefined,
  params: string | null
) => {
  if (params === "ALL" || params === null) return projects
  const filteredProjects = projects?.filter((project) => {
    return project.tag === params
  })
  return filteredProjects
}

export default ProjectsDetail
