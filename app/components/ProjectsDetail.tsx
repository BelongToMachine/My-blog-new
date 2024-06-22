"use client";
import "dotenv/config";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Callout, Text } from "@radix-ui/themes";
import Skeleton from "../components/Skeleton";
import useProjects, {
  DjProject,
  generateDummyProjects,
  generateImageUrl,
} from "../api/projects/useProjects";
import { useSearchParams } from "next/navigation";
import Dialog from "./Dialog";

const ProjectsDetail = () => {
  const searchParams = useSearchParams();
  const params = searchParams.get("tag");
  const ref = useRef<HTMLDialogElement>(null);
  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string | null
  ) => {
    if (!link) {
      event.preventDefault();
      ref.current!.showModal();
    }
  };

  let { data: projects, isLoading } = useProjects();

  if (isLoading) return <Skeleton />;

  projects = filterProjects(projects, params);

  if (projects?.length === 0 || !projects) {
    projects = generateDummyProjects();
  }

  return (
    <>
      <Dialog ref={ref} message="该项目的github链接/上线网址不存在..." />
      <section className="mb-16">
        <ul className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {projects?.map((project, index) => (
            <div key={index}>
              <div
                className="h-52 md:h-72 rounded-xl relative group border-teal-500 border-2"
                style={{
                  backgroundImage: `url(${generateImageUrl(project)})`,
                  backgroundSize: "cover",
                }}
              >
                <div className="border rounded-xl overlay items-center justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-80 transition-all duration-500">
                  <Link
                    href={project.repository || "#"}
                    className="h-14 w-14 mr-2 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
                    onClick={(event) =>
                      handleLinkClick(event, project.repository)
                    }
                  >
                    <CodeBracketIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover/link:text-white" />
                  </Link>
                  <Link
                    href={project.website || "#"}
                    className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
                    onClick={(event) => handleLinkClick(event, project.website)}
                  >
                    <EyeIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover/link:text-white" />
                  </Link>
                </div>
              </div>
              <Link href={project.website || ""}>
                <h5 className="text-xl font-semibold mb-2 text-cyan-600 text-center">
                  {project.title}
                </h5>
              </Link>
              <Text>{project.description}</Text>
            </div>
          ))}
        </ul>
      </section>
    </>
  );
};

const filterProjects = (
  projects: DjProject[] | undefined,
  params: string | null
) => {
  if (params === "ALL" || params === null) return projects;
  const filteredProjects = projects?.filter((project) => {
    return project.tag === params;
  });
  return filteredProjects;
};

export default ProjectsDetail;
