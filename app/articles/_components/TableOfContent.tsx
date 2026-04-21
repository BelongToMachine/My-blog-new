import React from "react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { Heading } from "@/app/service/BlogParser"

const TableOfContent = ({ headings }: { headings: Heading[] }) => (
  <ScrollArea.Root
    className="overflow-hidden"
    style={{
      maxHeight: "60vh",
      overflow: "auto",
      maxWidth: "300px",
    }}
  >
    <div className="pixel-toc">
      <ScrollArea.Viewport className="size-full">
        <div className="px-5 py-4">
          <div className="terminal-label mb-3">目录</div>
          {headings.map((heading, index) => (
            <div
              className="pixel-toc-item"
              key={heading.id}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <a
                href={`#${heading.id}`}
                className="font-pixel text-[10px] uppercase tracking-[0.16em] transition-colors duration-200 hover:text-primary"
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
    </div>
  </ScrollArea.Root>
)

export default TableOfContent
