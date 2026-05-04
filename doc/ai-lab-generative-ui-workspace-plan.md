# AI Lab Generative UI Workspace Plan

## 目标

把当前 AI Lab 从“聊天里插入几个生成块”的体验，升级为一个真正的 **Chat + Workspace** 双区工作台：

- 左侧负责对话、解释、追问、修改意图
- 右侧负责持续展示 AI 生成的结构化 artifact
- 每个聊天线程绑定一个独立 workspace
- 先做结构化 generative UI，不做任意代码执行

这个阶段的核心不是“让 AI 写 React 代码”，而是“让 AI 组织信息并持续编辑页面”。

---

## 当前基础

项目已经具备以下可复用能力：

- `Vercel AI SDK` 聊天链路已经落地
- 单 agent 架构已经落地
- `tool calling` 已经接入
- 线程化聊天状态已经落地
- 全局 chat runtime 已经在 `[locale]` 外层持久运行
- 已有的 generative UI block：
  - `profile-card`
  - `project-grid`
  - `article-summary`
  - `timeline`
  - `comparison-table`

因此，Workspace V1 不需要从零开始，而是在现有 AI Lab 上增加一层 artifact 工作区。

### 已有实现清单

- `app/api/ai/chat/route.ts`
  - 使用 `createAgentUIStreamResponse`
  - 已经切到独立的 AI Lab chat route
- `lib/ai/minimax.ts`
  - MiniMax 通过 OpenAI-compatible provider 接入
  - `<think>` 已通过 middleware 提取，不直接泄露到可见对话
- `lib/ai/portfolio-agent.ts`
  - 单一 portfolio agent
  - 已接入 `get_profile_summary`、`list_projects`、`search_articles`、`build_ui_block`
- `app/context/GlobalChatRuntimeContext.tsx`
  - 全局 `Chat` registry 已存在
- `app/hooks/useThreadChat.ts`
  - thread 与全局 runtime 的订阅层已存在
- `app/hooks/useChatThreads.ts`
  - thread 本地持久化已存在
- `app/[locale]/ai/AIPlayground.tsx`
  - 已经是可流式聊天的真实 AI Lab UI

### 当前阶段结论

- Phase 1 的 streaming single-agent chat 已经完成
- 语言切换导致 streaming 消失的问题，已经通过全局 chat runtime 方向修正
- 现阶段最自然的下一步，不是多 agent，也不是 sandbox，而是补上 workspace 这一层

### 当前约束

- AI Lab 仍然以本地状态为主，尚未接入数据库持久化
- 现有 Vercel AI SDK 流程里还没有图片上传路径
- sandbox 执行仍然明确延期到后续独立阶段
- `next build` 仍可能受项目里既有的 `/api/users` 数据库问题影响，但这不是本方案的 blocker

---

## 产品定位

Generative UI Workspace 的职责是：

- 把聊天结果沉淀为可浏览、可修改、可比较的视觉 artifact
- 让 AI 不只是“回答”，而是“编排一个页面工作区”
- 让 recruiter / collaborator / visitor 在一次对话中逐步得到更结构化的内容面板

它应该像：

- 一个站内作品集工作台
- 一个面向招聘场景的可视化助手

它不应该像：

- 任意代码生成器
- Claude Artifacts / v0 的直接替代品
- 普通消息气泡堆叠式聊天页

---

## V1 范围

V1 只做 **结构化 artifact workspace**。

包含：

- 双栏布局
- workspace 状态层
- artifact 持久化到 thread 本地状态
- 聊天与 workspace 的联动
- AI 通过 tool 返回结构化 artifact payload
- 同类 artifact 的增量更新

不包含：

- 任意 React 代码生成
- 沙箱执行
- iframe 代码预览
- npm 依赖安装
- 数据库存储
- 分享链接

---

## 架构原则

这些原则来自前序 AI Lab 文档，仍然适用于 Workspace V1：

