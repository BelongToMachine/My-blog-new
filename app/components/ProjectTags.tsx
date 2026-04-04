"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { Button } from "./ui/button"

export interface Tag {
  name: string
  link: string
  isSelected?: boolean
}

const ProjectTags = () => {
  const router = useRouter()
  const currentPath = usePathname()
  const searchParams = useSearchParams()
  const [tags, setTags] = useState<Tag[]>([
    { name: "全部", link: "ALL", isSelected: true },
    { name: "全栈", link: "FULL_STACK" },
    { name: "后端", link: "BACKEND" },
    { name: "前端", link: "FRONT_END" },
    { name: "移动端", link: "MOBILE" },
  ])

  const selectedTag = searchParams.get("tag") || "ALL"

  const handleTagClick = (index: number) => {
    const updatedTags = [...tags]
    updateTags(updatedTags, index)
    setTags(updatedTags)
    updateRouter(updatedTags, currentPath, router)
  }

  return (
      <div className="flex items-center gap-3 overflow-x-auto py-6 whitespace-nowrap md:justify-center">
        {tags.map((tagItem, index) => (
          <Button
            key={index}
            type="button"
            variant={selectedTag === tagItem.link ? "default" : "subtle"}
            className="rounded-full px-5 py-2 text-sm font-semibold sm:px-6"
            onClick={() => handleTagClick(index)}
          >
            {tagItem.name}
          </Button>
        ))}
      </div>
  )
}

const updateTags = (tags: Tag[], index: number) => {
  tags.forEach((tag, i) => {
    if (i === index) {
      tag.isSelected = true
    } else {
      tag.isSelected = false
    }
  })
}

const updateRouter = (
  tags: Tag[],
  currentPath: string,
  router: AppRouterInstance
) => {
  const params = new URLSearchParams()
  tags.some((tag) => {
    if (tag.isSelected === true) {
      params.append("tag", tag.link)
      const query = params.size ? "?" + params.toString() : ""
      router.push(currentPath + query, { scroll: false })
      return true
    }
    return false
  })
}

export default ProjectTags
