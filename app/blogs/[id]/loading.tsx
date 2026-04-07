import { Box, Flex, Card, Container } from "@radix-ui/themes"
import React from "react"
import { Skeleton } from "@/app/components"

const loading = () => {
  return (
    <Container className="content-page-shell min-h-[120vh]">
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
    </Container>
  )
}

export default loading
