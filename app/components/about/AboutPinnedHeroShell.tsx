import { Container } from "@radix-ui/themes"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  hero: ReactNode
}

export default function AboutPinnedHeroShell({ hero, children }: Props) {
  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "hsl(var(--home-about-bridge))",
        }}
      >
        <Container>{hero}</Container>
      </section>
      {children}
    </>
  )
}
