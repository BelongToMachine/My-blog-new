# PostSummary Responsive Plan

## 目标

基于当前 `PostSummary` 的 desktop 实现，以及现有 pixel-retro 视觉语言，为首页 summary 区域补齐两个结构化断点：

- Mobile: `< 768`
- Tablet: `768 - 1023`
- Desktop: `>= 1024`，保留现有布局作为基线

本方案不是简单缩放 desktop，而是针对阅读密度、触控操作和信息优先级重新编排。

## 设计上下文

根据项目内的 `.impeccable.md`：

- 用户是招聘方、面试官和开发者同行
- 视觉调性是 retro-pixel technical portfolio
- 必须保留 pixel mode 的识别性，同时保证内容可扫读

因此响应式适配的核心原则是：

1. 不破坏 pixel-panel / terminal-label / pixel-heading 的品牌识别。
2. 在窄屏下优先保证标题、统计数字、文章标题可读。
3. 所有结构级变化尽量收敛到 `768` 和 `1024` 两个断点。
4. `sm` 可以继续用于微调字号和 padding，但不再承担主要布局切换职责。

## 当前实现审计

### 组件结构

- `app/[locale]/page.tsx`
  - `SummaryHeader`
  - `PostSummary`
- `app/PostSummary.tsx`
  - 左列：`BlogSummary` + `BlogChart`
  - 右列：`LatestBlogs`

### 当前布局行为

- `PostSummary.tsx`
  - 默认 `flex-col`
  - `lg` 以上切到左右两列
- `BlogSummary.tsx`
  - 当前是 `basis-full`
  - `sm` 变成两列换行
  - `lg` 才变成 3 卡并排
  - 结果：`768-1023` 区间会出现 `2 + 1` 的断裂布局
- `LatestBlogs.tsx`
  - item 默认上下堆叠
  - `md` 以上 title 和 meta 横向分布
- `ChartInner.tsx`
  - 图表高度固定为 `300`
  - `barSize=48`
  - X/Y 轴文字和左右 margin 偏 desktop 思路

### 当前最需要修正的点

1. Tablet 区间 summary 卡片是 `2 + 1`，节奏不稳定。
2. Mobile 下图表标签偏长，容易在窄屏变得拥挤。
3. Latest blog item 在 mobile 虽然会自动堆叠，但 header / badge / meta 仍有继续压缩优化的空间。
4. 当前结构切换点混用了 `sm`、`md`、`lg`，与本次要求的 `768`、`1024` 不完全一致。

## 总体布局策略

### Breakpoint 策略

| 断点 | 设备语义 | 布局策略 |
| --- | --- | --- |
| `< 768` | Mobile | 单列，垂直阅读流，优先标题和触控可达性 |
| `768 - 1023` | Tablet | 宏观单列，局部多列，保留“控制台面板”感 |
| `>= 1024` | Desktop | 保持现有左右分栏 |

### 信息优先级

在所有断点下保持以下顺序不变：

1. Summary header
2. Summary stats
3. Chart
4. Latest blogs

这样可以避免不同设备出现信息架构跳变，只在布局密度上调整。

## Mobile 设计方案 `< 768`

### 1. SummaryHeader

- 保持左对齐，不做居中。
- 缩小上下留白，避免大标题把首屏全部吃掉。
- 标题允许自然换成 2-3 行，不强行追求 desktop 的超宽单行效果。
- 描述文案限制为更紧凑的段宽，提升扫读感。

建议节奏：

- header bottom margin: `20-24px`
- title/body gap: `12px`
- description size: `14-15px`

### 2. Summary stats

目标是把三张卡片变成明确的一列，不使用 `sm` 的两列布局。

布局：

- 3 张卡片上下堆叠
- 每张卡片 full width
- 卡片高度略收紧，但数字区仍然居中

原因：

- `WEB DEVELOPMENT` 这类 label 在 pixel font 下占宽大
- touch 场景下纵向卡片更稳定，也更符合“状态面板”扫描路径

建议细节：

- 卡片内边距减到 mobile 友好的 `px-3 py-4`
- badge 保持像素风，但略缩字距，避免按钮像被挤扁
- 数字保持视觉重心，不小于当前 `text-xl`

Mobile 线框：

