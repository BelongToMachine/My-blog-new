# 无障碍设计评估与改造计划

> 项目：Jie's Portfolio & Blog  
> 评估日期：2026-09-03  
> 目标标准：[WCAG 2.2 AA](https://www.w3.org/TR/wcag/)  
> 评估方式：静态代码审计 + 自动化检查配置；本轮不执行浏览器、键盘或屏幕阅读器实测

## 实施状态

### 第一阶段：基础层

- [x] 增加中英文 Skip Link，并为主要内容增加稳定目标。
- [x] 增加主导航 Landmark 和当前页面 `aria-current`。
- [x] 增加全局 `focus-visible` 基线和 Pixel 按钮焦点轮廓。
- [x] 增加可访问的 link、danger、warning、success 文字 token。
- [x] 修复分页按钮、Tooltip 图标按钮和 design-system 示例的可访问名称。
- [x] 将 AI 页面内层重复 `<main>` 改为带名称的 `<section>`。
- [x] 为关键 Button、IconButton 和状态文字接入更高对比度 token。
- [x] 完成剩余页面中低透明度文字的逐组件迁移，并统一使用语义文字 token。

验证结果：`bun lint`、`bunx tsc --noEmit`、`git diff --check` 均通过。浏览器、键盘和屏幕阅读器实测尚未执行。

### 第二阶段：键盘与弹层焦点管理

- [x] 新增可复用 `useFocusTrap`，统一处理 Escape、Tab 循环、背景 inert 和关闭后焦点恢复。
- [x] MobileNav 关闭时不再暴露给屏幕阅读器，并在打开后把焦点移入导航区域。
- [x] AI 移动端会话侧栏接入焦点循环、Escape 和触发按钮焦点恢复。
- [x] 文章移动端目录接入焦点循环、Escape 和触发按钮焦点恢复。
- [x] ArticlePicker 增加 Dialog 语义、标题/描述关联、初始搜索焦点和遮罩关闭。
- [x] ThreadTitleMenu 增加方向键、Home/End、Escape 和 Tab 退出行为。
- [ ] 在真实浏览器和屏幕阅读器中验证焦点顺序与响应式切换。

### 第三阶段：联系表单语义与反馈

- [x] 将生成和发送流程改为两个语义明确的 `<form>`，支持 Enter 提交。
- [x] 为所有字段增加持久可见的 `<label>`、稳定 `id`、`name`、`required` 和合适的 `autocomplete`。
- [x] 为生成表单和邮件预览增加字段级错误、页面级错误摘要以及第一个无效字段聚焦。
- [x] 为错误字段补充 `aria-invalid`、`aria-describedby` 和本地化错误文案。
- [x] 为生成和发送按钮补充 `aria-busy`，并保留可触发校验的提交操作。
- [x] 将表单状态提示和 API 错误回退文案接入中英文翻译。
- [ ] 在真实浏览器、键盘和 VoiceOver/TalkBack 中验证提交、错误聚焦和状态播报。

验证结果：`bun lint`、`bunx tsc --noEmit`、`git diff --check` 均通过。浏览器、键盘和屏幕阅读器实测尚未执行。

### 第四阶段：AI 对话读屏模型

- [x] 将消息区域命名为 `role="log"`，关闭逐 token live 更新，并标记生成中的 `aria-busy` 状态。
- [x] 为用户、AI 助手、工具处理中、工具结果和工具错误增加明确的本地化语义。
- [x] 为生成完成增加独立的 `role="status"` 播报，避免把流式内容逐字符读出。
- [x] 为 Composer 增加本地化 label、表单名称、加载/错误状态和可见的 `focus-visible` 样式。
- [x] 为发送、取消、新建会话和加载状态补充稳定的可访问名称或状态。
- [x] 为 Workspace 制品选择控件增加 `aria-pressed`、工具栏名称和非颜色状态文字。
- [ ] 在 VoiceOver/TalkBack 中验证消息播报节奏、工具状态和取消生成后的行为。

验证结果：`bun lint`、`bunx tsc --noEmit`、`git diff --check` 均通过。浏览器、键盘和屏幕阅读器实测尚未执行。

### 第五阶段：文章阅读与交互内容

- [x] 文章标题生成稳定 slug，并让目录能够通过 hash 和 IntersectionObserver 标记当前章节。
- [x] 文章目录使用命名 navigation，当前章节使用 `aria-current="location"`。
- [x] 文章内 Tabs 统一接入 `tablist`、`tab`、`tabpanel`、方向键、Home/End 和 roving tabindex。
- [x] Copy Code 按语言输出名称，并通过 live region 播报复制成功或失败。
- [x] 博客图表增加标题和数据摘要，图表视觉层对屏幕阅读器隐藏，数据不再只依赖颜色。
- [x] 文章反馈按钮和装饰性风扇图像补充本地化名称、状态播报和正确的装饰性替代文本。
- [x] Markdown 构建阶段增加标题层级、H1 数量、图片 alt、空链接、模糊链接、裸 URL、表格表头和媒体可访问名称检查（以 warning 形式输出，不阻断既有内容构建）。
- [x] 文章原始 HTML 经过 DOM allowlist 清洗，移除脚本、事件处理器和不安全 URL，同时保留代码高亮与复制所需属性。
- [ ] 在真实浏览器、键盘和 VoiceOver/TalkBack 中验证文章目录、Tabs、复制反馈和图表摘要。

验证结果：`bun lint`、`bunx tsc --noEmit`、`git diff --check` 均通过。浏览器、键盘和屏幕阅读器实测尚未执行。

### 第六阶段：动画、触控与双语收口

- [x] Adaptive Motion 增加“跟随系统 / 完整动画 / 减少动画”站内偏好，并持久化到 localStorage。
- [x] 系统 `prefers-reduced-motion`、Save-Data/慢网络和站内偏好统一计算最终动画档位；动画组件统一读取该档位。
- [x] 站内偏好控件在常规页面 Footer 和 AI 会话侧栏提供，中英文标签完整。
- [x] 核心移动控件统一达到至少 44 × 44 CSS 像素触控目标，包括导航、关闭/删除、AI 操作、Tooltip、文章反馈和按钮组件。
- [ ] 在真实设备上验证触控间距、动画档位和双语读屏体验。

验证结果：`bun lint`、`bunx tsc --noEmit`、`git diff --check` 均通过。浏览器、键盘和屏幕阅读器实测尚未执行。

## 1. 结论

当前项目已经具备动态语言标记、语义化页面骨架、基础焦点样式、响应式布局和 `prefers-reduced-motion` 等良好基础。除人工/设备验收外，本计划中的代码、静态规则和自动化配置均已完成；仍不能仅凭静态检查宣称完整符合 WCAG 2.2 AA。

静态实现项的主要风险已经收口；当前仅剩真实浏览器、键盘、缩放和 VoiceOver/TalkBack 实测，不能仅凭静态检查宣称完整符合 WCAG 2.2 AA。

本次审计没有发现必须立即下线功能的 P0 问题。自动化 axe 用例已经配置，待在 CI 或明确的浏览器环境中执行。

## 2. 当前健康度

| 维度 | 评分 | 结论 |
|---|---:|---|
| 无障碍 | 3/4 | 静态实现已覆盖基础、键盘、表单、AI、文章和动画偏好；实测待签收 |
| 响应式 | 3/4 | 移动端布局和隐藏区域焦点策略已实现；缩放与设备实测待签收 |
| 主题系统 | 3/4 | 明暗主题和语义文字 token 已统一；最终对比度仍需实测 |
| 性能 | 3/4 | 图片、动画和动态加载处理较好 |
| 代码模式 | 4/4 | 交互、内容校验和自动化审计配置已形成可复用模式 |
| 合计 | **16/20** | 静态整改完成，等待人工验收 |

问题优先级概览（静态实现完成后的剩余工作）：

- P0 阻断性实现：0 类。
- P1/P2/P3 代码实现：本轮无未完成项。
- 剩余工作全部属于人工/设备验收：焦点顺序、读屏播报、缩放重排、触控间距和最终对比度确认。

## 3. 已有良好基础

- 根节点已经根据当前语言设置 `lang`：`app/layout.tsx`。
- Button、Input、Textarea 基础组件普遍具有 `focus-visible` 样式。
- 主要按钮尺寸合理，部分核心操作已达到 44 × 44 CSS 像素。
- 全局已经实现 `prefers-reduced-motion`：`app/globals.css`。
- 动画系统已经区分 `full`、`limited`、`reduced`，不需要推翻现有架构。
- 地图和旗帜等视觉内容已经开始使用 `role="img"` 和本地化标签。
- MobileNav 菜单按钮已有 `aria-expanded` 和 `aria-controls`。
- 邮箱错误已有部分 `aria-invalid` 和 `aria-describedby`。
- 项目已经采用 Radix UI，可以继续复用其无障碍交互基础。

## 4. P1：必须优先解决

### 4.1 重构颜色对比度体系

相关位置：

- `app/globals.css`
- `app/[locale]/ai/AIPlayground.tsx`
- `app/[locale]/ai/components/ThreadSidebar.tsx`
- 各类使用 `text-primary/*`、`text-muted-foreground/*`、`text-destructive` 的组件

静态计算发现：

- 初始 Light 主题的 `--primary` 对页面背景约为 3.44:1，不满足普通文字 4.5:1。
- 初始 Dark 主题的 `--destructive` 对页面背景约为 1.82:1。
- 初始代码中存在 `text-primary/72`、`text-muted-foreground/46` 等会进一步降低对比度的透明度写法。
- AI 页面曾存在大量 9–12px、低透明度、全大写且高字间距的文字。

改动建议：

1. 保留品牌主色作为背景、边框和装饰色。
2. 新增用途明确的文字 token：
   - `--text-link`
   - `--text-accent`
   - `--text-danger`
   - `--text-warning`
   - `--text-success`
3. 为 light 和 dark 主题分别验证这些文字 token。
4. 必要说明文字不再使用过低透明度。
5. 正文、状态和必要标签原则上不低于 12–14px。
6. 状态不能只通过红、绿、黄等颜色区分，需要文字或图标辅助。

验收标准：

- 普通文字对比度至少 4.5:1。
- 大字号文字至少 3:1。
- 控件边界、状态图标和焦点指示至少 3:1。
- light 和 dark 主题分别测试，不以其中一个主题通过代替另一个。

实施状态：已完成语义文字 token、AI/项目/关于/工作区等页面低透明度文字迁移，并保留边框、背景和装饰层的透明度；最终数值对比度仍需人工在 light/dark 主题确认。

### 4.2 修复隐藏侧栏的焦点泄漏

相关位置：

- `app/components/navbar/MobileNav.tsx`
- `app/[locale]/ai/AIPlayground.tsx`
- `app/articles/_components/ArticleDetailLayout.tsx`

当前侧栏关闭时主要通过 `transform`、`opacity` 和 `pointer-events` 移出屏幕，但内部链接和按钮仍可能进入 Tab 顺序。

改动建议：

1. 关闭时卸载内容，或使用 `hidden`/`inert` 阻止交互。
2. 打开后将焦点移动到侧栏标题、关闭按钮或第一个合理控件。
3. 支持 `Escape` 关闭。
4. 打开时将焦点限制在侧栏中。
5. 关闭后将焦点恢复到触发按钮。
6. 打开期间根据需要锁定背景滚动。
7. 抽取统一的 `AccessibleDrawer` 或基于 Radix Dialog 封装 Sheet。

验收标准：

- 关闭状态下，Tab 不会进入侧栏。
- 打开状态下，焦点不会进入遮罩背后的页面。
- Escape、遮罩点击和关闭按钮行为一致。
- 关闭后焦点回到原来的触发按钮。

### 4.3 将 ArticlePicker 改为真正的 Modal

相关位置：`app/[locale]/ai/components/ArticlePickerModal.tsx`

当前缺少：

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby`
- 初始焦点
- 焦点循环
- 背景 inert
- 关闭后的焦点恢复
- 搜索输入框的可访问标签

建议优先使用 Radix Dialog，或者封装项目级 `AccessibleDialog`。实现应遵循 [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)。

实施状态：已完成。ArticlePicker 使用命名 Dialog、`aria-modal`、标题/描述关联、初始搜索焦点、遮罩关闭、Escape、焦点循环和关闭后焦点恢复。

### 4.4 重构联系表单语义和错误反馈

相关位置：

- `app/[locale]/contact/ContactForm.tsx`
- `app/[locale]/contact/ContactFeedbackToast.tsx`

第三阶段已完成的改动：

- 生成和发送流程现在分别使用语义明确的 `<form>`，支持 Enter 提交。
- 所有字段都有持久可见的 `<label>`、稳定 `id`，并补充了 `required`、`aria-required` 和 `autocomplete`。
- 错误信息通过 `aria-describedby` 关联字段，提交失败时聚焦第一个无效字段，并提供页面级错误摘要。
- 生成和发送按钮使用 `aria-busy`，生成按钮在校验前保持可提交状态。
- 表单状态、校验文案和 API 错误回退均已接入 next-intl 的中英文消息。

待验证项：

- 在真实浏览器和键盘流程中验证 Enter 提交、错误聚焦和表单重排。
- 在 VoiceOver/TalkBack 中确认字段名称、必填状态、错误原因和 toast/status 播报顺序。

验收标准：

- 仅用键盘可以填写、生成、修改和发送邮件。
- 屏幕阅读器能够获得字段名称、必填状态、错误原因和提交结果。
- 错误不会只依赖颜色或 toast 显示。

### 4.5 为 AI 对话增加屏幕阅读器模型

相关位置：`app/[locale]/ai/AIPlayground.tsx`

第四阶段已完成的改动：

- 消息区现在使用命名的 `role="log"`，并通过 `aria-live="off"` 避免逐 token 播报。
- 用户消息、AI 助手消息、工具处理中、工具完成和工具错误均有明确语义与中英文名称。
- 生成完成后通过独立的 `role="status"` live region 播报一次，取消生成不会误报完成。
- Composer Textarea 增加本地化 label，错误使用 `role="alert"`，处理中使用 `role="status"` 和 `aria-busy`。
- 恢复 Textarea 的 `focus-visible` 焦点环，并为发送、取消、新建会话和加载状态补充可访问名称。

待验证项：

- 在 VoiceOver/TalkBack 中确认历史消息、流式完成、工具状态和错误播报顺序。
- 在键盘流程中确认取消生成、重新发送和新建会话时焦点位置稳定。

验收标准：

- 屏幕阅读器能够理解用户消息、AI 消息和工具状态。
- 流式生成期间不会逐字符轰炸 live region。
- 生成完成和失败都能得到一次明确反馈。
- 生成过程中焦点保持稳定，不被强制移动。

### 4.6 统一 Tabs 和 Menu 键盘模型

相关位置：

- `app/articles/_components/JQueryArticleExperience.tsx`
- `app/articles/_components/AiAgentInlineBlock.tsx`
- `app/articles/_components/NextjsRenderingInlineBlock.tsx`
- `app/[locale]/ai/components/ThreadTitleMenu.tsx`

Tabs 改动：

- 使用 `role="tablist"`、`role="tab"`、`role="tabpanel"`。
- 设置 `aria-selected`、`aria-controls`、`aria-labelledby`。
- 支持左右方向键、Home、End。
- 使用 roving tabindex，使 Tab 只进入当前选中项。
- 动态面板变化应保持焦点稳定。

实现参考：[WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)。

Menu 改动：

- 打开后移动焦点到第一个菜单项。
- 支持上下方向键、Home、End 和 Escape。
- 关闭后焦点返回触发按钮。
- Star 状态使用 `menuitemcheckbox` 或在名称中表达当前动作。
- 推荐使用 Radix DropdownMenu，避免维护自定义菜单状态机。

实施状态：已完成自定义 Menu 键盘模型；保留现有视觉样式，支持方向键、Home/End、Escape、Tab 退出和触发按钮焦点恢复。

### 4.7 完善页面 Landmark 和跳转结构

相关位置：

- `app/layout.tsx`
- `app/MainShell.tsx`
- `app/NavBar.tsx`
- `app/[locale]/ai/AIPlayground.tsx`

改动建议：

1. 在 `<body>` 起始位置增加“跳到主要内容”链接。
2. 为外层 `<main>` 增加稳定的 `id="main-content"`。
3. 必要时为 main 添加 `tabIndex={-1}`，确保 Skip Link 后能正确定位焦点。
4. 将 AI 页面内部嵌套的 `<main>` 改为带名称的 `<section>` 或 `<div>`。
5. 为主导航增加本地化的 `aria-label`。
6. 当前页面链接增加 `aria-current="page"`。
7. 尽量避免 Nav 在 hydration 前完全返回 `null`。

Skip Link 和 Landmark 应遵循 [WCAG 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks)。

实施状态：已完成根级 Skip Link、稳定 `main-content`、命名主导航和当前页面 `aria-current`；仅保留真实键盘/读屏顺序验证。

### 4.8 补全控件名称和键盘可见性

相关位置：

- `app/components/Pagination.tsx`
- `app/components/TooltipIcon.tsx`
- `app/[locale]/ai/components/ThreadSidebar.tsx`
- `app/design-system/page.tsx`

改动建议：

- 分页区域使用 `<nav aria-label="分页">`。
- 首页、上一页、下一页、末页按钮增加本地化 `aria-label`。
- Tooltip 图标按钮增加本地化名称。
- 装饰性 SVG 增加 `aria-hidden="true"`。
- AI 桌面删除按钮不能只在 hover 时 `display`，应同时支持 `focus-within`，或放进操作菜单。
- 删除等危险操作需要清晰名称和确认机制。

实施状态：已完成分页、Tooltip、AI 删除按钮和 design-system 示例的名称与焦点可见性；危险操作保留现有业务确认策略，待人工验证实际流程。

### 4.9 为持续动画增加站内控制

相关位置：

- `app/globals.css`
- `app/components/Hero.tsx`
- `app/components/PixelAssistantPreview.tsx`
- `app/components/about/WaveFlagCard.module.css`
- `app/articles/_components/PixelFan.module.css`

项目已经支持系统 `prefers-reduced-motion`，但 full 档仍有超过五秒的自动循环动画。根据 [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)，应为这类非必要动画提供暂停、停止或隐藏机制。

建议在现有 Adaptive Motion 系统上增加用户覆盖：

```text
系统 prefers-reduced-motion
          ↓
站内动画偏好设置
          ↓
full / limited / reduced 最终档位
```

站内选项建议为：

- 跟随系统。
- 完整动画。
- 减少动画。

设置持久化到 localStorage。无需删除现有动画，只需让用户能够控制持续运动。

实施状态：已完成。`AdaptiveMotionContext` 将系统偏好、Save-Data/慢网络和站内覆盖合并为最终档位；`MotionPreferenceControl` 在 Footer 与 AI 会话侧栏提供入口，动画组件读取统一档位。

## 5. P2：第二阶段改进

### 5.1 文章目录

- `TableOfContent` 现在使用命名的 navigation landmark（中文“目录”、英文“On this page”）。
- 当前章节由 URL hash 或 IntersectionObserver 更新，并通过 `aria-current="location"` 告知读屏用户。
- 目录滚动容器保留现有移动端 Drawer 的焦点管理。
- 待人工验证滚动位置、深链接和动态标题切换在 VoiceOver/TalkBack 中的播报体验。

### 5.2 图表和数据视觉化

相关位置：

- `app/BlogChart.tsx`
- `app/components/ChartInner.tsx`

已完成：

- 图表使用 `figure`、隐藏标题和数据摘要，并通过 `aria-labelledby` / `aria-describedby` 关联。
- 图表视觉层对读屏隐藏，摘要直接给出三组数据，因此信息不依赖颜色或坐标轴文字。
- 动态加载和 Suspense fallback 使用本地化 `role="status"`。

待改进：

- 已评估 Recharts 的 `accessibilityLayer`：当前图表视觉层明确 `aria-hidden="true"`，并由 figure 标题和数据摘要提供更稳定的文本替代，因此不额外暴露重复的 SVG accessibility tree；后续若改为可探索图表，再单独开启该层。

### 5.3 文章反应控件

相关位置：`app/articles/_components/ArticleFooter.tsx`

- Like 数量变化通过非打扰式 `role="status"` 播报。
- `LIKES`、`DISLIKE` 和反馈标题全部本地化。
- 风扇如果纯装饰，使用 `alt=""` 和 `aria-hidden="true"`。
- “会逃跑的 Dislike”在键盘聚焦、触控设备和 reduced-motion 下的稳定性仍需人工验证。

### 5.4 发音、媒体和外链

- 发音按钮通过本地化名称和 `aria-pressed` 表达播放/停止状态。
- 音频播放失败通过 `role="alert"` 和本地化错误文案播报。
- 新窗口外链在可访问名称或隐藏补充说明中提示“在新窗口打开”。
- 地图、旗帜等图像的标签描述内容，不强调“动画”属性，以免 reduced 模式下产生错误描述。

### 5.5 触控目标

WCAG 2.2 AA 要求目标至少为 24 × 24 CSS 像素，或者满足相邻间距例外。核心移动操作仍建议以 44 × 44 为项目标准。

规范参考：[WCAG 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)。

重点检查：

- 导航图标按钮。
- 删除和关闭按钮。
- AI 状态操作。
- Article Tabs。
- Tooltip 触发器。
- Footer 和文章内交互按钮。

实施状态：已完成静态尺寸收口。Button、RoundedIconButton、导航、AI 侧栏删除/关闭、ArticlePicker、Tooltip、联系反馈和发音控件在移动断点均提供至少 44 × 44 CSS 像素目标；实际间距和遮挡仍需设备实测。

### 5.6 双语无障碍文案

下列内容全部进入 next-intl：

- `aria-label`
- Modal 和 Drawer 名称
- 表单状态和错误
- “复制成功”反馈
- AI 发言人和工具状态
- 分页名称
- 主题与语言切换名称
- 外链新窗口说明

## 6. 文章内容管线

相关位置：

- `app/service/BlogParser.ts`
- `app/articles/_components/ArticleBody.tsx`
- `app/service/articleCodeHighlight.ts`

MarkdownIt 仍保留对既有内容的 HTML 解析能力，渲染结果通过 `dangerouslySetInnerHTML` 插入页面；输出会先经过 DOM allowlist 清洗。标题 id 已改为基于标题文本的稳定 slug，并对重复标题追加序号。

改动建议：

1. 标题 id 使用稳定 slug，确保目录链接和深链接不会随构建变化（已完成）。
2. 对原始 HTML 使用 DOM allowlist sanitizer（已完成）；脚本、表单控件、事件处理器和不安全 URL 会被移除，代码高亮、复制按钮和必要 ARIA/data 属性保留。
3. 构建时检查（已接入 warning，不阻断构建）：
   - 图片缺少 alt、页面 H1 数量、标题跳级和空链接文本会输出 warning。
   - 表格表头、链接“点击这里”或裸 URL、iframe/视频/音频可访问名称检查已补充。
4. Copy Code 按钮根据 locale 输出标签（已完成）。
5. 复制成功或失败通过 live region 播报（已完成）。

私有文章内容仓库位于本项目工作区之外，未纳入本次提交；生产构建读取该路径时会执行上述 warning 检查。每篇文章自身的标题层级、图片替代文本和表格质量整改仍需在内容仓库中按篇处理。
本次 `bun run build` 成功；输出的标题跳级 warning 来自该外部内容仓库的现有文章，不是应用代码或构建错误。

## 7. 实施计划

| 阶段 | 工作范围 | 主要产出 | 预估 |
|---|---|---|---:|
| 0 | 建立页面、组件、交互和颜色基线；配置 axe | 可重复的审计报告和问题基线 | 0.5–1 天 |
| 1 | 对比度 token、focus-visible、Skip Link、Landmark、图标按钮 | 全站无障碍基础层 | 1.5–2 天 |
| 2 | MobileNav、AI Sidebar、文章 TOC、Modal、Menu | 完整键盘和焦点管理 | 1.5–2 天 |
| 3 | ContactForm 标签、错误、状态与焦点 | 可独立完成的无障碍联系流程 | 1–2 天 |
| 4 | AI 消息 log、live region、composer、工具状态、Artifact 控件 | 可被读屏理解的完整 AI 对话 | 2–3 天 |
| 5 | 文章 Tabs、目录、代码复制、图表文本替代、内容 lint | 可访问的文章阅读和交互体验 | 2–3 天 |
| 6 | 动画手动档位、触控尺寸、双语文案 | 移动端和认知无障碍收口 | 1–1.5 天 |
| 7 | 浏览器、键盘、VoiceOver/TalkBack、缩放和视觉回归 | 发布验收报告 | 1.5–2 天 |

总体预估为 **10–15 个工程日**。私有文章内容整改另计，通常约每篇 0.5–1 小时。

## 8. 推荐提交批次

建议将实现拆成以下提交，避免无障碍、视觉和业务逻辑混在一个大型提交中：

1. `feat(a11y): establish accessible foundations`
2. `fix(a11y): make navigation and overlays keyboard safe`
3. `fix(a11y): improve contact form semantics and feedback`
4. `feat(a11y): add accessible AI chat announcements`
5. `fix(a11y): improve article interactions and content semantics`
6. `test(a11y): add automated accessibility checks`

## 9. 自动化与人工测试方案

### 9.1 自动化

已新增独立的 Playwright + axe 配置：`playwright.a11y.config.ts`、`tests/a11y/routes.spec.ts`，并提供 `bun test:a11y` 脚本。默认覆盖中英文首页、文章列表、联系页、AI 页和 design-system；可通过 `A11Y_ARTICLE_PATHS` 追加实际文章详情路由，通过 `A11Y_BASE_URL` 指向已启动的环境。

- 用 Bun 添加 `@axe-core/playwright`，测试只将 critical/serious axe 问题视为阻断。
- 文章详情页通过 `A11Y_ARTICLE_PATHS` 注入，避免在没有私有内容仓库的环境中伪造 slug。
- CI 可直接运行 `bun test:a11y`，并在后续接入流水线时阻止新增 critical/serious 问题。
- 保留已有问题基线时，必须明确记录并逐步减少，不能长期忽略。

自动化不能替代人工测试，尤其不能完整验证焦点顺序、读屏播报质量、文案含义和认知负担。

### 9.2 键盘测试

逐页验证：

- Tab 顺序与视觉顺序一致。
- Shift + Tab 可以正常反向移动。
- Enter 和 Space 能触发按钮。
- Escape 可以关闭 Dialog、Drawer 和 Menu。
- Tabs 支持方向键、Home 和 End。
- 没有焦点陷入页面，也没有焦点进入隐藏内容。
- 焦点不会被 sticky header、Drawer 或 Toast 遮挡。
- 所有焦点位置都具有明确可见的指示。

### 9.3 屏幕阅读器测试

最低覆盖：

- macOS Safari + VoiceOver。
- iOS Safari + VoiceOver，重点验证 production mobile。
- Android Chrome + TalkBack，至少覆盖移动导航和联系表单。
- Chrome 的 Accessibility Tree 用于辅助排查名称、角色和值。

核心流程：

1. 从导航进入首页主要内容。
2. 打开并关闭移动导航。
3. 浏览文章目录和文章标题。
4. 操作一个文章 Tabs 组件。
5. 发送一轮 AI 对话并等待流式完成。
6. 通过联系表单完成一次提交。
7. 切换主题、语言和动画偏好。

### 9.4 缩放与重排

- 200% 浏览器缩放。
- 400% 浏览器缩放。
- 320 CSS 像素宽度下检查内容重排。
- 系统大字体和文本间距覆盖。
- 横屏手机和窄高度视口。
- 不允许关键操作被裁切或只能通过双向滚动完成。

## 10. 发布验收门槛

正式发布前至少满足：

- axe 在核心页面没有 critical 或 serious 问题。
- 仅用键盘可以完成导航、文章选择、AI 对话和联系表单。
- 所有 Modal 和 Drawer 都能正确管理焦点。
- 不存在视觉隐藏但仍可 Tab 到的控件。
- 普通文字对比度至少 4.5:1。
- 控件边界和焦点指示至少 3:1。
- 200% 和 400% 缩放无关键内容丢失。
- macOS/iOS VoiceOver 可以完成核心流程。
- reduced-motion 和站内动画控制均有效。
- 中英文可访问名称与状态反馈一致。
- Pixel 风格、当前配色气质和主要动画设计得到保留。

## 11. 不在本轮范围内

- 不重新设计品牌或视觉风格。
- 不删除现有 Pixel 元素。
- 不把所有动画都改成无动画。
- 不顺带重构业务 API、数据库或 AI 模型逻辑。
- 不在无障碍提交中混入无关的字体或大范围样式重构。

完成所有 P1、P2 问题并通过验收后，再进行一次最终视觉一致性和细节检查：`/polish`。
