# AI Lab Chatbox-First Plan

## 目标

把当前 AI Lab 的产品重心从 `workspace-first` 调整为 `chatbox-first`。

新的核心原则：

- chatbox 是绝对主角
- workspace 只在必要时作为 sidecar / artifact panel 出现
- 默认不打扰用户，不抢占主视觉，不频繁自动展开
- 用户始终可以手动展开、收起、忽略它

这个方向更接近 `claude.com` 的 artifact 使用方式：

- 对话先行
- artifact 是补充，而不是页面主结构
- 只有当输出明显更适合脱离消息流时，才进入 panel

---

## 为什么要调整

当前 workspace artifact 虽然已经具备技术能力，但产品职能还不够突出，容易出现两个问题：

1. 它会分散 chatbox 的主叙事  
用户本来是在和 AI 对话，但页面视觉上容易被“右侧工作区”抢走注意力。

2. 它出现得太频繁  
如果 profile、project list、article list 这类结果也频繁进入 workspace，用户会觉得 panel 在“动不动就弹出来”，而不是在真正帮忙。

因此这次调整不是删除 workspace，而是给它重新定位：

- 从“主工作台”降级为“按需展开的 artifact panel”
- 从“默认展示”改成“必要时展示”

---

## 新的产品定位

### Chatbox

chatbox 负责：

- 承接用户提问
- 流式输出回答
- 完成绝大多数普通问答、解释、总结、推荐
- 作为整个 AI Lab 的默认体验

### Workspace / Artifact Panel

workspace 只负责：

- 展示高密度结构化结果
- 承接不适合挤在聊天流里的内容
- 让用户在需要时查看、切换、收起 artifact

它不再承担：

- 默认并排常驻展示
- 所有 visual result 的主要承载层
- 每轮问答都自动打开

---

## 核心产品决策

### 1. 默认收起

Desktop：

- workspace 改成可收缩 side panel
- 默认关闭
- 仅保留一个轻量入口按钮，可带 artifact 数量 badge

Mobile / Tablet：

- workspace 改成 drawer、sheet 或底部面板
- 默认关闭
- 不再维持“Chat / Workspace”双 tab 的强存在感

### 2. 自动展开次数大幅减少

只有满足以下条件之一时，才允许自动 reveal：

- 用户明确要求“展示出来”“打开 side panel”“做成对比表 / 时间线 / 报告”
- 输出是高密度结构化结果，在消息流里会明显降低可读性
- 这是当前回答最主要的价值承载形式

如果只是普通补充信息，就不自动展开。

### 3. 不是所有 artifact 都值得进 panel

建议分层：

- `高优先级 artifact`
  - `comparison-table`
  - `timeline`
  - `role-fit-report`

- `低优先级 artifact`
  - `profile-card`
  - `project-grid`
  - `article-summary`

默认策略：

- 高优先级 artifact 可以进入 panel，但也不一定自动展开
- 低优先级 artifact 默认不自动进入 panel，优先在 chat 中完成表达

### 4. chat 里要有“轻回执”，但不要强打断

当 artifact 已生成但未自动展开时，chat 里只显示轻量提示，例如：

- `已准备一份项目对比表，可展开查看`
- `已整理成时间线，需要的话我可以打开侧边面板`

这样用户知道 AI 做了额外准备，但不会被强制打断当前阅读节奏。

---

## 展示触发规则

### A. 只在 chat 中回答

适用于：

- 普通问答
- 简短总结
- 招聘向概述
- 单个项目介绍
- 简单推荐
- 轻量背景说明

结果：

- 不生成 artifact
- 或即使生成内部结构，也不落到 panel

### B. 生成 artifact，但不自动展开

适用于：

- 用户可能需要结构化结果，但没有明确要求打开
- 结果在 chat 中可以简述，但完整版本更适合 panel

结果：

- artifact 保存到 workspace
- panel 保持收起
- chat 显示轻回执