```text
[SYSTEM HEADING]
[MY BLOG SUMMARY]
[description]

[WEB DEVELOPMENT]
[2]
[ARTICLES]

[TECH]
[0]
[WIP]

[NON-TECH]
[0]
[CLOSED]

[CHART]

[RECENT LOGS]
[item]
[item]
```

### 3. Chart

图表在 mobile 不应复用 desktop 参数，需要单独做窄屏配置。

建议：

- 图表高度从 `300` 降到 `220-240`
- `barSize` 从 `48` 降到 `28-32`
- 压缩 `margin.left/right`
- X 轴文案做 mobile 版缩写或换行

推荐标签策略：

- `Web Development` -> `Web Dev`
- `Non-Tech` 保持 `Non-Tech`
- 或使用自定义 tick renderer 输出双行文本

同时建议：

- tooltip 保持 pixel 风格不变
- Y 轴保留，但弱化视觉存在感
- 保证图表不会因为长标签产生横向滚动

### 4. LatestBlogs

mobile 的 recent logs 应该是“标题优先、meta 次级”的阅读卡片。

建议：

- panel header 中的 action badge 换到下一行或自然 wrap，不强行右对齐顶住标题
- 每个 item 保持垂直堆叠
- title 独占第一行
- `MDX` 与日期在第二行左对齐排列
- item gap 维持 `12px`

建议交互细节：

- title 至少 `2-line clamp`，避免特别长的英文标题把 meta 顶出屏幕
- badges 保持可点击区域和边框厚度，但整体缩小一点
- panel padding 比 desktop 少一档

## Tablet 设计方案 `768 - 1023`

Tablet 不直接照搬 desktop 的左右分栏，而是采用“宏观单列，局部多列”的混合方案。

### 1. 顶层布局

`PostSummary` 仍然保持纵向堆叠，不提前切成左右两栏。

原因：

- recent blogs 的标题较长
- chart 也需要较大的可视宽度
- 如果在 `768-1023` 就强行左右分栏，两侧都会显得拥挤

因此 tablet 用法是：

1. stats 成为完整一行
2. chart 独占一行
3. latest blogs 独占一行

### 2. Summary stats

tablet 的重点是把当前 `2 + 1` 修正成稳定的 `3-up`。

布局：

- 3 张卡片单行并排
- 卡片等高
- gap 与 desktop 接近，但略收一点

建议：

- 从 `md` 开始让三张卡片都 `flex-1`
- 去掉 tablet 区间对 `sm` 两列换行的依赖
- badge 回到正常 tablet 尺寸，不需要 mobile 那么紧

Tablet 线框：

```text
[SYSTEM HEADING]
[MY BLOG SUMMARY]
[description]

[WEB DEV][TECH][NON-TECH]

[CHART....................................]

[RECENT LOGS..............................]
[long article title................][MDX][date]
[long article title................][MDX][date]
```

### 3. Chart

tablet 的图表仍应全宽展示，但比 mobile 更接近 desktop。

建议：

- 图表高度保持 `260-300`
- `barSize` 约 `36-42`
- X 轴恢复完整词组，但需要确认不会碰撞
- 若英文标题仍过长，则 tablet 也使用短标签版本

可选增强：

- 在 `md` 区间让 chart panel padding 比 mobile 多一档
- 增加顶部留白，保持与 stats row 的层级节奏

### 4. LatestBlogs

tablet 的 recent logs 可以恢复更强的“控制台表格”感觉。

建议：

- panel header 左标题右 badge
- 每个 item 用横向布局：左边标题，右边 meta
- meta 区域固定为一行，避免 badge 和日期来回跳动
- 标题区保留多行换行能力，但默认不超过 2 行

建议尺寸：

- item padding: `16-20px`
- title size: `15-16px`
- meta gap: `12px`

## Desktop 维持策略 `>= 1024`

desktop 已经具备目标视觉，不做结构重设计。

仅保留两点约束：

1. 不因 mobile/tablet 适配影响 `lg` 以上的左右比例
2. 所有新增样式必须以 `md` / `lg` 覆盖为主，保证 desktop 回退稳定

## 组件级落地建议

### `app/PostSummary.tsx`

负责定义整体断点行为：