- 继续使用单 agent，不引入多 agent orchestration
- 优先输出结构化 UI payload，而不是执行 AI 生成代码
- 保持模型上下文短而稳定，避免无节制堆叠历史
- 在 V1 里继续避免数据库写入，先用本地状态把产品形态跑顺
- 明确把 sandbox 执行推迟到后续独立阶段
- 保持 agent scope 聚焦在 Jie、本网站内容、作品集与招聘场景
- 不暴露原始 chain-of-thought 或 provider 特有 reasoning 文本

---

## 已确认的产品决策

### 1. 聊天里的 block 处理方式

V1 推荐方案：

- 聊天区只显示简短回执
- 完整 artifact 在右侧 workspace 中渲染

示例：

- 聊天区显示：`已生成项目对比卡`
- Workspace 显示：完整 comparison table

这样可以避免聊天区过重，也更符合“工作区”的产品感。

### 2. 一个 thread 的 workspace 形态

V1 推荐方案：

- 累积型 workspace
- 但同类 artifact 默认优先 `update`，而不是无限新增

含义：

- `timeline` 已存在时，再次“优化时间线”应更新现有 timeline
- `comparison-table` 已存在时，再次“改成 recruiter 视角”应更新该表
- 不同类型 artifact 可以并存

### 3. V1 首批 artifact 类型

优先做：

- `project-grid`
- `comparison-table`
- `timeline`
- `role-fit-report`

说明：

- 前三个类型已有可复用基础
- `role-fit-report` 是最贴合 recruiter 场景的新类型

### 4. 可分享链接

V1 暂不做。

先把交互形态、状态管理和 artifact 生命周期跑顺，再考虑 shareable workspace。

---

## 用户体验目标

用户在 AI Lab 中应该可以做到：

1. 提一个问题，例如“帮我整理最适合前端岗位的项目”
2. 左侧 chat 解释 AI 正在做什么
3. 右侧 workspace 出现一个项目工作区 artifact
4. 用户继续说“改成 recruiter 视角，只保留最强的两个项目”
5. AI 更新现有 artifact，而不是只追加新消息
6. 用户切换到另一个 thread 时，看到该 thread 自己的 workspace
7. 返回原 thread 时，artifact 和对话都还在

---

## 页面形态

### Desktop

双栏布局：

- 左侧：Chat Panel
- 右侧：Workspace Panel

建议比例：

- `chat:workspace = 5:7` 或 `1:1`

Workspace 区不是单一卡片，而是：

- 顶部 toolbar
- artifact 列表或导航
- 主展示区
- 空状态 / loading / error 状态

### Mobile / Tablet

不建议继续强行双栏。

推荐：

- `Chat`
- `Workspace`

通过 tabs 或 segmented control 切换。

要求：

- tab 切换不销毁各自状态
- 保留当前 thread 的 artifact 聚焦位置

---

## 核心概念设计

### WorkspaceArtifact

建议为每个生成结果建立统一数据结构：

```ts
type WorkspaceArtifact = {
  id: string
  threadId: string
  type:
    | "project-grid"
    | "comparison-table"
    | "timeline"
    | "role-fit-report"
    | "profile-card"
    | "article-summary"
  title?: string
  data: Record<string, unknown>
  status: "ready" | "updating" | "error"
  sourceMessageId?: string
  summary?: string
  createdAt: number
  updatedAt: number
}
```

### ThreadWorkspaceState

```ts
type ThreadWorkspaceState = {
  threadId: string
  artifacts: WorkspaceArtifact[]
  activeArtifactId: string | null
  lastUpdatedAt: number
}
```

---

## 状态层设计

V1 建议新增：

- `useThreadWorkspace(threadId)`

职责：

- 读取当前 thread 的 workspace
- 新增 artifact
- 更新 artifact
- 设置当前激活 artifact
- 序列化到本地持久化层

建议接口：

```ts
const {
  artifacts,
  activeArtifact,
  activeArtifactId,
  addArtifact,
  updateArtifact,
  replaceArtifacts,
  removeArtifact,
  setActiveArtifact,
  clearWorkspace,
} = useThreadWorkspace(threadId)
```

