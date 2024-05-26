import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export interface DjProject {
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

const useProjects = () =>
  useQuery<DjProject[]>({
    queryKey: ["projects"],
    queryFn: () => axios.get(API + "/projects").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });
export default useProjects;

export const generateDummyProjects = (): DjProject[] => {
  return [
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
};

const API = process.env.NEXT_PUBLIC_DJANGO!;
