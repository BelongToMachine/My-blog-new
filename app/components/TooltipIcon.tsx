import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { RxInfoCircled } from "react-icons/rx";
import { Strong, Text } from "@radix-ui/themes";

const TooltipIcon = () => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="text-violet hover:bg-violet inline-flex h-[40px] w-[40px] items-center justify-center rounded-full bg-transparent">
            <RxInfoCircled />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
            sideOffset={5}
          >
            <Text as="p" color="red">
              You can only send me one email here per day
            </Text>
            <Text as="p" className="pt-2">
              For instant contact, find me with QQ/instagram
            </Text>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipIcon;
