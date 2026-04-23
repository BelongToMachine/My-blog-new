export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const

export const isTabletViewport = (width: number) =>
  width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop

export const isDesktopViewport = (width: number) => width >= BREAKPOINTS.desktop
