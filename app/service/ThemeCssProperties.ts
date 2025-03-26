import { CSSProperties } from "react"

export interface PostCssProperties extends CSSProperties {
    cardBackground: string,
    chartText: string
    link: string
    scrollable: string
    tableHeader: string
    tableGeneral: string
  }
  

const style : PostCssProperties = {
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
    cardBackground: "var(--card-background-color)",
    chartText: "var(--chart-text-color)",
    link: "var(--chart-link-color)",
    scrollable: "var(--scrollable-background-color)",
    background: "var(--background-color)",
    tableHeader: "var(--table-header-color)",
    tableGeneral: "var(--table-general-color)"
  }

export default style