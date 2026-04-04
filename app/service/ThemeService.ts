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

// Transitional compatibility layer for legacy inline styles.
// New styling work should prefer semantic tokens in Tailwind/CSS over extending this file.
const style: PostCssProperties = {
  color: "hsl(var(--foreground))",
  borderColor: "hsl(var(--border))",
  cardBackground: "hsl(var(--card))",
  chartText: "hsl(var(--muted-foreground))",
  link: "hsl(var(--primary))",
  scrollable: "hsl(var(--muted))",
  background: "hsl(var(--background))",
  tableHeader: "hsl(var(--secondary))",
  tableGeneral: "hsl(var(--background))",
  tableText: "hsl(var(--foreground))",
  buttonHover: "hsl(var(--accent))",
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
  /*----------------------chatbot---------------------*/
  chatbotText: {
    color: style.color,
  },
  chatbotBackground: {
    background: style.scrollable,
  },
}

export default style
