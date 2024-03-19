"use client";
import prisma from "@/prisma/client";
import React from "react";
import projectImage from "@/public/images/project.jpg";
import Link from "next/link";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@prisma/client";
import axios from "axios";
import { data } from "autoprefixer";
import Skeleton from "../components/Skeleton";
import { useRouter, useSearchParams } from "next/navigation";

const useProjects = () =>
  useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => axios.get("/api/projects").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

const ProjectsDetail = () => {
  const router = useRouter();
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <Skeleton />;

  if (!projects) return null;

  return (
    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 ">
      {projects.map((project) => (
        <div key={project.id}>
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
      ))}
    </div>
  );
};

export default ProjectsDetail;
