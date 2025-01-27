import { Flex, Button } from "@radix-ui/themes"
import React, { useState } from "react"
import Wind from "../[id]/Wind"
import HoverWrapper from "./HoverWrapper"
import Image from "next/image"
import { toggleLike } from "@/app/actions/blogAction"
import { Issue } from "@prisma/client"
import fan from "@/public/images/fan.png"

interface Props {
  issue: Issue
}

const LikeDislike = ({ issue }: Props) => {
  const [userlikes, setLikes] = useState<number>(issue.likes)
  const updateLikes = async () => {
    try {
      const updatedBlog = await toggleLike({
        blogId: issue.id,
        action: "like",
      })
      setLikes(updatedBlog!.likes)
    } catch (e) {
      console.error("Cannot update like" + e)
    }
  }
  return (
    <Flex className="items-center absolute bottom-0 w-full">
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
export default LikeDislike
