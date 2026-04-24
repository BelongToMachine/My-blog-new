# About Me Curve Handoff

这份文档记录首页 `About Me -> My Blog Summary` 之间那条像素曲线的实现逻辑。这里的代码不只是装饰，它负责把 hero 区域的 `scrollable` 背景交接到页面主体背景；如果节奏不对，就会出现两类问题：

- curve 已经收平，但 summary 还在下面追，视觉上出现大块空白。
- summary title 已经上来，但 curve 还没收平，视觉上压住标题。

相关文件：

- `app/[locale]/page.tsx`: 页面结构，`DynamicBezierCurve` 包住 `Hero`，后面接 `SummaryHeader` 和 `PostSummary`。
- `app/components/navbar/DynamicBezierCurve.tsx`: 曲线生成、滚动进度、desktop/non-desktop 两套渲染路径。
- `app/SummaryHeader.tsx`: 提供 `data-summary-heading-anchor`，用于 non-desktop 计算 summary 的真实进入点。
- `app/lib/responsive.ts`: `desktop` 断点是 `1024px`，这会影响走哪套曲线路径。

## Mental Model

这一段页面可以理解成三层：

1. Hero content
   包括 About Me 文案、代码块、头像。

2. Curve mask
   一个覆盖在页面上的 SVG path。path 的 fill 是 `BACKGROUND_COLOR`，所以它看起来像页面主体背景从下方“吃掉” hero 背景。

3. Summary content
   真正的下一段内容。它不在 `DynamicBezierCurve` 里面，而是在 hero 后面的 `Container` 里。

曲线的目标不是单纯动画好看，而是让用户滚动时看到：

```text
hero exits -> curve flattens -> summary arrives
```

这三个动作要在视觉上连成一个节奏。

## Pixel Curve Generation

`DynamicBezierCurve` 先用一条三次贝塞尔曲线生成点，再把点量化成像素台阶：

- `cubicPoint(...)`: 计算贝塞尔曲线上的 x/y。
- `quantize(...)`: 把坐标吸附到固定粒度，形成像素感。
- `getPixelCurveInstructions(...)`: 把点转换成 SVG path。

最终 path 大致像这样：

```svg
M 0,90 H 1.6 V 88.2 ... L 100,100 L 0,100 Z
```

关键不是 x，而是 y：

- `startPoint`: 左侧曲线起点。
- `firstControlPoint`: 第一个控制点。
- `secondControlPoint`: 第二个控制点。
- `endPoint`: 右侧终点。

这些值都会通过 `scrollRatio` 从 curvy value 插值到 flat value：

```ts
getInterpolatedValue(curvyValue, 0, scrollRatio)
```

所以：

- `scrollRatio = 0`: 曲线最弯。
- `scrollRatio = 1`: 曲线收平到顶部。

## Scroll Ratio

`scrollRatio` 是整个系统最重要的状态。它决定 curve 收平速度。

### Desktop

Desktop 使用 viewport height 作为滚动参考：

```ts
const baseRatio =
  pixelsScrolled / (windowHeight * DESKTOP_CURVE_FLATTEN_SCROLL_RATIO)
```

当前：

```ts
const DESKTOP_CURVE_FLATTEN_SCROLL_RATIO = 0.94
```

调参规则：

- 数值变小：curve 更早收平。
- 数值变大：curve 更晚收平。
- `1` 是原始节奏，也就是滚动约一屏时收平。

这个值只影响 `>= 1024px` 的 desktop 路径。之前 desktop 出现过 curve 稍晚、压住 `MY BLOG SUMMARY` 的情况，所以当前值略小于 `1`。

### Non-Desktop

Non-desktop 包括 mobile 和 `< 1024px` 的 tablet。它不能简单用 `scrollY / viewportHeight`，因为 hero 内容高度、头像位置、summary 进入点在不同屏幕上差异很大。

现在的逻辑是：

1. 优先找 `data-summary-heading-anchor`。
2. 用这个 anchor 的 document top 减去 sticky nav 高度 `56px`。
3. 把这个位置作为 curve 应该完成收平的目标 scroll。

核心代码形状：

```ts
const summaryAnchorTopInDocument = window.scrollY + rect.top

nonDesktopCurveTargetScrollRef.current = Math.max(
  summaryAnchorTopInDocument - NON_DESKTOP_STICKY_TOP_IN_PX,
  1
)
```

如果 summary anchor 不存在，才 fallback 到 mobile avatar；如果 avatar 也不存在，再 fallback 到 viewport height。

这点很重要：以前用 avatar bottom 做目标，会导致 curve 先收完，summary 还没上来。

## Rendering Paths

### Desktop Path

Desktop 使用：

```tsx
<div className="hidden lg:block">
```

