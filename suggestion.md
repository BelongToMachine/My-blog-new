# 渐进式样式系统重构建议

## 目标

这次重构的目标不是“一次性重写全站 UI”，而是为项目建立一个可持续演进的样式系统，让这个作品集网站在继续开发时：

- 风格统一，不再出现同语义多套视觉实现
- 页面迭代更轻松，不需要每次临时拼 class
- 保持作品集级别的精致感，而不是变成模板化后台界面
- 支持渐进迁移，避免大面积回归风险

这个项目本身是你的招聘作品，所以重构方向应该优先服务于“专业、稳定、有设计判断”的观感，而不是追求炫技式的重做。

另外，现在已经明确一件事：

- 不再需要 `Projects` 模块作为主要内容区块
- `Contact` 表单也不再作为站点保留模块

这意味着后续的样式规范化不应该再围绕 project card system 展开，而应该把重心放到仍然保留并真正影响体验的区域：

- 导航与全局壳层
- Home 的核心内容节奏
- Blog / Articles 内容系统
- AI Playground 的实验型界面

## 我对当前项目的观察

从现有代码看，样式混乱不是单一点问题，而是几个层面叠加出来的：

### 1. Token 系统分裂

项目里同时存在两套视觉变量来源：

- `app/globals.css` 里基于 Tailwind/shadcn 风格的 `--background`、`--primary`、`--border` 等 token
- 旧主题变量体系，例如 `--border-color`、`--card-background-color`、`--text-color`、`--chart-link-color`

这导致同一个组件可能同时依赖两种命名体系，例如：

- `app/NavBar.tsx`
- `app/components/TooltipIcon.tsx`
- `app/components/Dialog.tsx`
- `app/[locale]/layout.tsx`

长期看，这会让你很难回答“这个颜色/边框/卡片到底应该改哪一层”。

### 2. 组件层没有统一的视觉入口

项目已经有一组基础 UI 组件：

- `app/components/ui/button.tsx`
- `app/components/ui/input.tsx`
- `app/components/ui/card.tsx`
- `app/components/ui/textarea.tsx`

但大量页面和业务组件仍然直接手写视觉实现，尤其是：

- nav control
- status/message alert
- section heading
- overlay / floating panel
- form feedback

结果就是基础组件存在，但没有成为真正的“唯一入口”。

### 3. 相同模式重复实现

比较明显的重复点：

- 页面标题依赖 `.home-page-heading`，但其它地方又各自写了一套 heading class
- 导航在 `DesktopNav`、`MobileNav` 中分别使用了不同组件体系和不同交互语气
- 状态提示在 AI 区域、局部提示层里各写各的

这类重复很容易让后续微调变成“改一处漏三处”。

### 4. 颜色与状态存在硬编码

当前项目里仍然有不少直接写死的类名和颜色，比如：

- `text-yellow-500`
- `border-gray-300`
- `text-red-500`
- `bg-blue-500`
- `text-zinc-500`

这些写法短期方便，但会不断削弱整体风格的一致性，特别是深色模式下更容易出现不协调。

### 5. 设计系统页现在更像 demo，而不是规范

`app/design-system/page.tsx` 现在展示了按钮、输入框、颜色块和卡片，但它更像一个 playground，还没有承担以下职责：

- 定义全站设计决策
- 规定 token 命名
- 规定组件视觉层级
- 说明何时使用 Tailwind、何时用 CSS Module、何时复用 `ui` 组件

所以页面虽然存在，但还没有形成约束力。

## 建议的重构原则

### 原则 1：先统一基础语言，再改页面外观

不要先从首页、博客页大改视觉。先统一：

- color token
- spacing token
- radius token
- shadow token
- typography scale
- component variants

如果基础语言不统一，页面改完也会继续漂移。

### 原则 2：保留现有产品个性，避免“shadcn 默认站”

你的项目定位是个人作品集，不是企业后台。重构后依然应该保留：

- Hero 的个人识别度
- Blog 的内容感和技术感
- AI Playground 的实验感
- 中英双语下的精致表达

也就是说，应该统一“系统风格”，不是抹平“页面个性”。

### 原则 3：建立一条推荐样式路径

以后写组件时，应该有明确优先级：

1. 优先复用 `app/components/ui/*`
2. 基于 token 写 Tailwind class
3. 只有在复杂局部视觉场景下再用 CSS Module
4. 避免直接写裸 `style={{ ... }}`，除非必须依赖运行时值

### 原则 4：重构必须可阶段验收

每个阶段都要能单独完成并立即获益，而不是必须全站改完才有价值。

### 原则 5：不再围绕已下线模块建立系统

既然 `Projects` 模块已经不再需要，就不要继续把它当成设计系统试点、通用卡片模板来源或页面优先级核心。

后续的系统抽象应该来自仍然活跃的场景，比如：

- 导航控件
- 内容页壳层
- section heading
- 浮层与提示

## 推荐的渐进式路线图

## Phase 0：建立规范文档和目录边界

目标：先让“以后该怎么写”变清楚。

建议动作：

