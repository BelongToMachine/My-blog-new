"use client"

import "dotenv/config"
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline"
import React, { useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import Skeleton from "../components/Skeleton"
import useProjects, {
  DjProject,
  generateDummyProjects,
  generateImageUrl,
} from "../api/projects/useProjects"
import Dialog from "./Dialog"
import ProjectCard from "./ProjectCard"

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
      ref.current?.showModal()
    }
  }

  let { data: projects, isLoading } = useProjects()

  if (isLoading) return <Skeleton />

  projects = filterProjects(projects, params)

  if (!projects || projects.length === 0) {
    projects = generateDummyProjects()
  }

  return (
    <>
      <Dialog ref={ref} message={t("noLink")} />
      <section className="mb-16">
        <ul className="grid gap-8 lg:grid-cols-2 xl:gap-10">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard
                description={project.description}
                imageUrl={generateImageUrl(project)}
                primaryHref={project.website}
                title={project.title}
                links={[
                  {
                    href: project.repository,
                    icon: CodeBracketIcon,
                    label: "Open repository",
                    onUnavailable: (event) =>
                      handleLinkClick(event, project.repository),
                  },
                  {
                    href: project.website,
                    icon: EyeIcon,
                    label: "Open live site",
                    onUnavailable: (event) =>
                      handleLinkClick(event, project.website),
                  },
                ]}
              />
            </li>
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

  return projects?.filter((project) => project.tag === params)
}

export default ProjectsDetail
