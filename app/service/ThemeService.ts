import { CSSProperties } from "react"

export interface PostCssProperties extends CSSProperties {
  cardBackground: string
  chartText: string
  link: string
  scrollable: string
  tableHeader: string
  tableGeneral: string
  tableText: string
  buttonHover: string
  accentColor: string
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
  tableText: "var(--table-text-color)",
  buttonHover: "var(--button-hover-color)",
  accentColor: "var(--accent-9)",
}

export const xTheme: Record<string, CSSProperties> = {
  /*---------------------layout----------------------*/
  layoutBackground: {
    background: style.background,
  },
  /* link element */
  linkColor: {
    color: style.link,
  },
  /*---------------------navbar----------------------*/
  iconColor: { color: style.color },
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
  /* latest blogs table inner text color */
  latestBlog_table_text: {
    color: style.tableText,
  },
  /*---------------------/blogs----------------------*/
  /* homepage background */
  blogBackground: {
    background: style.background,
  },
  /* table header */
  blogTableHeader: {
    background: style.tableHeader,
    color: style.color,
  },
  /* table body */
  blogTableBody: { background: style.tableGeneral, color: style.tableText },
  /*--------------------/blogs/:id-------------------*/
  /* like button */
  likeButton: {
    border: `1px solid ${style.borderColor}`,
    color: style.color,
  },
  likeButtonHover: {
    background: style.buttonHover,
  },
}

export default style
