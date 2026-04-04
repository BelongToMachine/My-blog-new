import Link from "next/link"
import projectImage from "@/public/images/project.jpg"
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"
import { ActionIconButton, SurfaceCard } from "@/app/components/system"

type ProjectLink = {
  href: string | null | undefined
  label: string
  icon: typeof CodeBracketIcon
  onUnavailable?: (event: React.MouseEvent<HTMLAnchorElement>, href: string | null) => void
}

type ProjectCardProps = {
  title: string
  description: string
  imageUrl?: string | null
  primaryHref?: string | null
  links?: ProjectLink[]
  className?: string
}

const ProjectCard = ({
  title,
  description,
  imageUrl,
  primaryHref,
  links = [],
  className,
}: ProjectCardProps) => {
  const coverImage = imageUrl || projectImage.src

  return (
    <article className={cn("space-y-4", className)}>
      <SurfaceCard
        padding="none"
        interactive
        className="group relative overflow-hidden rounded-[1.75rem] border-border/80"
      >
        <div
          className="h-52 bg-cover bg-center md:h-72"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-[rgba(11,18,32,0.72)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-[rgba(7,12,20,0.76)]">
          {links.map(({ href, icon: Icon, label, onUnavailable }) => (
            <ActionIconButton
              key={label}
              asChild
              tone="subtle"
              size="lg"
              className="border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/20 hover:text-white"
            >
              <Link
                href={href || "#"}
                aria-label={label}
                onClick={(event) => onUnavailable?.(event, href ?? null)}
              >
                <Icon className="h-6 w-6" />
              </Link>
            </ActionIconButton>
          ))}
        </div>
      </SurfaceCard>

      <div className="space-y-2 text-center">
        {primaryHref ? (
          <Link
            href={primaryHref}
            className="inline-flex justify-center text-xl font-semibold tracking-tight text-primary transition-opacity hover:opacity-80"
          >
            {title}
          </Link>
        ) : (
          <h3 className="text-xl font-semibold tracking-tight text-primary">
            {title}
          </h3>
        )}
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </article>
  )
}

export default ProjectCard
