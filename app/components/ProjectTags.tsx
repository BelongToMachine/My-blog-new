"use client";
import { useState } from "react";
import { Box, Heading } from "@radix-ui/themes";

interface Tag {
  name: string;
  isSelected?: boolean;
}

const MyProjects = () => {
  const [tags, setTags] = useState<Tag[]>([
    { name: "All", isSelected: true },
    { name: "Full Stack" },
    { name: "Web" },
    { name: "Mobile" },
  ]);

  const handleTagClick = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.forEach((tag, i) => {
      if (i === index) {
        tag.isSelected = true;
      } else {
        tag.isSelected = false; // Deselect other tags
      }
    });
    setTags(updatedTags);
  };

  const buttonStyles = (isSelected: boolean) =>
    isSelected
      ? "text-yellow-700 border-teal-600"
      : "text-yellow-500 border-teal-400 hover:border-teal-600";

  return (
    <>
      <Box className="text-center mb-3">
        <Heading color="blue">Projects</Heading>
      </Box>
      <div className="flex justify-center items-center gap-2 py-6 text-yellow-500 font-bold">
        {tags.map((tagItem, index) => (
          <button
            key={tagItem.name}
            className={`${buttonStyles(
              tagItem.isSelected!
            )} rounded-full border-4 px-6 py-3 text-xl cursor-pointer`}
            onClick={() => handleTagClick(index)}
          >
            {tagItem.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default MyProjects;
