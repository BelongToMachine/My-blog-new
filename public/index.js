const COLORS_JIE_BLOG_THEME = {
  light: {
    primary: "#ffffff",
    text: "#000000",
    background: "#ffffff",
    scrollableBackground: "#C5EAFC",
    border: "#DDDFE6",
    cardBackground: "#ffffff",
    chartText: "#666666",
    link: "#00749E",
    tableHeader: "",
    tableText: "",
    tableGeneral: "",
    buttonHover: "#f2f2f2",
  },
  dark: {
    primary: "#182939",
    text: "#ffffff",
    background: "#1A5D78",
    scrollableBackground: "#2580A2",
    border: "#ffffff",
    cardBackground: "#182939",
    chartText: "#ffffff",
    link: "#d0ecf2",
    tableHeader: "#0d2d3a",
    tableText: "#d0ecf2",
    tableGeneral: "#123847",
    buttonHover: "rgba(255,255,255,0.1)",
  },
}

const THEME_STORAGE_KEY = "color-mode"

const GET_JIE_BLOG_CSS_PROPERTIES = function (colorMode) {
  const theme = COLORS_JIE_BLOG_THEME[colorMode]

  return {
    "--initial-color-mode": colorMode,
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

initializeTheme()