特点：

- hero 背景层是 `fixed`。
- curve SVG 是 `fixed`。
- `placeHolder` 提供 `100vh` 的滚动空间。
- 页面后面的 summary 通过正常文档流往上滚。

这条路径的重点是 `scrollRatio` 的速度。想微调 desktop 手感，优先调 `DESKTOP_CURVE_FLATTEN_SCROLL_RATIO`。

### Non-Desktop Path

Non-desktop 使用：

```tsx
<section className="relative lg:hidden">
```

它现在和 desktop 一样，也是 fixed hero + fixed curve + placeholder：

- hero layer 固定在 navbar 下方，负责保持 About Me 内容不参与滚动。
- curve layer 固定在 hero 上方，负责用页面背景色遮罩 hero。
- `nonDesktopPlaceHolder` 提供 `100svh` 的滚动距离，让后面的 summary 正常覆盖上来。

曲线层是 fixed：

```ts
position: "fixed"
top: "3.5rem"
height: "calc(100svh - 3.5rem)"
```

这样做是为了避免 `sticky` 被父级 `100svh` 限制。之前 sticky 停留空间太短，curve 会先从视口顶部滑走，summary 还在下面追，造成明显空白。

fixed hero layer 会跟随 `isInScrollable` 和 `HERO_LAYER_HIDE_SCROLL_RATIO` 显隐。它会在 curve 视觉上接近收平时退场，避免 `TypeAnimation` 在 handoff 边界重绘时突然闪到 summary 上方。

fixed curve layer 不跟随 `isInScrollable` 隐藏。它在收平后继续作为页面背景遮罩留在内容下方；summary 和 footer 都有更高的 z-index，所以正常内容仍然会显示在 curve 上方。

## Why The Summary Anchor Exists

`SummaryHeader` 外层有：

```tsx
<div data-summary-heading-anchor>
```

这不是为了样式，而是为了给 curve 逻辑一个稳定的真实目标。

不要把这个 anchor 随手删掉。删掉后 non-desktop 会退回 avatar/viewport fallback，容易重新出现 curve 和 summary 不同步。

## Tuning Guide

常见问题和对应调法：

- Desktop 上 curve 收得太晚，压住 `MY BLOG SUMMARY`:
  降低 `DESKTOP_CURVE_FLATTEN_SCROLL_RATIO`，例如 `0.94 -> 0.9`。

- Desktop 上 curve 收得太早，summary 追上来时 curve 已经完全没了:
  提高 `DESKTOP_CURVE_FLATTEN_SCROLL_RATIO`，例如 `0.94 -> 1`。

- Mobile/tablet 出现 curve 先走、summary 下面留大空白:
  优先检查 non-desktop hero/curve layer 是否仍是 `fixed`，`nonDesktopPlaceHolder` 是否仍提供 `100svh`，以及 `data-summary-heading-anchor` 是否存在。

- Mobile/tablet summary 被 curve 压住:
  检查 `NON_DESKTOP_STICKY_TOP_IN_PX` 是否仍匹配 nav 高度。当前 nav 高度按 `3.5rem = 56px` 处理。

- `1024px` 附近行为怪:
  记住 `1024px` 已经走 desktop path，不走 non-desktop path。iPad Pro portrait 或 browser device mode 很容易踩到这个边界。

## Verification Standard

不要只看 `scrollRatio` 或 path 的 `startY`。真正的验收标准是视觉交接：

```text
curve edge should stay close to the summary heading handoff
```

肉眼标准：

- summary title 进入视口上半区时，curve 应该已经基本收平。
- curve 完全收平前，summary 不应该越过它太多。
- curve 和 summary 中间可以有少量 breathing room，但不应该出现整块空白。
- desktop、mobile、tablet 的节奏可以略有差异，但都应该像同一个交互。

如果用脚本量化，建议同时采样：

- visible curve SVG 的 path start y。
- visible curve SVG 的 viewport rect。
- `[data-summary-heading-anchor]` 的 viewport top。
- 两者之间的视觉 gap。

只采样 path start y 会误判，因为 fixed/sticky/hidden parent 都会影响实际可见位置。

## Things To Avoid

- 不要把 non-desktop hero 放回普通文档流，除非你明确想让 mobile/tablet 回到和 desktop 不同的滚动体感。
- 不要把 non-desktop curve layer 改回 sticky，除非同时重做父级滚动空间。
- 不要把 summary 的负 margin 当成主要调节点；那会影响整个 summary section，而不是 curve handoff 本身。
- 不要只在 `834px` 这类普通 tablet 宽度测；`1024px` 已经进入 desktop path。
- 不要只在 light mode 测。dark mode 下背景差异更明显，空白和遮挡会更容易暴露。
