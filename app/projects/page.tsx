import React from "react";

import { Tag } from "@prisma/client";
import prisma from "@/prisma/client";
import ProjectTags from "../components/ProjectTags";
import ProjectsDetail from "../components/ProjectsDetail";

// interface Props {
//   searchParams: { tag: Tag };
// }

const projects = async () => {
  // const definedTags = Object.values(Tag);
  // console.log(searchParams);
  // console.log("1");
  // const tag = definedTags.includes(searchParams.tag)
  //   ? searchParams.tag
  //   : undefined;
  // console.log(tag);

  // const projects = await prisma.project.findMany({
  //   where: { tag },
  // });

  return (
    <>
      <ProjectTags />
      <ProjectsDetail />
    </>
  );
};

export default projects;
