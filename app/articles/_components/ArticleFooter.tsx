"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import Wind from "./Wind"
import HoverWrapper from "./HoverWrapper"
import Image from "next/image"
import fan from "@/public/images/fan_8bit.png"
import styles from "@/app/articles/post.module.css"

interface ArticleFooterProps {
  initialLikes?: number
}

const ArticleFooter = ({ initialLikes = 0 }: ArticleFooterProps) => {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <div className={styles.footerWrapper}>
      {/* Module label + divider */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-border/50" />
        <span className="terminal-label">ARTICLE REACTION</span>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {/* Reaction controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => setLikes((v) => v + 1)}
        >
          LIKES ({likes})
        </Button>

        <div className="flex items-center gap-0">
          <HoverWrapper>
            <Button variant="destructive" size="sm">
              DISLIKE
            </Button>
            <Wind />
          </HoverWrapper>
          <Image src={fan} alt="a fan" height={130} width={130} className="pixelated -ml-5" />
        </div>
      </div>
    </div>
  )
}

export default ArticleFooter