### C. 生成 artifact，并自动展开

适用于：

- 用户明确要求展示
- 结果必须依赖结构化版式才有价值
- 比如对比、筛选、时间线、岗位匹配报告

结果：

- artifact 落入 workspace
- panel 自动 reveal

---

## 当前实现需要怎么改

### 1. 调整 agent 策略

文件：

- `lib/ai/portfolio-agent.ts`

需要修改：

- 明确要求 agent 默认优先文本回答
- 只有在高密度结构化场景下才调用 `build_ui_block`
- 即使调用 `build_ui_block`，也不默认要求自动 reveal

新增规则建议：

- `surface: "chat" | "artifact"`
- `reveal: boolean`
- `priority: "low" | "high"`

其中：

- `surface = "chat"` 表示只在消息流里呈现
- `surface = "artifact"` 表示允许进入 panel
- `reveal = true` 才自动展开

### 2. 调整 tool 协议

文件：

- `lib/ai/portfolio-tools.ts`
- `app/types/ai-workspace.ts`

需要修改：

- 在现有 `build_ui_block` payload 上补 `surface / reveal / priority`
- 把“是否展示”和“是否自动展开”从前端猜测，变成协议的一部分

### 3. 调整 workspace runtime

文件：

- `app/hooks/useWorkspaceSync.ts`
- `app/hooks/useThreadWorkspace.ts`

需要修改：

- 只有 `surface === "artifact"` 时才落入 workspace
- 只有 `reveal === true` 时才触发展开 panel
- legacy tools 不再默认自动生成 workspace artifact
- panel open/close 状态需要独立持久化

### 4. 调整 UI 结构

文件：

- `app/[locale]/ai/AIPlayground.tsx`
- `app/components/ai-workspace/WorkspacePanel.tsx`

需要修改：

- desktop 从固定双栏改成“主 chat + 可收起 side panel”
- mobile 从双 tab 改成 drawer / sheet
- 添加一个始终可见但不强打扰的 artifact 入口
- 收起后继续聊天时，panel 不应重新自动弹出，除非新结果明确 `reveal`

### 5. 调整回执文案

文件：

- `app/messages/en.json`
- `app/messages/zh.json`
- `app/[locale]/ai/AIPlayground.tsx`

需要修改：

- chat receipt 不再默认用“Generated artifact”
- 改成更像协助式文案
- 强化“已准备，可展开查看”这类非打断式提示

---

## 建议实施顺序

### Phase 1：先收口行为规则

- 改 agent prompt
- 改 tool schema
- 改 reveal 触发逻辑

目标：

- 先让 workspace “少出现”

### Phase 2：再改 UI 结构

- 去掉默认双栏强存在感
- 上 desktop collapsible panel
- 上 mobile drawer / sheet

目标：

- 让 workspace “出现时也不喧宾夺主”

### Phase 3：最后打磨文案和体验

- 调整 receipt
- 调整 badge / entry button
- 调整收起后的行为记忆

目标：

- 让整个 AI Lab 更像“强 chatbox + 可选 artifact”

---

## 验收标准

这轮改完后，应满足：

1. 用户进入 AI Lab 时，默认感知到的是 chatbox，而不是 workspace
2. 普通问答不会轻易触发 artifact panel
3. artifact 只有在必要时才生成，只有在更必要时才自动展开
4. 用户可以手动展开 / 收起 panel，且收起后不会频繁被重新打断
5. `comparison-table`、`timeline`、`role-fit-report` 这类高密度结果仍然有能力被优雅承载

---

## 当前假设

这份计划先基于以下假设推进：

- workspace 不删除，只降级为 sidecar
- `comparison-table / timeline / role-fit-report` 保留为主要 artifact 类型
- `profile-card / project-grid / article-summary` 不再默认自动展示
- 这轮先不改 agent 数量，不引入多 agent

如果这些假设后续有变化，再在实现前调整协议即可。