### 持久化策略

V1 不进数据库，继续使用本地持久化。

推荐方式：

- artifacts 与 thread 一起保存在本地
- 每个 thread 存自己的 workspace state

原因：

- 成本低
- 迭代快
- 不会过早锁死数据库结构

### 与现有 Chat Runtime 的绑定规则

Workspace 不能独立发明另一套身份系统，它必须复用现有 chat runtime 的关键约束：

- `threadId` 是唯一稳定身份
- 不使用 `locale`
- 不使用 `pathname`
- 不使用 `useChat` 自动生成的 id

原因：

- 语言切换前后，`threadId` 不变
- 现有全局 `Chat` 实例也是按 `threadId` 复用
- Workspace 只有挂在同一个 `threadId` 上，才能和聊天上下文真正绑定

### 与全局 Provider 的关系

当前 chat runtime 已经在 `app/layout.tsx` 下的全局 provider 中维护，因此 Workspace V1 也应遵循同样的分层思路：

- chat runtime 负责“让流活着”
- thread persistence 负责“让消息快照可恢复”
- workspace state 负责“让 artifact 可浏览、可更新、可切换”

换句话说：

- `useThreadChat` = runtime subscription layer
- `useChatThreads` = thread snapshot persistence layer
- `useThreadWorkspace` = artifact workspace layer

### 持续持久化建议

前序 runtime 方案里已经验证过：不需要每个 token 都强写本地存储。

Workspace V1 推荐沿用同样的节流思路：

- artifact 变化时节流持久化
- 建议窗口：`200ms - 500ms`
- 在一次明确完成更新后，再额外强制落一次最终状态

### 清理策略

V1 不建议一开始就做复杂 GC。

推荐规则：

- 删除 thread 时，同时删除该 thread 的 workspace
- 删除 thread 时，同时回收该 thread 对应的 chat runtime
- 先不做“最近 N 个 runtime / workspace 自动回收”

### Busy 状态

chat runtime 已经有：

- `ready`
- `submitted`
- `streaming`
- `error`

Workspace V1 可以复用这个运行态，用于：

- 控制 artifact 的 `updating` 状态
- 决定是否显示 skeleton 或“正在整理中”
- 在 UI 上提示当前 artifact 正在被 refine

---

## Artifact 生命周期

### 1. 创建

用户请求生成一个视觉结果：

- “帮我总结项目”
- “生成时间线”
- “按 recruiter 视角做对比表”

AI 调用 tool 后返回结构化 payload，前端把它写入 workspace。

### 2. 更新

用户后续继续 refine：

- “改成英文”
- “只保留最强的两个”
- “加上工作经验”

AI 返回 `update` 操作，前端更新已有 artifact。

### 3. 聚焦

如果一个 thread 内有多个 artifact，workspace 需要有“当前聚焦 artifact”概念。

可以是：

- 最近更新的 artifact 自动聚焦
- 用户点击侧边列表切换聚焦

### 4. 错误

如果 AI 返回的数据不符合 schema 或生成失败：

- artifact 显示 error 状态
- chat 中显示简短说明
- 不影响整个 workspace

---

## Tool 协议升级

当前 `build_ui_block` 更像一次性渲染协议。

V1 需要把它升级成“workspace artifact 协议”。

建议返回结构：

```ts
type WorkspaceArtifactPayload = {
  artifactType:
    | "project-grid"
    | "comparison-table"
    | "timeline"
    | "role-fit-report"
    | "profile-card"
    | "article-summary"
  operation: "append" | "replace" | "update"
  title?: string
  summary?: string
  focus?: boolean
  artifactId?: string
  data: Record<string, unknown>
}
```

### 字段说明

- `artifactType`
  - 指定 block 类型
- `operation`
  - `append`: 新增 artifact
  - `replace`: 替换当前主要 artifact
  - `update`: 更新已有 artifact
- `summary`
  - 给 chat 区显示的简短回执
- `focus`
  - 是否自动切换到该 artifact
- `artifactId`
  - 当 `update` 时可用于精准定位

