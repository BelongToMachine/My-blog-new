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
  label = "ARTICLE REACTION",
  fullWidth = false,
  compact = false,
  showHeader = true,
  roundedControls = false,
}: ArticleFooterProps) => {
  const t = useTranslations("article")
  const [likes, setLikes] = useState(initialLikes)

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
          <span className="terminal-label">{label}</span>
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
            onClick={() => setLikes((v) => v + 1)}
          >
            LIKES ({likes})
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
            onClick={() => setLikes((v) => v + 1)}
          >
            LIKES ({likes})
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
              >
                DISLIKE
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
              >
                DISLIKE
              </Button>
            )}
          </Wind>
          <Image
            src={fan}
            alt="a fan"
            height={130}
            width={130}
            className={`pixelated ${styles.fanImage}`}
          />
        </div>
      </div>

      <p className="mt-4 max-w-[60ch] text-pretty text-center text-[15px] leading-7 text-foreground/82 md:text-base md:leading-8">
        {t("fanDescription")}
      </p>
    </div>
  )
}

export default ArticleFooter
