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
  },
}

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
  }
}

const getThemeValueBeforeHydration = () => {
  function getInitialColorMode() {
    const persistedColorPreference = window.localStorage.getItem("color-mode")
    const hasPersistedPreference =
      typeof persistedColorPreference === "string" &&
      Boolean(persistedColorPreference)
    // If the user has explicitly chosen light or dark,
    // let's use it. Otherwise, this value will be null.
    if (hasPersistedPreference) {
      return persistedColorPreference
    }
    // If they haven't been explicit, let's check the media query
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const hasMediaQueryPreference = typeof mql.matches === "boolean"
    if (hasMediaQueryPreference) {
      return mql.matches ? "dark" : "light"
    }
    // If they are using a browser/OS that doesn't support
    // color themes, let's default to 'light'.
    return "light"
  }

  const colorMode = getInitialColorMode()

  const properties = GET_JIE_BLOG_CSS_PROPERTIES(colorMode)

  const root = document.documentElement

  Object.entries(properties).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

getThemeValueBeforeHydration()