---

## 首批 artifact 定义

### 1. project-grid

适用场景：

- “给我看看项目”
- “挑最适合这个岗位的项目”
- “按技术栈分类列一下”

输出内容：

- 项目标题
- 简介
- tech stack
- highlights
- optional tags

### 2. comparison-table

适用场景：

- “比较这几个项目”
- “前端工程能力 vs AI 集成能力”
- “为什么这些项目更适合招聘方看”

输出内容：

- columns
- rows
- optional notes

### 3. timeline

适用场景：

- “整理经历时间线”
- “把工作经验放进去”
- “按成长路径展示”

输出内容：

- 阶段
- 时间
- 描述
- optional milestone

### 4. role-fit-report

这是 V1 最值得新增的 artifact。

适用场景：

- “我适合什么岗位”
- “针对某个 JD 总结匹配度”
- “从 recruiter 视角看我的亮点和风险”

输出内容建议：

- `fitScore`
- `strengths`
- `matchedProjects`
- `matchedArticles`
- `possibleRisks`
- `recommendedTalkingPoints`

它会让 AI Lab 从“作品展示”升级成“招聘助手”。

---

## UI 结构建议

### Chat Panel

保留：

- thread list
- message list
- input
- loading state

改变：

- tool 成功后，聊天区不再展示完整大块 artifact
- 改成轻量系统回执或短说明

### Workspace Panel

建议拆成三层：

#### 1. Workspace Header

显示：

- 当前 workspace 标题
- 当前 thread 名称
- 清空 / 聚焦 / 排序等轻操作

#### 2. Artifact Navigator

显示：

- 当前 thread 下已有 artifact 列表
- 最近更新状态
- 当前选中项

#### 3. Artifact Canvas

显示：

- active artifact 详情
- skeleton
- empty state
- error state

---

## 文件结构建议

建议新增：

- `app/components/ai-workspace/WorkspacePanel.tsx`
- `app/components/ai-workspace/WorkspaceHeader.tsx`
- `app/components/ai-workspace/ArtifactList.tsx`
- `app/components/ai-workspace/ArtifactRenderer.tsx`
- `app/components/ai-workspace/RoleFitReportBlock.tsx`
- `app/hooks/useThreadWorkspace.ts`
- `app/types/ai-workspace.ts`

建议修改：

- `app/[locale]/ai/AIPlayground.tsx`
- `lib/ai/portfolio-tools.ts`
- `lib/ai/portfolio-agent.ts`
- 本地 thread 持久化相关 hook

---

## 分阶段实施顺序

### Phase A: Workspace UI 骨架

目标：

- 先把双栏或双 tab 布局搭起来
- 加空状态和基本交互

交付：

- Chat / Workspace 页面结构
- Workspace panel 空态
- 每个 thread 拥有自己的 workspace state

### Phase B: 现有 block 接入 Workspace

目标：

- 让现有 generative UI block 从聊天区迁移到 workspace

交付：

- `profile-card`
- `project-grid`
- `article-summary`
- `timeline`
- `comparison-table`

### Phase C: Tool 协议升级

目标：

- 让 `build_ui_block` 支持 append / update / replace
- 聊天区改为简短回执

交付：

- 前后端统一 artifact payload 协议
- artifact 更新逻辑

### Phase D: role-fit-report

目标：

- 引入招聘导向 artifact

交付：

- `role-fit-report` block
- agent 指令补充 recruiter / role-fit 场景

### Phase E: UX 打磨

目标：

- 强化产品感与稳定性

交付：

- mobile tabs
- artifact loading skeleton
- source message badge
- artifact focus animation
- i18n 文案收敛

---

## 风险与边界

### 1. Artifact 无限堆积

如果每次请求都 append，workspace 很快会失控。

解决思路：

- 同类 artifact 默认 update
- 只在明确“新增一个”时 append

### 2. Tool schema 过于宽泛

如果 `data: Record<string, unknown>` 没有边界，前端渲染会脆弱。

解决思路：

