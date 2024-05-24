"use client";
import "dotenv/config";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "../components/Skeleton";
import { useRouter } from "next/navigation";

interface Project1 {
  id: number;
  title: string;
  description: string;
  tag: string;
  repository: string | null;
  website: string | null;
  created_at: string;
  image_url: string | null;
  is_author: boolean;
}

const ProjectsDetail = () => {
  let [projects, setProjects] = useState<Project1[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Project1[]>("http://127.0.0.1:8000/blog/projects/")
      .then((response) => {
        setProjects(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // let { data: projects, isLoading } = useProjects();

  if (isLoading) return <Skeleton />;

  if (projects?.length === 0) {
    projects = generateProjects();
  }

  return (
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
  );
};

const useProjects = () =>
  useQuery<Project1[]>({
    queryKey: ["projects"],
    queryFn: () => axios.get(API + "/projects").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

const generateProjects = (): Project1[] => [
  {
    id: -2,
    title: "N/A",
    description: "Could not find a project",
    is_author: false,
    repository: null,
    image_url: null,
    website: null,
    tag: "N/A",
    created_at: "",
  },
];

const generateImageUrl = (project: Project1): string => {
  return project.image_url || "/images/project.jpg";
};

const API = process.env.NEXT_PUBLIC_DJANGO!;

export default ProjectsDetail;
