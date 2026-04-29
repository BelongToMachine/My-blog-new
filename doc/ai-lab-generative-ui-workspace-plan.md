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
- “加上 某金融科技公司 经验”

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
- “把 某金融科技公司 经验放进去”
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
