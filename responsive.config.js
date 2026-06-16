const BREAKPOINTS = Object.freeze({
  tablet: 640,
  desktop: 768,
})

const screens = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([name, width]) => [name, `${width}px`])
)

module.exports = {
  BREAKPOINTS,
  screens,
}
