import Image from "next/image"

import assistantMascot from "@/public/images/pixel-ai-assistant-cat.png"

export function FloatingPixelAssistant() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1 top-[18.25rem] z-20 w-[4.75rem] select-none sm:left-2 sm:top-[19rem] sm:w-[5.5rem] md:left-0 md:top-[20rem] md:w-[6.5rem] lg:-left-14 lg:top-auto lg:bottom-0 lg:w-[7.25rem] xl:-left-16 xl:bottom-1 xl:w-[8rem]"
    >
      <Image
        src={assistantMascot}
        alt=""
        width={256}
        height={256}
        className="h-auto w-full pixelated"
        priority
      />
    </div>
  )
}
