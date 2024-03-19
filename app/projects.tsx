import React from "react";
import ProjectTags from "./components/ProjectTags";
import ProjectsDetail from "./components/ProjectsDetail";
import { Tag } from "@prisma/client";
import prisma from "@/prisma/client";

const projects = async () => {
  //   const definedTags = Object.values();
  //   const tag = definedTags.includes(searchParams.tag)
  //     ? searchParams.tag
  //     : undefined;

  //   const filteredProjects = await prisma.project.findMany({
  //     where: {
  //       tags: {
  //         some: {
  //           name: tag,
  //         },
  //       },
  //     },
  //   });

  return (
    <>
      <ProjectTags />
      <ProjectsDetail />
    </>
  );
};

export default projects;
