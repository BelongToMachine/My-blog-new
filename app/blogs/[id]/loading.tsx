import { Box, Flex, Card, Container } from "@radix-ui/themes"
import React from "react"
import { Skeleton } from "@/app/components"
import style from "@/app/service/ThemeService"

const loading = () => {
  return (
    <Container
      style={{
        background: style.background,
        minHeight: "120vh",
      }}
    >
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
