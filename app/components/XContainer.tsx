import React, { ReactNode } from "react"
import { Container } from "@radix-ui/themes"

interface Props {
  children: ReactNode
}

const XContainer = ({ children }: Props) => {
  return (
    <Container>
      <div className="container">{children}</div>
    </Container>
  )
}

export default XContainer
