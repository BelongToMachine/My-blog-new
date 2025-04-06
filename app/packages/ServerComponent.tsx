import { codeToHtml } from "shiki"
import React from "react"
import { ShikiProp } from "./shared"

export const ServerComponent = async ({
  children,
  lang,
  theme = "github-dark",
}: ShikiProp) => {
  const out = await codeToHtml(children, {
    lang,
    theme,
  })

  {
    /* 
    Usage: 
     <ServerComponent lang="ts">
        {[
          'console.log("Hello")',
          'console.log("World")',
        ].join('\n')}
      </ServerComponent>
    */
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
      dangerouslySetInnerHTML={{ __html: out }}
    />
  )
}