- `< 1024` 继续 `flex-col`
- `>= 1024` 保持当前左右分栏
- gap 可以调整为 mobile 更小、tablet/desktop 更稳

建议方向：

- 不改 desktop 的 `lg:flex-row`
- 让 mobile/tablet 的垂直节奏更明确

### `app/BlogSummary.tsx`

这里是本次最关键的结构修正点。

建议改法：

- mobile: 三卡 `basis-full`
- tablet: 三卡 `md:flex-1 md:basis-0`
- desktop: 延续 tablet 排列，不再额外依赖 `lg` 才三列

也就是说，布局断点从：

- 当前：`full -> 2-up -> 3-up`

调整为：

- 目标：`full -> 3-up -> 3-up`

### `app/BlogChart.tsx` + `app/components/ChartInner.tsx`

建议把图表配置做成基于 viewport 的响应式参数，而不是一套配置全端复用。

建议响应式参数包括：

- `chartHeight`
- `barSize`
- `xTickFontSize`
- `margin`
- `labelStrategy`

优先级：

1. 先保证 mobile 不拥挤
2. 再保证 tablet 看起来不像“放大的手机图表”

### `app/LatestBlogs.tsx`

建议拆分成更明确的两层响应式：

- mobile: 标题在上，meta 在下
- tablet+: 标题和 meta 横向分布

同时补充：

- title clamp
- header badge wrap
- 更稳定的 meta 对齐方式

### `app/components/system/RetroPanel.tsx`

建议只做轻量微调：

- mobile header padding 再小一档
- content padding 按 mobile / tablet / desktop 三段节奏调整

不建议在这里引入太多页面专用规则，尽量保持为通用 panel 基础组件。

### `app/components/system/RetroStatCard.tsx`

建议集中解决：

- mobile padding
- label tracking
- value size
- badge 容量

确保三张 summary 卡在 mobile 和 tablet 下都能保持统一高度与重心。

### `app/components/system/RetroBadge.tsx`

badge 已经具备基本能力，但在 mobile 可增加一个更紧凑的尺寸策略。

推荐做法：

- 保留组件本体
- 通过调用侧传入更明确的 mobile / tablet class
- 不建议直接在组件内部写死过多响应式分支

### `app/globals.css`

可以补充少量 summary 相关 utility，但不要把页面逻辑散落到全局。

适合放入全局的只有：

- 通用 pixel typography 微调
- chart tick 公共类
- summary 区域会复用的 spacing token

## 建议实施顺序

1. 先改 `BlogSummary.tsx`，解决 tablet `2 + 1`。
2. 再改 `ChartInner.tsx`，补 mobile / tablet 参数。
3. 再改 `LatestBlogs.tsx`，整理 item 和 header 的响应式层次。
4. 最后微调 `RetroPanel` / `RetroStatCard` 的 padding 和字号。

## 验收标准

### Mobile `<768`

- 无横向滚动
- 三张 stat card 都是单列 full width
- chart 标签不重叠，不裁切
- recent logs item 中 title 与 meta 不打架
- 中文和英文文案都能正常换行

### Tablet `768-1023`

- summary 卡片固定 3 列，不出现 `2 + 1`
- chart 独占一行且视觉完整
- recent logs item 可稳定实现“左标题右 meta”
- panel 间距比 mobile 更舒展，但不提前进入 desktop 分栏

### Desktop `>=1024`

- 保持当前 screenshot 的左右布局
- 统计卡、图表、recent logs 不因新增样式发生回归

## QA 建议视口

- `375 x 812`
- `430 x 932`
- `768 x 1024`
- `834 x 1194`
- `1024 x 768`
- `1280 x 800`

同时覆盖以下内容情况：

- 2 篇文章
- 5 篇文章
- 超长英文标题
- 中文标题

## 结论

这次 responsive 适配不需要重做 desktop，而是把 `PostSummary` 从“桌面优先、局部自适应”升级为“以 768 / 1024 为明确边界的三段式响应布局”。

最关键的设计判断有两个：

1. mobile 保持单列，强调可读性和触控稳定性
2. tablet 不强行做 desktop 分栏，而是用 `3-up stats + full-width chart + full-width recent logs` 保留控制台感

这样能最大程度延续当前 screenshot 的 retro 识别度，同时避免中间断点出现拥挤和布局断裂。