- 先用统一壳结构
- 再逐步给每个 artifact 类型收紧 schema

### 3. Chat 与 Workspace 状态不同步

如果 chat 成功了但 workspace 没更新，会产生割裂。

解决思路：

- tool 回执统一走 artifact pipeline
- 所有视觉结果都通过 workspace state 落地

### 4. Mobile 体验过重

双栏在小屏上很容易拥挤。

解决思路：

- mobile 使用 tabs
- 不在手机上强行并排展示

---

## 成功标准

V1 完成后，应满足：

1. 用户可以通过一句自然语言请求生成 workspace artifact
2. artifact 出现在右侧 workspace，而不是挤在聊天流里
3. 用户可以继续通过对话更新已有 artifact
4. thread 切换后，各自 workspace 独立保留
5. mobile 端可切换查看 chat 和 workspace
6. 整个链路不依赖 sandbox，不执行 AI 生成代码

---

## 下一阶段展望

当 Workspace V1 稳定后，后续可自然扩展到：

- shareable workspace
- 数据库存储
- recruiter copilot 模式
- resume stream + workspace 恢复
- artifact version history
- Phase 4 的 sandboxed artifact studio

但这些都应建立在 V1 的 artifact 模型、交互模型、状态模型已经稳定的前提下。

---

## 实施复盘（2026-04-29）

这轮实现已经把 Workspace V1 的主干搭起来了，方向是对的，而且不少关键节点已经落地：

- `app/[locale]/ai/AIPlayground.tsx`
  - 已完成 desktop 双栏和 mobile tabs
  - 已把“聊天回执 + 右侧 artifact”产品形态接起来
- `app/hooks/useThreadWorkspace.ts`
  - 已有 thread 级 workspace 状态和本地持久化
- `app/context/GlobalChatRuntimeContext.tsx`
  - 全局 chat runtime 继续成立，没有破坏前面的 streaming 修复
- `lib/ai/portfolio-tools.ts`
  - `build_ui_block` 已升级为 `append / replace / update`
- `app/components/ai-workspace/RoleFitReportBlock.tsx`
  - `role-fit-report` 已经有第一版可视化

结论：

- 这次实现已经完成了从“计划”到“可用 V1”的跨越
- 但当前实现仍然偏“把同步逻辑写进页面组件里”
- 下一轮最重要的不是再加新 artifact，而是先把 workspace runtime、tool 协议和幂等模型收紧

---

## 当前实现的主要问题

### 1. Tool 输出的幂等模型不稳

当前 `processedRef` 是根据现有 artifact 的 `sourceMessageId` 反推出来的，而不是独立持久化“哪些 tool 输出已经应用过”。

相关位置：

- `app/[locale]/ai/AIPlayground.tsx`
- `app/hooks/useThreadWorkspace.ts`

这会带来一个结构性问题：

- 如果用户清空 workspace，artifact 会被移除
- 但聊天消息仍然保留了旧的 tool 输出
- 下一次同步 effect 重新跑时，旧的输出可能再次被应用
- 结果就是 artifact 被“回放”出来，清空行为不真正生效

这类问题也会影响：

- 删除单个 artifact
- 将来做 artifact remove / replace / undo
- 后续引入版本历史或分享链接

### 2. Workspace 同步逻辑耦合在 `AIPlayground.tsx`

当前页面组件同时承担了这些职责：

- 解析 tool output
- 兼容 `artifactType / blockType`
- 兼容 legacy tools
- 处理 `append / replace / update`
- 做幂等控制
- 推测 updating 状态

相关位置：

- `app/[locale]/ai/AIPlayground.tsx`

这使得页面组件过重，也让后续测试和演进都变得困难。只要再加两三个 artifact 类型，这一段逻辑就会明显失控。

### 3. `updating` 状态是“猜”的，不是真正的运行时状态

现在的逻辑是在聊天 busy 时，把最后一个 artifact 标成 `updating`。

相关位置：

- `app/[locale]/ai/AIPlayground.tsx`
- `app/components/ai-workspace/WorkspacePanel.tsx`

