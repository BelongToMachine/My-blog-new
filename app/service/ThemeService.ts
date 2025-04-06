import { CSSProperties } from "react"

export interface PostCssProperties extends CSSProperties {
  cardBackground: string
  chartText: string
  link: string
  scrollable: string
  tableHeader: string
  tableGeneral: string
}

const style: PostCssProperties = {
  color: "var(--text-color)",
  borderColor: "var(--border-color)",
  cardBackground: "var(--card-background-color)",
  chartText: "var(--chart-text-color)",
  link: "var(--chart-link-color)",
  scrollable: "var(--scrollable-background-color)",
  background: "var(--background-color)",
  tableHeader: "var(--table-header-color)",
  tableGeneral: "var(--table-general-color)",
}

export const xTheme: Record<string, CSSProperties> = {
  /*---------------------layout----------------------*/
  layoutBackground: {
    background: style.background,
  },
  /*-----------------------/-------------------------*/
  /* latest blogs inner cell border */
  innerCellBorder: {
    borderBottom: `0.5px solid ${style.borderColor}`,
  },
  /* latest blogs card general */
  card: {
    ...style,
    background: style.cardBackground,
  },
  /*---------------------/blogs----------------------*/
  /* homepage background */
  blogBackground: {
    background: style.background,
  },
  /* table header */
  blogTableHeader: {
    background: "#2D2D2D",
    color: style.color,
  },
  /* table body */
  blogTableBody: { background: style.tableGeneral, color: style.color },
  /*--------------------/blogs/:id-------------------*/
}

export default style
