"use client"

import { Flex, Button } from "@radix-ui/themes"
import { useState } from "react"
import Wind from "./Wind"
import HoverWrapper from "./HoverWrapper"
import Image from "next/image"
import fan from "@/public/images/fan.png"

interface ArticleFooterProps {
  initialLikes?: number
}

const ArticleFooter = ({ initialLikes = 0 }: ArticleFooterProps) => {
  const [userlikes, setLikes] = useState(initialLikes)

  const updateLikes = () => {
    setLikes((prev) => prev + 1)
  }

  return (
    <Flex className="items-center">
      <Button style={{ marginRight: "10px" }} onClick={updateLikes}>
        Likes ({userlikes})
      </Button>

      <HoverWrapper>
        <Button className="absolute right-24">Dislike</Button>
        <Wind />
      </HoverWrapper>

      <Image src={fan} alt="a fan" height={130} />
    </Flex>
  )
}

export default ArticleFooter