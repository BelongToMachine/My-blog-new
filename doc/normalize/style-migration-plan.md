# Normalize Migration Plan

> 目标：基于 `suggestion.md` 的方向，把项目逐步迁移到「`shadcn/ui` 作为底层基础，站点级自定义组件作为品牌层」的体系里。
>
> 使用方式：
>
> - 每完成一项就把 `[ ]` 改成 `[x]`
> - 不跨 phase 乱跳，尽量按顺序推进
> - 如果中途发现新任务，追加到对应 phase，不要把文档写散
> - 每次只做一个可验证的小批次，避免大爆改

---

## Execution Rules

- [x] 始终坚持最小改动原则
- [x] 样式重构不改业务逻辑
- [x] 每次任务先确认影响范围，再动手
- [ ] 每次任务完成后都检查深色模式、移动端和交互状态
- [x] 不把 normalize 任务和无关功能开发混在同一个改动里

---

## Skill Workflow

每次执行样式规范化任务，按下面的顺序选择技能：

- [x] 先用 `normalize` 对齐 token、spacing、variant、component pattern
- [x] 如果需要更好的视觉方案或版式判断，再用 `frontend-design`
- [ ] 如果出现重复模式，需要抽公共层时，用 `extract`
- [ ] 如果涉及响应式、断点、触控体验，用 `adapt`
- [ ] 如果涉及表单、溢出、空状态、错误态，用 `harden`
- [ ] 主体改动完成后，用 `polish` 做最后的统一性和细节检查

### 单次任务标准流程

- [x] 明确当前任务属于哪个 phase
- [x] 明确这次只改哪些页面或组件
- [x] 先对照规范，再改实现
- [x] 改完后做最小必要验证
- [ ] 通过后再进入下一个 checklist 项

---

## 总体原则

- [ ] 新增 UI 优先基于 `app/components/ui/*`
- [ ] 新增站点级视觉模式优先进入 `app/components/system/*`
- [ ] 新增业务组合组件优先进入 `app/components/features/*`
- [x] 新代码不再新增旧 token 命名，例如 `--text-color`、`--border-color`
- [ ] 新代码尽量不用裸 `style={{ ... }}`，除非必须依赖运行时值
- [ ] 不再继续扩大 `@radix-ui/themes` 的视觉职责，保留它的必要行为能力即可
- [ ] 能复用 variant 就不新写一套 class 组合
- [x] 能复用 token 就不写硬编码颜色
- [ ] 能留在 feature-local 的组件不要为了整齐强行上提

---

## Phase 0: Freeze Direction

### 目标

先把路线冻结，避免边改边漂移。

### 本阶段要完成的事

- [x] 确认采用的整体方案是：
  - `shadcn/ui` 作为底层组件基础
  - `Radix primitives` 作为交互/无障碍能力来源
  - `system components` 作为本站统一视觉层
- [ ] 确认 `suggestion.md` 作为设计重构方向文档
- [x] 确认本文件作为执行型 checklist
- [x] 确认后续所有 normalize 工作默认记录到 `doc/normalize/`

### 本阶段不要做的事

- [x] 不引入新的大型组件库，例如 MUI、Ant Design、Mantine
- [x] 不先重做首页视觉
- [x] 不先全站大范围改 class

### 完成标准

- [x] 团队后续能用一句话描述当前方案
- [x] 后续新增任务都能挂到某个 phase 下

---

## Phase 1: Unify Style Rules

### 目标

先统一样式规则和 token 语言，再开始迁移页面。

### 这一阶段就是“什么时候统一样式规则”

答案：现在就做，在任何页面级重构之前完成。

### Step 1.1 Token Inventory

- [x] 盘点现有 token 来源
- [x] 列出 `globals.css` 中已经存在的语义 token
- [x] 列出旧变量体系：
  - `--text-color`
  - `--border-color`
  - `--card-background-color`
  - `--background-color`
  - `--chart-link-color`