- 把 `app/design-system/page.tsx` 升级成项目内部设计规范入口
- 新增一份简短的样式约定文档，例如 `docs/ui-guidelines.md`
- 明确组件分层

推荐分层：

- `app/components/ui/*`
  - 最基础、可复用、与业务无关的原子组件
- `app/components/system/*`
  - 面向本站的通用组合组件，例如 `SectionHeading`、`SurfaceCard`、`StatusMessage`
- `app/components/features/*`
  - 页面/业务特定组件

你不一定要立刻移动所有文件，但要先确定未来的目标结构。

## Phase 1：统一 token，停止新增旧变量

目标：结束双轨 token 体系。

建议动作：

- 以 `app/globals.css` 的语义 token 为主体系
- 为现有旧变量建立映射表
- 新代码不再新增 `--text-color`、`--border-color` 这一类旧命名

建议统一后的 token 层级：

- Surface
  - `--background`
  - `--card`
  - `--popover`
- Text
  - `--foreground`
  - `--muted-foreground`
- Brand
  - `--primary`
  - `--secondary`
  - `--accent`
- Feedback
  - `--destructive`
  - 可以后续补 `--success`、`--warning`
- Structure
  - `--border`
  - `--input`
  - `--ring`
- Shape
  - `--radius`

补充建议：

- `tailwind.config.js` 中不要再混入过多 `colors.blue`、`colors.green` 的整套色板给业务直接使用
- 如果保留色阶，应该明确哪些是允许使用的品牌色阶，哪些只是内部扩展

### 旧变量迁移建议

优先建立映射，而不是一次删光：

- `--text-color` -> `--foreground`
- `--border-color` -> `--border`
- `--card-background-color` -> `--card`
- `--background-color` -> `--background`
- `--chart-link-color` -> 优先判断其真实语义，若是品牌强调色则并入 `--primary` / `--accent`

这样你可以先兼容，再逐步删除旧变量使用点。

## Phase 2：抽离“站点级通用组件”

目标：让重复 UI 模式不再在业务组件里散落。

我建议优先抽这几类：

### 1. SectionHeading

用于替代零散标题写法和 `.home-page-heading`

适用场景：

- Home 各 section 标题
- Blog / Articles 的一级区块标题

建议支持：

- `title`
- `description`
- `action`
- `align`
- `tone`

### 2. SurfaceCard

用于替代一部分直接写圆角、边框、背景、阴影的容器

适用场景：

- blog summary surface
- AI panel surface
- tooltip / floating panel 的基础壳层

### 3. ActionIconButton

用于统一 nav icon、tooltip trigger、浮层操作按钮这类图标按钮

统一内容：

- size
- radius
- hover/focus
- border and background treatment

### 4. StatusMessage / FormMessage

用于统一成功、失败、警告、校验提示

当前 `app/[locale]/ai/AIPlayground.tsx` 和局部提示类 UI 都已经有这类需求，值得抽出公共模式。

### 5. Page Shell Helpers

这里不再建议围绕 `ProjectCard` 做抽象，而是优先补齐更通用的页面骨架能力，例如：

- `PageContainer`
- `Section`
- `SectionIntro`

这类组件的复用面更广，也更符合当前站点已经去掉 `Projects` 模块后的结构。

## Phase 3：建立页面级布局节奏

目标：统一页面的留白、容器、区块节奏。

现在首页和功能页已经有一些不错的内容，但节奏不完全一致。建议建立几个通用约定：

- 页面最大宽度
- section 垂直间距
- 标题和正文的间距
- 列表 grid 的 gap
- 卡片圆角和阴影层级

建议新增这些 layout helper：

- `PageContainer`
- `Section`
- `SectionIntro`

统一后可以让：

- Hero 之后的内容节奏更稳
- Blog、Articles、AI 页面更像同一个产品
- 响应式下不再每个页面单独调 padding

## Phase 4：按页面优先级逐步替换

建议优先顺序如下：

### 第一批：高曝光公共区域

- 首页
- 导航

原因：这些页面最直接影响招聘者第一印象，而且组件复用率高。

### 第二批：内容系统

- Blog list
- Blog detail
- Articles

原因：这些页面结构更复杂，先等基础组件稳定后再迁移更安全。

### 第三批：实验型功能

- AI Playground
- examples
- 特殊交互页面

原因：这些页面更容易有独立视觉表达，适合在系统稳定后再做风格校准。

## Phase 5：清理遗留样式和无主规范

目标：减少“看起来还能用，但以后会继续制造漂移”的代码。

建议清理内容：

- 删除不再使用的旧 CSS variable
- 删除重复组件
- 清理 demo 式 class 组合
- 合并相近的 utility class
- 为设计系统页补充“推荐用法”和“禁用写法”
- 清理已经失去产品价值的 `Projects` 与 `Contact` 相关视觉实现、资源与冗余组件

## 建议优先解决的几个具体问题

### 1. 导航视觉系统不统一

相关文件：

- `app/NavBar.tsx`
- `app/components/navbar/DesktopNav.tsx`
- `app/components/navbar/MobileNav.tsx`

