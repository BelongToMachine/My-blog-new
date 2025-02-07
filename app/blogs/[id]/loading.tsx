import { Box, Flex, Card } from "@radix-ui/themes"
import React from "react"
import { Skeleton } from "@/app/components"

const loading = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton />
      <Flex className="space-x-3" my="2">
        <Skeleton width="5rem" />
        <Skeleton width="8rem" />
      </Flex>

      <Card className="prose">
        <Skeleton />
      </Card>
    </Box>
  )
}

export default loading
