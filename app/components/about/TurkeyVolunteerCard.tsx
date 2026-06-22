import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import DeferredFunFactImage from "./DeferredFunFactImage"
import volunteerFriendsImage from "@/public/images/fun-facts/turkey-volunteer-friends-900.webp"

export default async function TurkeyVolunteerCard({
  className,
}: {
  className?: string
}) {
  const t = await getTranslations("funFacts.volunteerTurkey")

  return (
    <article className={cn(className, "h-full overflow-hidden p-3 sm:p-4")}>
      <div className="flex h-full flex-col gap-4 bg-[linear-gradient(180deg,hsl(var(--accent))/0.18,transparent_42%)] p-1 sm:gap-5">
        <DeferredFunFactImage
          src={volunteerFriendsImage}
          alt={t("image2Alt")}
          sizes="(min-width: 768px) 44vw, 100vw"
          figureClassName="relative aspect-[16/10] shrink-0 overflow-hidden border border-border/60 bg-background/70"
          imageClassName="object-cover object-[50%_74%]"
        />

        <div className="flex flex-1 items-center justify-center px-3 py-3 text-center sm:px-5 sm:py-4">
          <p className="mx-auto max-w-[34ch] text-pretty text-[15px] leading-7 text-foreground/82 md:max-w-[64ch] md:text-[16px]">
            {t("body")}
          </p>
        </div>
      </div>
    </article>
  )
}
