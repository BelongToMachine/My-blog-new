"use client";
import React, { useEffect, useRef } from "react";
import ProjectTags from "./components/ProjectTags";
import ProjectsDetail from "./components/ProjectsDetail";
import { motion, useInView } from "framer-motion";

const Projects = () => {
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const cardVariants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  };

  useEffect(() => {
    console.log(isInView);
  }, [isInView]);

  return (
    <div ref={ref}>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <ProjectTags />
        <ProjectsDetail />
      </motion.div>
    </div>
  );
};

export default Projects;