这个策略的问题是：

- 它不知道这次 busy 到底是不是视觉请求
- 它不知道更新目标是不是“最后一个 artifact”
- 第一次生成新 artifact 时，没有稳定的 pending 占位
- `WorkspacePanel` 虽然收了 `isBusy`，但现在没有真正用起来

因此现在的 loading 反馈更像临时补丁，而不是 workspace runtime 的一部分。

### 4. Tool 协议已经扩展，但真正的 targeting 还没闭环

当前 payload 里已经有：

- `operation`
- `focus`
- `artifactId`

但前端只真正消费了 `operation` 的一部分，另外两项还没有形成完整能力。

相关位置：

- `app/types/ai-workspace.ts`
- `lib/ai/portfolio-tools.ts`
- `app/[locale]/ai/AIPlayground.tsx`

具体问题：

- `focus` 解析了，但没有真正驱动选中状态
- `artifactId` 理论上可用，但模型当前并不知道有哪些 artifact id，因此很难可靠使用
- `replace` 现在其实更接近“按 type update”，语义还不够清晰

这说明协议已经开始长大，但 workspace runtime 还没有跟上。

### 5. Artifact schema 过宽，前后端缺少共享校验

现在 `build_ui_block` 的 `data` 仍然是 `Record<string, unknown>`。

相关位置：

- `lib/ai/portfolio-tools.ts`
- `app/types/ai-workspace.ts`
- `app/components/ai-workspace/ArtifactRenderer.tsx`

这会带来几个问题：

- 模型容易吐出结构不完整的数据
- 客户端只能“尽量渲染”，不能在边界处提前失败
- 新 artifact 越多，脆弱点越多
- `role-fit-report` 这种新类型会越来越依赖约定，而不是依赖 schema

### 6. i18n 和 UX 元数据还没有收口

Workspace 框架本身已经接上了 `next-intl`，但内部仍然有不少硬编码英文和缺失元数据。

相关位置：

- `app/components/ai-workspace/ArtifactList.tsx`
- `app/components/ai-workspace/ArtifactRenderer.tsx`
- `app/components/ai-workspace/RoleFitReportBlock.tsx`
- `app/[locale]/ai/AIPlayground.tsx`

当前欠缺的部分包括：

- artifact type label 仍是英文常量
- legacy tool 生成的 title / summary 是英文硬编码
- `RoleFitReportBlock` 的 section title 仍是英文
- workspace 没有显示 `summary`、来源消息、更新时间等 metadata

### 7. 当前几乎没有针对 workspace 的测试护栏

当前仓库里没有覆盖这条新链路的应用级测试。

影响最大的是这些行为：

- 同一个 tool output 不应重复应用
- clear workspace 之后不应自动回放旧 artifact
- `append / replace / update` 语义必须稳定
- thread 切换和 hydration 后，active artifact 应保持可预测

这部分如果不补测试，后续每次改同步逻辑都很容易把之前的问题带回来。

---

## 下一轮改进计划

### Phase 1：先把 workspace runtime 收紧

目标：

- 解决“旧 tool 输出被回放”
- 把 artifact 同步从页面组件中抽离
- 让 clear / remove / update 语义真正成立

建议动作：

- 在 `ThreadWorkspaceState` 里加入独立的 `appliedToolOutputIds` 或同等 cursor
- 不再从 `artifacts` 反推哪些输出已经处理过
- 新增 `useWorkspaceSync(threadId, messages, workspaceState)` 或同等 hook
- 把 `extractArtifactPayload`、legacy tool 归一化、operation 应用逻辑都迁出去
- 把“清空工作区”定义成只清空 artifact，不回滚消息，也不重放旧输出
- 为 remove / clear 预留 tombstone 或 acknowledgement 机制

交付结果：

- workspace 具有稳定的幂等行为
- 页面组件只负责布局和渲染
- 同步逻辑可以独立测试

### Phase 2：把 tool 协议做成真正可维护的协议

目标：