- [x] 整理一份旧变量 -> 新语义 token 的映射表
- [x] 标记哪些旧 token 需要兼容保留，哪些可以后续删除
- [x] 标记项目里硬编码颜色最密集的文件，作为后续优先治理对象

### Step 1.2 Freeze Token Standard

- [x] 确定全站主 token 体系以 `app/globals.css` 语义 token 为准
- [x] 明确保留的 token 分类：
  - surface
  - text
  - brand
  - feedback
  - structure
  - shape
- [x] 确定 `--chart-link-color` 的最终语义归属
- [ ] 确定是否补充 `success` / `warning` token

### Step 1.3 Freeze Styling Rules

- [ ] 写一份样式规范文档，建议文件：
  - `doc/normalize/ui-rules.md`
- [ ] 在文档中明确：
  - 哪些样式允许直接写 Tailwind
  - 哪些必须抽成 component variant
  - 哪些复杂场景才允许用 CSS Module
  - 什么时候允许 inline style
- [ ] 规定禁止事项：
  - 新代码继续使用旧 token 命名
  - 同一组件同时混用两套 token
  - 业务组件里重复发明 button/card/heading 样式
- [ ] 补充“推荐工作流”：
  - 先复用 `ui`
  - 再扩展 variant
  - 再考虑 `system`
  - 最后才是 CSS Module 例外

### Step 1.4 Tailwind and Theme Cleanup

- [x] 检查 `tailwind.config.js`
- [ ] 决定是否缩减 `colors.blue`、`colors.green` 直接暴露给业务的范围
- [ ] 明确允许使用的品牌色阶
- [ ] 检查 `globals.css` 中全局 utility 是否过多承担业务视觉职责
- [x] 盘点动画时长、阴影、radius 是否已经形成可复用 token
- [x] 补齐缺失但高频的基础 token：
  - shadow
  - motion duration
  - z-index
  - typography roles

### 完成标准

- [ ] 项目里有一份明确的样式规则文档
- [x] 新旧 token 的迁移映射已经固定
- [ ] 新增样式代码时可以清楚判断“该放哪一层”

---

## Phase 2: Establish Component Layers

### 目标

先搭出组件体系骨架，再让页面逐渐迁移进去。

### 这一阶段就是“什么时候抽离组件”

答案：在样式规则统一之后、页面大迁移之前。

### Step 2.1 Confirm Directory Boundaries

- [ ] 确认 `app/components/ui/*` 只放基础原子组件
- [ ] 新建或确认 `app/components/system/*` 用于站点级通用视觉组件
- [ ] 新建或确认 `app/components/features/*` 用于业务组合组件
- [ ] 记录一份目录职责说明
- [ ] 为“哪些组件不该抽到 system”补一句判断标准

### Step 2.2 Audit Existing UI Foundation

- [ ] 检查现有 `ui` 组件：
  - `button`
  - `input`
  - `textarea`
  - `card`
- [ ] 判断还缺哪些基础件
- [ ] 列出后续建议补充的底层组件：
  - badge
  - tabs
  - dialog
  - dropdown-menu
  - tooltip
  - sheet 或 drawer
  - select

### Step 2.3 Extract First System Components

- [ ] 抽 `SectionHeading`
- [ ] 抽 `SurfaceCard`
- [ ] 抽 `ActionIconButton`
- [ ] 抽 `StatusMessage`
- [ ] 抽 `FormMessage`
- [ ] 如果需要，再补：
  - `PageContainer`
  - `Section`
  - `SectionIntro`

### Step 2.4 Standardize Variants

- [ ] 给 `Button` 定义统一 variant 策略
- [ ] 给 `Input` / `Textarea` 补状态策略
- [ ] 给 `SurfaceCard` 定义统一 radius / border / shadow / padding
- [ ] 给 `SectionHeading` 定义统一标题层级
- [ ] 给 `ActionIconButton` 定义统一 size / focus / hover / overlay 规则
- [ ] 给 `StatusMessage` / `FormMessage` 定义 success / error / warning / quiet 层级

