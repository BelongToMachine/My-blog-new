"use client"

import dynamic from "next/dynamic"

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((module) => ({
      default: module.ReactQueryDevtools,
    })),
  {
    ssr: false,
  },
)

export default function ReactQueryDevtoolsMount() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return <ReactQueryDevtools initialIsOpen={false} />
}
