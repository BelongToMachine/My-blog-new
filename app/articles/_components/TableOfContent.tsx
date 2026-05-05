import React from "react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { Heading } from "@/app/service/BlogParser"
import { cn } from "@/lib/utils"

interface TableOfContentProps {
  headings: Heading[]
  locale?: string
  className?: string
  viewportClassName?: string
}

const TOC_LABEL: Record<string, string> = {
  zh: "目录",
  en: "On this page",
}

const TableOfContent = ({ headings, locale = "zh", className, viewportClassName }: TableOfContentProps) => (
  <ScrollArea.Root
    className={cn("pixel-toc w-full max-w-[340px]", className)}
    style={{ maxHeight: "min(calc(100vh - 9.5rem), 39rem)" }}
  >
    <div className="px-5 py-4">
      <div className="font-pixel text-[14px] font-bold uppercase tracking-[0.24em] text-primary">
        {TOC_LABEL[locale] ?? TOC_LABEL.zh}
      </div>
    </div>
    <ScrollArea.Viewport
      className={cn("w-full", viewportClassName)}
      style={{ maxHeight: "calc(min(100vh - 9.5rem, 39rem) - 3.5rem)" }}
    >
      <div className="px-5 pb-4 pt-2">
        {headings.map((heading, index) => (
          <div
            className="pixel-toc-item"
            key={heading.id}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <a
              href={`#${heading.id}`}
              className="font-reading text-[14px] tracking-[0.08em] transition-colors duration-200 hover:text-primary"
            >
              {heading.text}
            </a>
          </div>
        ))}
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      className="flex touch-none select-none bg-transparent p-0.5 transition-colors duration-[160ms] ease-out hover:bg-black/5 dark:hover:bg-white/5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      orientation="vertical"
    >
      <ScrollArea.Thumb className="relative flex-1 bg-border before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar
      className="flex touch-none select-none bg-transparent p-0.5 transition-colors duration-[160ms] ease-out hover:bg-black/5 dark:hover:bg-white/5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      orientation="horizontal"
    >
      <ScrollArea.Thumb className="relative flex-1 bg-border before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="bg-transparent" />
  </ScrollArea.Root>
)

export default TableOfContent
