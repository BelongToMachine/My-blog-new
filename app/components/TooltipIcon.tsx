import React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import { RxInfoCircled } from "react-icons/rx"
import { Text } from "@radix-ui/themes"

const TooltipIcon = () => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-transparent text-[var(--chart-link-color)] transition-colors hover:border-[var(--border-color)] hover:bg-[var(--button-hover-color)]">
            <RxInfoCircled />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade max-w-xs select-none rounded-xl border border-[var(--border-color)] bg-[var(--card-background-color)] px-4 py-3 text-sm leading-relaxed text-[var(--text-color)] shadow-[0_20px_45px_-25px_rgba(3,10,18,0.55)] will-change-[transform,opacity]"
            sideOffset={5}
          >
            <Text as="p" className="text-[var(--text-color)]">
              在这里，您每天仅可发送一次邮箱
            </Text>
            <Text as="p" className="pt-2 text-[color:var(--text-color)]/78">
              想立即与我取得联系，请使用LinkedIn
            </Text>
            <Tooltip.Arrow className="fill-[var(--card-background-color)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default TooltipIcon
