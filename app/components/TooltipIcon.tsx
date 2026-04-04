import React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import { RxInfoCircled } from "react-icons/rx"
import { Text } from "@radix-ui/themes"
import { ActionIconButton, SurfaceCard } from "./system"

const TooltipIcon = () => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <ActionIconButton
            type="button"
            tone="subtle"
            className="h-10 w-10 text-primary"
            aria-label="Contact form info"
          >
            <RxInfoCircled />
          </ActionIconButton>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade will-change-[transform,opacity]"
            sideOffset={5}
          >
            <SurfaceCard className="max-w-xs text-sm leading-relaxed" padding="sm">
              <Text as="p" className="text-foreground">
                在这里，您每天仅可发送一次邮箱
              </Text>
              <Text as="p" className="pt-2 text-muted-foreground">
                想立即与我取得联系，请使用LinkedIn
              </Text>
            </SurfaceCard>
            <Tooltip.Arrow className="fill-card" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default TooltipIcon