问题：

- desktop 和 mobile 使用不同的组件体系
- 存在较多运行时 inline style
- 文本态和 icon 态控件没有统一视觉语言

建议：

- 抽一个统一的 nav item / nav control 样式层
- 减少对旧主题变量的直接依赖
- desktop 和 mobile 共享同一套交互 token

### 2. AI 与通用输入状态样式可以系统化

相关文件：

- `app/[locale]/ai/AIPlayground.tsx`
- `app/components/ui/input.tsx`
- `app/components/ui/textarea.tsx`

问题：

- 输入类状态仍然缺乏统一的错误/安静/辅助层级
- success / error message 仍然可能在局部各写各的

建议：

- 给输入类组件补 `error`、`success`、`quiet` variant
- 状态文本统一走 `FormMessage`
- 先服务 AI 和后续仍保留的交互区域，不再围绕 contact form 建模

### 3. 首页 heading 体系需要统一

相关文件：

- `app/globals.css`
- `app/components/Hero.tsx`
- 以及其它 section heading

问题：

- 有的标题用 gradient text
- 有的标题用 `text-yellow-500`
- 有的标题依赖全局 utility

建议：

- 定义 display heading / section heading / body lead 三层排版
- 只在极少数关键位置保留特殊强调写法
- 不要让每个 section 自己发明标题风格

### 4. 内容页与实验页的 surface language 需要收敛

相关文件：

- `app/[locale]/blogs/page.tsx`
- `app/[locale]/blogs/[id]/page.tsx`
- `app/[locale]/articles/page.tsx`
- `app/[locale]/ai/AIPlayground.tsx`

问题：

- 内容容器、提示层、表单反馈和辅助面板还没有共享同一套 surface 语言
- 局部仍依赖旧 token 或一次性样式写法
- AI 区域与内容页之间的基础容器语言不够统一

建议：

- 先统一容器、提示、辅助面板的基础壳层
- 再逐页清理旧 token 使用
- 保留内容页和 AI 页的个性，但让它们建立在同一套基础系统上

## 推荐的代码规范

以后写样式时可以遵守下面这套简单规则：

### 可以直接写 Tailwind 的情况

- spacing
- layout
- flex/grid
- typography scale
- 常规 token class，例如 `bg-card`、`text-foreground`、`border-border`

### 应该抽成组件 variant 的情况

- button 风格
- input 状态
- card 壳层
- alert / badge / chip
- icon button

### 应该用 CSS Module 的情况

- 复杂文章插图组件
- 特殊动画结构
- 难以用 Tailwind 表达的组合背景
- 高度定制的 editorial 模块

### 尽量避免的情况

- 同时混用 `bg-card` 和 `bg-[var(--card-background-color)]`
- 同一页面内既用 Radix Button 又用自定义视觉按钮且没有风格桥接
- 直接把业务组件写成“大段 className + 一次性视觉逻辑”
- 在新代码继续使用旧 token 命名

## 建议建立的验收标准

每完成一个阶段，可以用下面的标准判断是否真的变好了：

### 视觉一致性

- 同类按钮是否共享同一套 hover / focus / radius
- 同类卡片或面板是否共享同一套 surface 语言
- 同类标题是否共享同一套层级

### 代码一致性

- 新组件是否优先基于 `ui` 或 `system` 组件
- 是否减少了硬编码颜色
- 是否减少了重复 class 组合

### 可维护性

- 改一个 token 能否影响多个页面
- 改一个组件 variant 是否能影响所有同类场景
- 新页面是否能用现成模式快速搭建

## 我建议你的实际执行顺序

如果你想把这件事做得稳，我建议按下面顺序推进：

1. 先整理 token 命名和 design system 页面
2. 抽 `SectionHeading`、`SurfaceCard`、`ActionIconButton`、`FormMessage`
3. 先迁移导航和 Home 公共壳层
4. 再迁移 Blog / Articles 的公共壳层
5. 最后处理 AI Playground 这类实验型页面
6. 清理不再需要的 `Projects` 与 `Contact` 相关组件、资源和样式残留

这条路线的好处是：

- 风险低
- 每一步都有明显收益
- 不会中途因为改动范围太大而放弃
- 更符合当前站点真实保留的内容结构

## 结论

你的项目不是“没有风格”，而是已经有多套不错的风格雏形混在一起了。真正需要做的不是推翻，而是把这些雏形收敛成一套清晰、可复用、可扩展的系统。

既然 `Projects` 模块和 `Contact` 表单都已经不再是产品的一部分，后续的 normalize 重点也应该同步调整：不要再把项目卡片或联系表单当成核心模板，而是把系统建设重心放到导航、内容页和 AI 界面这些仍然真实存在的用户触点上。

如果后续继续做这个重构，我建议把第一阶段直接定成：

- 统一 token 命名
- 补 design system 规范页
- 抽出 3 到 4 个站点级通用组件

这样最容易快速看到成果，也更符合现在这个站点的真实结构和优先级。
