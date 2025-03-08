// Note that this colors vairable should be manually sync with variable in "ThemeProvider"
window.COLORS_JIE_BLOG_THEME = {
  light: {
    primary: "#ffffff",
    text: "#000000",
    background: "#ffffff",
    scrollableBackground: "#C5EAFC",
  },
  dark: {
    primary: "#000000",
    text: "#ffffff",
    background: "#0D0F12",
    scrollableBackground: "#182939",
  },
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

  const root = document.documentElement
  root.style.setProperty(
    "--text-color",
    colorMode === "light"
      ? window.COLORS_JIE_BLOG_THEME.light.text
      : window.COLORS_JIE_BLOG_THEME.dark.text
  )
  root.style.setProperty(
    "--scrollable-background-color",
    colorMode === "light"
      ? window.COLORS_JIE_BLOG_THEME.light.scrollableBackground
      : window.COLORS_JIE_BLOG_THEME.dark.scrollableBackground
  )
  root.style.setProperty(
    "--background-color",
    colorMode === "light"
      ? window.COLORS_JIE_BLOG_THEME.light.background
      : window.COLORS_JIE_BLOG_THEME.dark.background
  )
  root.style.setProperty(
    "--color-primary",
    colorMode === "light"
      ? window.COLORS_JIE_BLOG_THEME.light.primary
      : window.COLORS_JIE_BLOG_THEME.dark.primary
  )
  root.style.setProperty("--initial-color-mode", colorMode)
}

getThemeValueBeforeHydration()
