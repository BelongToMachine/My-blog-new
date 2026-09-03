"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Button } from "@/app/components/ui/button"
import { RoundedButton } from "@/app/components/system/RoundedButton"
import Wind from "./Wind"
import Image from "next/image"
import fan from "@/public/images/fan_8bit-256.webp"
import styles from "@/app/articles/post.module.css"
import ctaStyles from "@/app/components/HeroButton.module.css"

interface ArticleFooterProps {
  initialLikes?: number
  label?: string
  fullWidth?: boolean
  compact?: boolean
  showHeader?: boolean
  roundedControls?: boolean
}

const ArticleFooter = ({
  initialLikes = 0,
  label,
  fullWidth = false,
  compact = false,
  showHeader = true,
  roundedControls = false,
}: ArticleFooterProps) => {
  const t = useTranslations("article")
  const [likes, setLikes] = useState(initialLikes)
  const [likeAnnouncement, setLikeAnnouncement] = useState("")
  const reactionLabel = label ?? t("reactionLabel")

  const handleLike = () => {
    const nextLikes = likes + 1
    setLikes(nextLikes)
    setLikeAnnouncement(t("likeStatus", { count: nextLikes }))
  }

  return (
    <div
      className={cn(
        styles.footerWrapper,
        fullWidth && styles.footerWrapperFullWidth,
        compact && styles.footerWrapperCompact,
      )}
    >
      {showHeader ? (
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <span className="terminal-label">{reactionLabel}</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>
      ) : null}

      {/* Reaction controls */}
      <div className={styles.footerReactions}>
        {roundedControls ? (
          <RoundedButton
            tone="hero"
            size="hero"
            className={cn(
              "relative",
              ctaStyles.giffgaffHover,
              ctaStyles.giffgaffHoverPink,
              styles.reactionButton,
              styles.roundedReactionButton,
              styles.reactionCtaButton,
              styles.likeButton,
            )}
            onClick={handleLike}
            aria-label={t("likeButton", { count: likes })}
          >
            {t("likeButton", { count: likes })}
          </RoundedButton>
        ) : (
          <Button
            variant="default"
            size="sm"
            className={cn(
              "relative",
              ctaStyles.giffgaffHover,
              ctaStyles.giffgaffHoverPink,
              styles.reactionButton,
              styles.reactionCtaButton,
              styles.likeButton,
            )}
            onClick={handleLike}
            aria-label={t("likeButton", { count: likes })}
          >
            {t("likeButton", { count: likes })}
          </Button>
        )}

        <div className={styles.windFanRig}>
          <Wind className={styles.windTrack}>
            {roundedControls ? (
              <RoundedButton
                tone="hero"
                size="hero"
                className={cn(
                  "relative",
                  ctaStyles.giffgaffHover,
                  ctaStyles.giffgaffHoverPink,
                  styles.reactionButton,
                  styles.roundedReactionButton,
                  styles.reactionCtaButton,
                  styles.dislikeButton,
                )}
                aria-label={t("dislikeButton")}
              >
                {t("dislikeButton")}
              </RoundedButton>
            ) : (
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "relative",
                  ctaStyles.giffgaffHover,
                  ctaStyles.giffgaffHoverPink,
                  styles.reactionButton,
                  styles.reactionCtaButton,
                  styles.dislikeButton,
                )}
                aria-label={t("dislikeButton")}
              >
                {t("dislikeButton")}
              </Button>
            )}
          </Wind>
          <Image
            src={fan}
            alt=""
            aria-hidden="true"
            height={130}
            width={130}
            className={`pixelated ${styles.fanImage}`}
          />
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {likeAnnouncement}
      </p>

      <p className="mt-4 max-w-[60ch] text-pretty text-center text-[15px] leading-7 text-foreground md:text-base md:leading-8">
        {t("fanDescription")}
      </p>
    </div>
  )
}

export default ArticleFooter