### 完成标准

- [ ] 至少有一批 system components 可以复用
- [ ] 后续改页面时不再需要临时发明 heading/card/message 样式
- [ ] 基础组件和站点组件的职责已经清楚

---

## Phase 3: Create the First Migration Pilot

### 目标

选一块最值得的区域做样板，验证体系是否成立。

### 首个试点区域

`Navigation + Home shared shell`

### 为什么从这里开始

- 曝光高，直接影响第一印象
- 仍然是真实存在的产品表层
- 复用率高，适合验证 token 和 system component 是否成立
- 风险比内容页深层结构改动更可控

### Step 3.1 Normalize Shared Shell Components

- [ ] 统一导航与首页共享壳层的基础视觉实现
- [ ] 让共享组件只承接视觉与交互，不混入额外业务逻辑
- [ ] 把高频图标操作入口迁移到 `ActionIconButton`

### Step 3.2 Normalize Shared Section Language

- [ ] 统一首页公共区块标题样式
- [ ] 统一共享 section 的标题、说明、辅助动作层级
- [ ] 统一 hover / focus / overlay 行为
- [ ] 清理共享壳层里的旧 token 使用

### Step 3.3 Validate the Pilot

- [ ] 对比迁移前后，确认视觉一致性提升
- [ ] 确认深色模式没有被破坏
- [ ] 确认移动端布局正常
- [ ] 把共享壳层的经验补充回规范文档
- [ ] 记录哪些抽象是成功的，哪些不应该继续推广

### 完成标准

- [ ] 共享壳层成为后续页面复用的样板
- [ ] 后续其它页面可以直接参考这套实现

---

## Phase 4: Migrate High-Impact Shared Areas

### 目标

先改复用率高、影响大的公共区域。

### 顺序

1. Navigation
2. Home shared sections
3. Content shared sections

### Step 4.1 Navigation

- [ ] 统一 `NavBar.tsx`
- [ ] 统一 `DesktopNav.tsx`
- [ ] 统一 `MobileNav.tsx`
- [ ] 为 nav item / nav control 建立统一视觉规范
- [ ] 降低 desktop 和 mobile 之间的视觉割裂
- [ ] 减少导航中的 inline style 和旧 token 依赖
- [ ] 统一 nav item、icon trigger、theme toggle、language toggle 的交互等级

### Step 4.2 Home Shared Rhythm

- [ ] 检查首页各 section 的间距节奏
- [ ] 抽通用 `Section` 或 `PageContainer`
- [ ] 统一 heading 与内容块的 spacing
- [ ] 处理 `.home-page-heading` 的替代方案
- [ ] 保留 Hero 的个性，不把首页做成通用模板块拼接

### 完成标准

- [ ] 首页公共区域已经开始使用 system components
- [ ] 导航和首页共享壳层拥有统一的交互语言
- [ ] 用户最常看到的页面已经进入统一风格轨道

---

## Phase 5: Migrate Content-Heavy Pages

### 目标

把 Blog / Articles 这种复杂内容页纳入统一系统，但保留它们的内容个性。

### 顺序

1. Blog list
2. Blog detail
3. Articles

### Step 5.1 Blog List

- [ ] 统一列表页 section heading
- [ ] 统一 filter / tabs / actions 的样式入口
- [ ] 统一 table/card/list 的 surface language

### Step 5.2 Blog Detail

- [ ] 梳理 detail 页使用的特殊样式
- [ ] 识别必须保留为 CSS Module 的部分
- [ ] 识别可以系统化的部分：
  - heading
  - metadata
  - panels
  - actions
  - feedback areas
- [ ] 避免为了统一而破坏 markdown / code block / article readability

### Step 5.3 Articles

