import React from "react"
import { ClientComponent } from "./ClientComponent"
import styled from "styled-components"

interface Props {
  colorMode: string
  code: string
}

const Container = styled.div`
  overflow: auto;
  border-radius: 16px;
`

const MacOSTaskbar = styled.div<{ colorMode: string }>`
  display: flex;
  align-items: center;
  height: 24px;
  padding: 8px 12px;
  background: ${(props) =>
    props.colorMode === "dark" ? "#2d2d2d" : "#f0f0f0"};
`

const Dot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  margin-right: 8px;
  background: ${(props) => props.color};
  border-radius: 50%;
`

export const CodeBlocker = ({ colorMode, code }: Props) => {
  return (
    <Container>
      <MacOSTaskbar colorMode={colorMode}>
        <Dot color="#ff5f57" />
        <Dot color="#ffbd2e" />
        <Dot color="#28c840" />
      </MacOSTaskbar>
      <ClientComponent lang="ts" colorMode={colorMode}>
        {code}
      </ClientComponent>
    </Container>
  )
}
