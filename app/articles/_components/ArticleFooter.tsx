"use client"

import { useState } from "react"
import { Button } from "@radix-ui/themes"
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
      <div className="flex items-center justify-between">
        <Button onClick={() => setLikes((v) => v + 1)}>
          Likes ({likes})
        </Button>

        <div className="flex items-center gap-2">
          <HoverWrapper>
            <Button color="red" variant="soft">
              Dislike
            </Button>
            <Wind />
          </HoverWrapper>
          <Image src={fan} alt="a fan" height={130} width={130} className="pixelated" />
        </div>
      </div>
    </div>
  )
}

export default ArticleFooter