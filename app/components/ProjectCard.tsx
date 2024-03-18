import { Project } from "@prisma/client";
import { Card, Flex, Heading, Badge, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import projectImage from "@/public/images/project.jpg";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div>
      <div
        className="h-52 md:h-72 rounded-xl relative group border-teal-500 border-2"
        style={{
          backgroundImage: `url(${projectImage.src})`,
          backgroundSize: "cover",
        }}
      >
        <div className="broder rounded-xl overlay items-center justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-80 transition-all duration-500 ">
          <Link
            href={"/"}
            className="h-14 w-14 mr-2 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <CodeBracketIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
          </Link>
          <Link
            href={"/"}
            className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <EyeIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
          </Link>
        </div>
      </div>
      <Link href={project.link || ""}>
        <h5 className="text-xl font-semibold mb-2 text-cyan-600 text-center">
          {project.title}
        </h5>
      </Link>
      <Text>{project.content}</Text>
    </div>
  );
};

export default ProjectCard;