- 收紧 payload
- 让 agent 的 targeting 规则更明确
- 降低“模型输出刚好符合约定”的侥幸成分

建议动作：

- 把 `build_ui_block` 改成 discriminated union schema，而不是宽泛 `record`
- 为每种 artifact 定义独立 schema
- 明确 `replace` 的语义
- 让 `focus` 真正驱动 active artifact
- 重新设计 targeting 方式
- 如果模型端拿不到 `artifactId`，就不要把它作为主要机制
- 引入更稳定的 `slotKey`、`artifactKey` 或 “update active artifact of this type” 语义

交付结果：

- agent 输出更稳定
- 前后端对 artifact payload 的理解一致
- 后续新增 artifact 时不会继续复制粘贴分支逻辑

### Phase 3：补足 loading、metadata 和交互细节

目标：

- 让 workspace 不只是“能用”，而是像真正的工作区

建议动作：

- 用真实的 pending visual intent 替代“把最后一个 artifact 标成 updating”
- 在 `input-available` 阶段就建立 pending 状态
- 为 append 和 update 区分不同 loading 表现
- `WorkspacePanel` 真正消费 `isBusy` 或等价状态
- 显示 artifact `summary`
- 显示来源消息或最近更新时间
- 给 clear workspace 增加确认或 undo
- ArtifactList 增加状态提示，而不是只有选中态

交付结果：

- 用户能理解 AI 正在更新什么
- workspace 的状态变化更自然
- 删除、清空、切换 artifact 的体验更可靠

### Phase 4：收口 i18n 和内容呈现

目标：

- 保证中英文模式下 workspace 体验一致
- 让 recruiter 场景的 artifact 更有证据感

建议动作：

- 把 artifact label、legacy summary、fallback 文案全部迁到 `next-intl`
- `RoleFitReportBlock` 补齐中英文标题
- 给 `matchedProjects`、`matchedArticles` 增加 slug、href 或 source id
- 让 role-fit-report 不只是“结论卡”，而是“带证据的结论卡”

交付结果：

- 双语体验完整
- role-fit-report 更贴合 portfolio / recruiter 场景
- workspace 的 artifact 不只是展示，而是可追溯

### Phase 5：补测试和回归护栏

目标：

- 让这条链路后续可迭代，而不是每次都靠手测

建议动作：

- 给 workspace sync 提炼纯函数或 reducer
- 为幂等、clear、remove、replace、focus 写单元测试
- 为 hydration 和 thread 切换写最小集成测试
- 把当前已修过的 streaming / codeblock 稳定性问题加入回归清单

交付结果：

- 关键行为可验证
- 后续继续扩展 artifact 类型时更安心

---

## 建议的实施顺序

如果只做一轮高价值迭代，我建议按下面顺序推进：

1. 先做 Phase 1，解决 workspace replay 和同步逻辑收口
2. 再做 Phase 2，把 schema、focus、targeting 一次性理顺
3. 然后做 Phase 3，补 pending / metadata / clear UX
4. 最后做 Phase 4 和 Phase 5，完成 i18n 收口与测试护栏

原因：

- Phase 1 和 Phase 2 解决的是“未来越做越乱”的问题
- Phase 3 解决的是“用户能不能感知这套系统在稳定工作”的问题
- Phase 4 和 Phase 5 则是把这套 V1 从 demo 水平推到可持续迭代的水平

---

## 下一轮实施的建议范围

如果下一步准备继续写代码，我建议这一轮只做下面这些，不要同时再加新 artifact：

- 重构 workspace sync runtime
- 修正 clear / remove 后的 replay 风险
- 收紧 `build_ui_block` schema
- 补 `focus` 和 pending visual intent
- 收口 workspace 内部 i18n

暂时不要做：

- 新的复杂 artifact 类型
- 数据库存储
- 分享链接
- sandbox 执行
- 多 agent

理由：

- 现在最值钱的是把 V1 的“系统边界”做稳
- 这些边界一旦稳住，后面的 recruiter copilot、artifact history、sandbox mode 都会容易很多
