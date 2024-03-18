import prisma from "@/prisma/client";
import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectsDetail = async () => {
  const projects = await prisma.project.findMany();

  return (
    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 ">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsDetail;
