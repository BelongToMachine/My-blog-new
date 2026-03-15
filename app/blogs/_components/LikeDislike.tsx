import React, { useEffect, useState } from "react"
import Wind from "../[id]/Wind"
import HoverWrapper from "./HoverWrapper"
import Image from "next/image"
import { toggleLikeFromServer } from "@/app/actions/blogAction"
import { Issue } from "@prisma/client"
import fan from "@/public/images/fan.png"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useBlogLikes from "@/app/hooks/useBlogLikes"
import Tooltip from "./Tooltip"
import { AnimatePresence, motion } from "framer-motion"
import JButton from "./JButton"

const MAX_LIKES_PER_DAY = 3

const LikeDislike = ({ issue }: { issue: Issue }) => {
  const { data: likes } = useBlogLikes(issue)
  const queryClient = useQueryClient()
  const [clientLikes, setClientLikes] = useState<number>(issue.likes)
  const [exceedDialog, setExceedDialog] = useState<boolean>(false)
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
        setClientLikes(context.previousLikes)
      }
    },

    onSuccess: () => {
      const now = new Date().getTime()

      if (!localStorage.getItem(`lastLikes${issue.id}`)) {
        const initalData = {
          count: 0,
          initialClickTime: now.toString(),
        }
        localStorage.setItem(`lastLikes${issue.id}`, JSON.stringify(initalData))
      }

      const prev = JSON.parse(localStorage.getItem(`lastLikes${issue.id}`)!)

      if (isUpdateTimeAllowed(now)) {
        const updatedData = { count: 0, initialClickTime: now.toString() }
        localStorage.setItem(
          `lastLikes${issue.id}`,
          JSON.stringify(updatedData)
        )
      }

      if (prev.count < MAX_LIKES_PER_DAY) {
        const updatedData = { ...prev, count: prev.count + 1 }
        localStorage.setItem(
          `lastLikes${issue.id}`,
          JSON.stringify(updatedData)
        )
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

  useEffect(() => {
    if (exceedDialog === true) {
      setTimeout(() => setExceedDialog(false), 3000)
    }
  }, [exceedDialog])

  const handleUpdateLikes = () => {
    if (localStorage.getItem(`lastLikes${issue.id}`)) {
      const { count } = JSON.parse(
        localStorage.getItem(`lastLikes${issue.id}`)!
      )

      if (count < MAX_LIKES_PER_DAY) {
        mutate()
      } else setExceedDialog(true)
    } else {
      mutate()
    }
  }

  const isUpdateTimeAllowed = (time: number) => {
    if (localStorage.getItem(`lastLikes${issue.id}`)) {
      const { initialClickTime } = JSON.parse(
        localStorage.getItem(`lastLikes${issue.id}`)!
      )

      if (
        initialClickTime &&
        time - parseInt(initialClickTime) < 24 * 60 * 60 * 1000
      )
        return false
    }

    return true
  }

  return (
    <div className="absolute bottom-0 flex w-full rounded-[1.5rem] border border-border/70 bg-background/80 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:bg-slate-950/60 dark:shadow-[0_18px_40px_rgba(2,6,23,0.35)]">
      <AnimatePresence>
        {exceedDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Tooltip
              text={`You can like this blog ${MAX_LIKES_PER_DAY} times a day, please come back tomorrow ^^`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <HoverWrapper>
        <JButton
          onClick={handleUpdateLikes}
          disabled={isLoading}
          attri={{
            width: "7.5rem",
            position: "relative",
            right: "0.5rem",
          }}
        >
          {isLoading ? `Liking...` : `Likes (${clientLikes})`}
        </JButton>

        <JButton
          attri={{
            width: "7.5rem",
            position: "absolute",
            right: "7.5rem",
          }}
        >
          Dislikes(0)
        </JButton>
        <Wind />
        <Image src={fan} alt="a fan" height={130} className="shrink-0" />
      </HoverWrapper>
    </div>
  )
}

export default LikeDislike
