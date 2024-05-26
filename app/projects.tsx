"use client";
import React, { Suspense, useEffect, useRef } from "react";
import ProjectTags from "./components/ProjectTags";
import ProjectsDetail from "./components/ProjectsDetail";
import { motion, useInView } from "framer-motion";
import { Box } from "@radix-ui/themes";

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const cardVariants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  };

  return (
    <>
      <Box id="projects" className="text-center mb-3 ">
        <h1 className="home-page-heading">Projects</h1>
      </Box>
      <div ref={ref}>
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <ProjectTags />
          <Suspense fallback={<>Loading...</>}>
            <ProjectsDetail />
          </Suspense>
        </motion.div>
      </div>
    </>
  );
};

export default Projects;
