import { Flex, Button } from "@radix-ui/themes"
import React, { useEffect, useState } from "react"
import Wind from "../[id]/Wind"
import HoverWrapper from "./HoverWrapper"
import Image from "next/image"
import {
  toggleLikeFromServer,
  fetchBlogLikesFromServer,
} from "@/app/actions/blogAction"
import { Issue } from "@prisma/client"
import fan from "@/public/images/fan.png"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useBlogLikes from "@/app/hooks/useBlogLikes"

const LikeDislike = ({ issue }: { issue: Issue }) => {
  const { data: likes } = useBlogLikes(issue)
  const queryClient = useQueryClient()
  const [clientLikes, setClientLikes] = useState<number>(issue.likes)
  const likeOperationMutation = useMutation({
    mutationFn: () =>
      toggleLikeFromServer({
        blogId: issue.id,
        action: "like",
      }),

    onMutate: async () => {
      // Optimistic update
      setClientLikes((prev) => prev + 1)

      // To prevent unexpect query refetch from for example, "refetchOnWindowFocus" or "refetchInterval"
      await queryClient.cancelQueries({ queryKey: ["likes", issue.id] })

      // Get the snapshot of previous status
      const previousLikes = queryClient.getQueryData<number>([
        "likes",
        issue.id,
      ])

      // Update status for cache
      queryClient.setQueryData<number>(
        ["likes", issue.id],
        (old) => (old ?? 0) + 1
      )

      return { previousLikes }
    },

    onError: (error, _, context) => {
      console.error("Error updating like:", error)

      // Rollback UI changes if mutation fails
      if (context?.previousLikes) {
        queryClient.setQueryData(["likes", issue.id], context.previousLikes)
        setClientLikes(context.previousLikes!)
      }
    },

    onSettled: async () => {
      // Refetch the latest data from the server for cache
      await queryClient.invalidateQueries({ queryKey: ["likes", issue.id] })
    },
  })

  const { isLoading, mutate } = likeOperationMutation

  useEffect(() => {
    if (likes !== undefined) {
      setClientLikes(likes)
    }
  }, [likes])

  return (
    <Flex className="items-center absolute bottom-0 w-full">
      <Button
        style={{ marginRight: "10px" }}
        onClick={() => {
          mutate()
        }}
        disabled={isLoading}
      >
        Likes ({clientLikes})
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
