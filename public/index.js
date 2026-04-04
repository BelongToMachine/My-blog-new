const COLORS_JIE_BLOG_THEME = {
  light: {
    primary: "#ffffff",
    text: "#16202b",
    background: "#ffffff",
    scrollableBackground: "#eef8fb",
    border: "#d6e3ea",
    cardBackground: "#ffffff",
    chartText: "#587286",
    link: "#0d7495",
    tableHeader: "#eef6fa",
    tableText: "#243746",
    tableGeneral: "#fbfdfe",
    buttonHover: "#edf4f7",
  },
  dark: {
    primary: "#0f1722",
    text: "#e7eef5",
    background: "#0b1220",
    scrollableBackground: "#101a2b",
    border: "#283548",
    cardBackground: "#111c2d",
    chartText: "#b5c7d8",
    link: "#78d3ea",
    tableHeader: "#142237",
    tableText: "#d5e3ef",
    tableGeneral: "#101a2a",
    buttonHover: "rgba(120, 211, 234, 0.12)",
  },
}

const THEME_STORAGE_KEY = "color-mode"

const GET_JIE_BLOG_CSS_PROPERTIES = function (colorMode) {
  const theme = COLORS_JIE_BLOG_THEME[colorMode]

  return {
    "--initial-color-mode": colorMode,
    "--background": colorMode === "dark" ? "210 32% 9%" : "0 0% 100%",
    "--foreground": colorMode === "dark" ? "210 40% 96%" : "212 39% 12%",
    "--card": colorMode === "dark" ? "212 30% 13%" : "0 0% 100%",
    "--card-foreground": colorMode === "dark" ? "210 40% 96%" : "212 39% 12%",
    "--popover": colorMode === "dark" ? "212 30% 13%" : "0 0% 100%",
    "--popover-foreground": colorMode === "dark" ? "210 40% 96%" : "212 39% 12%",
    "--primary": colorMode === "dark" ? "193 85% 66%" : "198 83% 34%",
    "--primary-foreground": colorMode === "dark" ? "210 32% 9%" : "0 0% 100%",
    "--secondary": colorMode === "dark" ? "212 24% 20%" : "201 71% 92%",
    "--secondary-foreground": colorMode === "dark" ? "206 35% 91%" : "198 83% 26%",
    "--muted": colorMode === "dark" ? "214 22% 17%" : "205 36% 96%",
    "--muted-foreground": colorMode === "dark" ? "213 20% 72%" : "214 18% 43%",
    "--accent": colorMode === "dark" ? "214 24% 18%" : "198 76% 94%",
    "--accent-foreground": colorMode === "dark" ? "206 35% 91%" : "198 83% 26%",
    "--destructive": colorMode === "dark" ? "0 62.8% 30.6%" : "0 84.2% 60.2%",
    "--destructive-foreground": "210 40% 98%",
    "--border": colorMode === "dark" ? "214 18% 24%" : "205 28% 88%",
    "--input": colorMode === "dark" ? "214 18% 24%" : "205 28% 88%",
    "--ring": colorMode === "dark" ? "193 85% 66%" : "198 83% 34%",
    "--text-color": theme.text,
    "--scrollable-background-color": theme.scrollableBackground,
    "--background-color": theme.background,
    "--color-primary": theme.primary,
    "--border-color": theme.border,
    "--card-background-color": theme.cardBackground,
    "--chart-text-color": theme.chartText,
    "--chart-link-color": theme.link,
    "--table-header-color": theme.tableHeader,
    "--table-general-color": theme.tableGeneral,
    "--table-text-color": theme.tableText,
    "--button-hover-color": theme.buttonHover,
  }
}

const getInitialColorMode = () => {
  const persistedColorPreference = window.localStorage.getItem(THEME_STORAGE_KEY)
  const hasPersistedPreference =
    typeof persistedColorPreference === "string" &&
    (persistedColorPreference === "light" || persistedColorPreference === "dark")

  if (hasPersistedPreference) {
    return persistedColorPreference
  }

  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  const hasMediaQueryPreference = typeof mql.matches === "boolean"

  if (hasMediaQueryPreference) {
    return mql.matches ? "dark" : "light"
  }

  return "light"
}

const applyTheme = (colorMode) => {
  const root = document.documentElement
  const properties = GET_JIE_BLOG_CSS_PROPERTIES(colorMode)

  root.classList.toggle("dark", colorMode === "dark")
  root.style.colorScheme = colorMode
  root.dataset.colorMode = colorMode

  Object.entries(properties).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

const initializeTheme = () => {
  const colorMode = getInitialColorMode()
  applyTheme(colorMode)
}

window.COLORS_JIE_BLOG_THEME = COLORS_JIE_BLOG_THEME
window.GET_JIE_BLOG_CSS_PROPERTIES = GET_JIE_BLOG_CSS_PROPERTIES

initializeTheme()