- [ ] 检查 article enhancement 组件是否偏离主系统
- [ ] 保留 editorial 风格，但统一基础 spacing、surface、text hierarchy
- [ ] 避免文章页变成完全孤立的一套视觉系统

### 完成标准

- [ ] 内容页与首页/AI 页属于同一产品
- [ ] 文章的个性保留，但基础系统一致

---

## Phase 6: Migrate Experimental Areas

### 目标

最后收敛 AI Playground 和 examples 这类实验性界面。

### 为什么放最后

- 这些页面更容易需要特殊表达
- 等系统成熟后再收口更稳

### Step 6.1 AI Playground

- [ ] 统一输入区外观
- [ ] 统一消息区 surface
- [ ] 统一 code block 之外的提示和错误信息
- [ ] 统一工具条、上传区域、状态反馈
- [ ] 保留 AI 实验感，但回收到统一 token 和 surface 语言里

### Step 6.2 Examples and Usecase Pages

- [ ] 盘点这些页面是否继续保留
- [ ] 保留的话，迁入统一系统
- [ ] 不保留的话，考虑降级为实验页或清理

### 完成标准

- [ ] 实验区域不再明显游离于主站风格之外

---

## Phase 7: Cleanup and Deletion

### 目标

清掉历史包袱，防止未来继续漂移。

### Step 7.1 Remove Legacy Style Paths

- [ ] 删除已经无人使用的旧 token
- [ ] 删除重复 card / action / status 实现
- [ ] 删除被新 system components 替代的旧写法
- [ ] 删除已经失效的 demo-only class 组合和过时注释

### Step 7.2 Tighten Rules

- [ ] 把“推荐写法”和“禁止写法”补充进规范文档
- [ ] 在 code review 时开始按规则检查
- [ ] 约定以后新增页面优先使用 system components

### Step 7.3 Refresh Design System Page

- [ ] 更新 `app/design-system/page.tsx`
- [ ] 让它展示真实在用的组件，而不是 demo-only 组件
- [ ] 展示 token、variant、组合示例
- [ ] 补充“推荐用法”和“不要这样用”的示例

### 完成标准

- [ ] 旧样式路径基本退出主流程
- [ ] 设计系统页可以反映当前真实项目规范

---

## 推荐执行顺序总览

- [ ] Phase 0: Freeze Direction
- [ ] Phase 1: Unify Style Rules
- [ ] Phase 2: Establish Component Layers
- [ ] Phase 3: Create the First Migration Pilot
- [ ] Phase 4: Migrate High-Impact Shared Areas
- [ ] Phase 5: Migrate Content-Heavy Pages
- [ ] Phase 6: Migrate Experimental Areas
- [ ] Phase 7: Cleanup and Deletion

---

## 当前建议的下一步

### 现在最适合立刻开始的事项

- [ ] 写 `doc/normalize/ui-rules.md`
- [ ] 盘点旧 token 与新 token 的映射
- [ ] 创建 `app/components/system/`
- [ ] 抽第一批 system components：
  - `SectionHeading`
  - `SurfaceCard`
  - `ActionIconButton`
  - `FormMessage`
- [ ] 开始 `Projects` 区域的试点迁移

---

## Done Definition

只有当下面这些项都成立时，才算“项目基本完成 normalize”：

- [ ] 新页面和新组件默认走 `ui` / `system` / `features` 分层
- [ ] 旧 token 已经基本退出主流程
- [ ] 高曝光页面已经统一到同一套 surface、heading、control 语言
- [ ] Blog / Articles / AI 没有再明显游离于主系统之外
- [ ] `app/design-system/page.tsx` 能真实反映当前在用规范
- [ ] 后续新增 UI 不需要再临时发明样式路径

---

## 备注

- 这份计划默认是长期维护文档
- 后续每完成一项，我们直接在这里打勾
- 如果某一阶段需要再拆子任务，可以在该 phase 下继续追加 checklist
