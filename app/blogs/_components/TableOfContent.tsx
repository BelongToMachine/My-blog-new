import React from "react"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { Heading } from "@/app/service/BlogParser"

const TableOfContent = ({ headings }: { headings: Heading[] }) => (
  <ScrollArea.Root
    className="overflow-hidden rounded-[0.55rem] border border-border/80 bg-background/85 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:bg-slate-950/55 dark:shadow-[0_18px_45px_rgba(2,6,23,0.35)]"
    style={{
      maxHeight: "60vh",
      overflow: "auto",
      maxWidth: "300px",
    }}
  >
    <ScrollArea.Viewport className="size-full rounded-[0.55rem]">
      <div className="px-5 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          目录
        </div>
        {headings.map((heading) => (
          <div
            className="mt-3 border-t border-border/70 pt-3 text-[13px] leading-6 text-foreground/80"
            key={heading.id}
          >
            <a
              href={`#${heading.id}`}
              className="transition-colors duration-200 hover:text-primary"
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
      <ScrollArea.Thumb className="relative flex-1 rounded-[0.35rem] bg-border before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar
      className="flex touch-none select-none bg-transparent p-0.5 transition-colors duration-[160ms] ease-out hover:bg-black/5 dark:hover:bg-white/5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      orientation="horizontal"
    >
      <ScrollArea.Thumb className="relative flex-1 rounded-[0.35rem] bg-border before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="bg-transparent" />
  </ScrollArea.Root>
)

export default TableOfContent
