import { Project } from "@prisma/client"
import { Text } from "@radix-ui/themes"
import Link from "next/link"
import React from "react"
import projectImage from "@/public/images/project.jpg"
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline"

interface Props {
  project: Project
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="space-y-3">
      <div
        className="group relative h-52 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-background-color)] md:h-72"
        style={{
          backgroundImage: `url(${projectImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 hidden items-center justify-center rounded-2xl bg-[rgba(11,18,32,0.78)] opacity-0 transition-all duration-300 group-hover:flex group-hover:opacity-100 dark:bg-[rgba(7,12,20,0.82)]">
          <Link
            href={"/"}
            className="group/link relative mr-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-slate-100 transition-colors hover:border-[var(--chart-link-color)] hover:bg-white/15"
          >
            <CodeBracketIcon className="h-7 w-7 transition-colors group-hover/link:text-[var(--chart-link-color)]" />
          </Link>
          <Link
            href={"/"}
            className="group/link relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-slate-100 transition-colors hover:border-[var(--chart-link-color)] hover:bg-white/15"
          >
            <EyeIcon className="h-7 w-7 transition-colors group-hover/link:text-[var(--chart-link-color)]" />
          </Link>
        </div>
      </div>
      <Link href={project.link || ""}>
        <h5 className="mb-2 text-center text-xl font-semibold text-[var(--chart-link-color)] transition-opacity hover:opacity-80">
          {project.title}
        </h5>
      </Link>
      <Text className="text-[color:var(--text-color)]/80">{project.content}</Text>
    </div>
  )
}

export default ProjectCard
