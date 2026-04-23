const BREAKPOINTS = Object.freeze({
  tablet: 768,
  desktop: 1024,
})

const screens = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([name, width]) => [name, `${width}px`])
)

module.exports = {
  BREAKPOINTS,
  screens,
}
