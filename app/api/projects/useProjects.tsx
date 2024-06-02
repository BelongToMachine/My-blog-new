import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
  static_image_path: string;
}

const useProjects = () =>
  useQuery<DjProject[]>({
    queryKey: ["projects"],
    queryFn: () => axios.get(getApi()).then((res) => res.data),
    staleTime: 60 * 1000, // 10 minutes
    retry: 3,
  });
export default useProjects;

const getApi = () => {
  switch (MODE) {
    case "static":
      return "/db/projects.json";
    case "dynamic":
      return API + "/projects";
    default:
      throw new Error(
        `${process.env.NEXT_PUBLIC_PRODUCTION_MODE} is not a valid mode`
      );
  }
};

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
      static_image_path: "",
    },
  ];
};

export const generateImageUrl = (project: DjProject) => {
  const imageUrl =
    MODE === "static" ? project.static_image_path : project.image_url;
  console.log(imageUrl);
  if (!imageUrl) return "/images/project.jpg";
  return imageUrl;
  // const ifExist = await ifImageValid(imageUrl);
  // console.log(ifExist);
  // return ifExist ? imageUrl : "/images/project.jpg";
};

const ifImageValid = async (url: string) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("HEAD", url, true); // Use HEAD request to get headers only
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(true); // Image URL is valid
      } else {
        resolve(false); // Image URL is invalid
      }
    };
    request.onerror = () => {
      resolve(false); // Network error or other issue
    };
    request.send();
  });
};

const API = process.env.NEXT_PUBLIC_DJANGO!;
const MODE = process.env.NEXT_PUBLIC_PRODUCTION_MODE;
