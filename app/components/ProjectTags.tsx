"use client";
import { useState } from "react";
import { Box, Heading } from "@radix-ui/themes";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Tag {
  name: string;
  isSelected?: boolean;
}

const ProjectTags = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [tags, setTags] = useState<Tag[]>([
    { name: "All", isSelected: true },
    { name: "Full Stack" },
    { name: "Backend" },
    { name: "Frontend" },
    { name: "Mobile" },
  ]);

  const handleTagClick = (index: number) => {
    const updatedTags = [...tags];
    updateTags(updatedTags, index);
    setTags(updatedTags);
    updateRouter(tags, currentPath, router);
  };

  return (
    <>
      <div className="flex items-center md:justify-center gap-2 py-6 text-yellow-500 font-bold overflow-x-auto whitespace-nowrap">
        {tags.map((tagItem, index) => (
          <button
            key={index}
            className={`${buttonStyles(
              tagItem.isSelected!
            )} rounded-full border-4 px-8 py-3 text-xl cursor-pointer`}
            onClick={() => handleTagClick(index)}
          >
            {tagItem.name}
          </button>
        ))}
      </div>
    </>
  );
};

const updateTags = (tags: Tag[], index: number) => {
  tags.forEach((tag, i) => {
    if (i === index) {
      tag.isSelected = true;
    } else {
      tag.isSelected = false;
    }
  });
};

const updateRouter = (
  tags: Tag[],
  currentPath: string,
  router: AppRouterInstance
) => {
  const params = new URLSearchParams();
  tags.some((tag) => {
    if (tag.isSelected === true) {
      params.append("tag", tag.name);
      const query = params.size ? "?" + params.toString() : "";
      router.push(currentPath + query, { scroll: false });
    }
  });
};

const buttonStyles = (isSelected: boolean) =>
  isSelected
    ? "text-yellow-700 border-teal-600"
    : "text-yellow-500 border-teal-400 hover:border-teal-600";

export default ProjectTags;
