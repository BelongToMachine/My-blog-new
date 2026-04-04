"use client"

import React, { Suspense, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTranslations } from "next-intl"

import ProjectTags from "./components/ProjectTags"
import ProjectsDetail from "./components/ProjectsDetail"
import { SectionHeading } from "./components/system"

const Projects = () => {
  const t = useTranslations("home")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const cardVariants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  }

  return (
    <>
      <section id="projects" className="space-y-1">
        <SectionHeading title={t("myProjects")} />
      </section>
      <div ref={ref}>
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <ProjectTags />
          <Suspense fallback={<>{t("loadingMore")}</>}>
            <ProjectsDetail />
          </Suspense>
        </motion.div>
      </div>
    </>
  )
}

export default Projects
