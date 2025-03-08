const COLORS = {
  light: {
    primary: "#ffffff",
    text: "#000000",
    background: "#ffffff",
  },
  dark: {
    primary: "#000000",
    text: "#ffffff",
    background: "#000000",
  },
}

const getThemeValueBeforeHydration = () => {
  function getInitialColorMode() {
    const persistedColorPreference = window.localStorage.getItem("color-mode")
    const hasPersistedPreference =
      typeof persistedColorPreference === "string" &&
      Boolean(persistedColorPreference)
    debugger
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

  alert(colorMode)
  const root = document.documentElement
  root.style.setProperty(
    "--color-text",
    colorMode === "light" ? COLORS.light.text : COLORS.dark.text
  )
  root.style.setProperty(
    "--color-background",
    colorMode === "light" ? COLORS.light.background : COLORS.dark.background
  )
  root.style.setProperty(
    "--color-primary",
    colorMode === "light" ? COLORS.light.primary : COLORS.dark.primary
  )
  root.style.setProperty("--initial-color-mode", colorMode)
}

getThemeValueBeforeHydration()
