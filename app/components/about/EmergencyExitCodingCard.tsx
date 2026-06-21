import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import emergencyExitCodingImage from "@/public/images/fun-facts/emergency-exit-coding-623.webp"

export default async function EmergencyExitCodingCard({
  className,
}: {
  className?: string
}) {
  const t = await getTranslations("funFacts.emergencyExitCoding")

  return (
    <article className={cn(className, "h-full overflow-hidden p-3 sm:p-4")}>
      <div className="flex h-full flex-col gap-3 bg-[linear-gradient(180deg,hsl(var(--accent))/0.18,transparent_42%)] p-1 sm:gap-4">
        <figure className="relative min-h-[20rem] flex-1 overflow-hidden border border-border/60 bg-background/70 sm:min-h-[22rem]">
          <Image
            src={emergencyExitCodingImage}
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 768px) 36vw, 100vw"
            className="object-cover object-[50%_16%]"
          />
        </figure>

        <div className="px-3 py-2 text-center sm:px-5 sm:py-3">
          <p className="mx-auto max-w-[30ch] text-pretty text-[15px] leading-7 text-foreground/80 md:text-[16px]">
            {t("title")}
          </p>
        </div>
      </div>
    </article>
  )
}
