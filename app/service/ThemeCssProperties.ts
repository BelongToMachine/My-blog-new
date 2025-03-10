import { CSSProperties } from "react"

export interface PostCssProperties extends CSSProperties {
    cardBackground: string,
    chartText: string
    link: string
    scrollable: string
  }
  

const style : PostCssProperties = {
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
    cardBackground: "var(--card-background-color)",
    chartText: "var(--chart-text-color)",
    link: "var(--chart-link-color)",
    scrollable: "var(--scrollable-background-color)",
    background: "var(--background-color)"
  }

export default style