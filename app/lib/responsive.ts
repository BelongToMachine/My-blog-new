export const BREAKPOINTS = {
  tablet: 640,
  desktop: 768,
} as const

export const isTabletViewport = (width: number) =>
  width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop

export const isDesktopViewport = (width: number) => width >= BREAKPOINTS.desktop
