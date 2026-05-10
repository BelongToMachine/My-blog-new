# AI Lab Chat UI 优化落地方案

## 文档目标

把当前 AI Lab 页面从“有风格的展示页”推进到“更像真实 AI 产品的作品集助手”。

这份文档只覆盖以下 5 个方向：

- `1` 聊天区层级
- `3` 左侧历史栏
- `4` 输入框区域
- `8` 背景网格
- `9` 推荐提问

文档重点不是抽象建议，而是基于当前代码结构，给出可以直接执行的现实改动方案。

---

## 范围说明

### 本轮包含

- 空状态与对话状态的视觉切换
- chat-first 的页面层级重排
- 历史栏产品化增强
- 输入区交互和状态细化
- 推荐问题的 UI 与数据结构
- AI 页局部的网格降噪与阅读优化

### 本轮不包含

- 模型 provider、限流、接口稳定性改造
- 多 agent / 多工具编排改造
- workspace 协议重写
- 上传能力的完整实现
- 数据库 schema 强制变更

### 为什么这轮不先改 agent / workspace 协议

当前代码里，workspace 的 `surface / reveal / priority` 其实已经接好了。

相关位置：

- `app/hooks/useWorkspaceSync.ts`
- `app/types/ai-workspace.ts`
- `doc/ai-lab-chatbox-first-plan.md`

也就是说，当前更大的问题不是“协议没有”，而是“chat 主区和空状态的产品层级还没拉开”。因此这轮优先处理 UI 和体验层。

---

## 当前代码基线

以下内容基于当前仓库快照整理。

### 1. 页面主结构

主页面在：

- `app/[locale]/ai/AIPlayground.tsx`

当前结构大致是：

1. 顶部 header
2. `section-shell` 主容器
3. 左侧 sidebar
4. 中间 chat main
5. 右侧 workspace panel

其中顶部 header 里的大标题始终存在，没有根据“是否已经开始聊天”切换状态。

### 2. 空状态与对话状态没有分离

当前聊天区空状态在 `ChatMessagesViewport` 内部处理：

- 没有消息时显示 `>_`
- 下方显示一段说明文案

问题是：

- 它更像占位，不像真正的 onboarding
- 没有推荐问题
- 没有引导访客快速发起第一轮提问
- 没有和顶部大标题形成“进入对话后收起”的完整状态切换

### 3. 输入区是“文本框 + 独立按钮”的并列布局

当前输入区在 `ChatComposer`：

- `Textarea`
- 右侧 `Button`
- 底部 token 风险提示

已具备：

- `Enter` 发送
- `Shift + Enter` 换行
- `loading / slow / verySlow / cancel`

但还缺少：

- 输入框与按钮的一体化感
- 更自然的按钮状态文案
- 自适应高度
- 更强的 focus 反馈
- 快捷提示文案

### 4. 历史栏已有基础能力，但产品感偏弱

当前左侧栏已经有：

- 新建对话
- 当前线程选中
- 删除对话
- 对话条数 footer
- 移动端 drawer 基础

但仍有几个明显短板：

- 当前选中态只靠边框和浅底色
- 没有搜索入口
- `thread.title` 还是首条用户输入截断
- 底部状态栏信息量偏弱
- 视觉层级不够像可持续使用的聊天产品

### 5. 网格噪音来自两层叠加

当前网格主要有两层来源：

1. 全局 `body` 背景
2. `.panel-grid / .section-shell`

相关文件：

- `app/globals.css`

这意味着如果直接全局改 `.panel-grid`，会波及整站，不适合把 AI Lab 的降噪需求粗暴扩散到所有页面。

### 6. 线程标题策略当前非常原始

当前线程标题生成逻辑在：

- `app/hooks/useChatThreads.ts`

规则是：

- 取第一条 user message
- 截断到约 24 个字符
- 否则默认为 `New Chat`

这对作品集助手来说不够产品化，也不利于历史栏的可扫描性。

---

## 目标体验

## 总体目标

让用户进入 AI Lab 时感受到：

1. 这是一个可以直接提问和继续追问的聊天产品
2. 聊天区是绝对主角
3. 页面保留作品集气质，但不会压住功能体验
4. 即使是第一次访问，也能在 3 秒内知道“可以问什么”

---

## 目标状态设计

### A. 空状态

空状态仍然允许保留大标题和品牌气质，但要变成真正的起始页。

空状态应该包含：

- 大标题
- 简短说明
- 推荐问题 chips
- 输入框
- 必要时的辅助说明

空状态的职责：

- 告诉用户这个 AI 能回答什么
- 降低首次提问成本
- 保持作品集的展示气质

### B. 对话状态

一旦用户已经发送过至少一条消息，页面进入对话状态。

对话状态应该切成：

- 小型顶部栏
- 主要聊天内容
- 固定输入区
- 历史栏作为辅助导航

对话状态的职责：

- 让阅读和追问成为主流程
- 收起“宣传型”视觉元素
- 保持产品连续性

---

## 详细落地方案

## 1. 聊天区层级优化

### 目标

让“聊天内容”和“输入框”成为页面第一优先级。

### 当前问题

- 顶部大标题在已进入对话后仍然占据较强注意力
- chat 容器视觉上像页面里的一个模块，而不是页面主体
- 空状态和对话状态没有明确切换

### 建议实现

#### 1. 增加显式状态判断

在 `AIPlayground.tsx` 中新增：

```ts
const hasStartedConversation = Boolean(
  activeThread?.messages?.some((message) => message.role === "user")
)
```

不要用 `activeThread` 是否存在作为判断依据，因为当前 `useChatThreads()` 在没有数据时会自动创建空线程。

#### 2. 顶部 header 改成双态

当前 header 逻辑全部写在 `AIPlayground.tsx` 顶部。

建议拆成两个展示态：

##### 空状态 header

- 保留 `eyebrow`
- 保留大标题 `title`
- 保留当前说明 `description`
- 保留 workspace 入口，但权重降低

##### 对话状态 header

- 改成紧凑型顶部栏
- 文案不再使用现有大标题

建议新增文案：

- 中文：`AI 实验室 · Jie AI Assistant`
- 中文副标题：`了解经历、项目、技术栈与工作方式`
- 英文：`AI Lab · Jie AI Assistant`
- 英文副标题：`Experience, projects, stack, and working style`

#### 3. 主容器结构保持不变，但视觉重心前移

现有的：

- sidebar
- chat main
- workspace panel

不需要推翻。

本轮只调整：

- header 高度与内容密度
- 空状态内容层级
- main chat surface 的视觉安静程度

#### 4. 组件拆分建议

`AIPlayground.tsx` 已经比较长，建议本轮顺手拆出：

- `app/[locale]/ai/components/CompactChatHeader.tsx`
- `app/[locale]/ai/components/ChatLandingState.tsx`
- `app/[locale]/ai/components/ThreadSidebar.tsx`

拆分目标：

- 把页面状态切换逻辑从大文件里解耦
- 让空状态、历史栏、紧凑头部能独立迭代

### 涉及文件

- `app/[locale]/ai/AIPlayground.tsx`
- `app/messages/zh.json`
- `app/messages/en.json`
- 可选新增 `app/[locale]/ai/components/*`

### 验收标准

- 第一次进入页面仍然有作品集气质
- 发送第一条消息后，大标题收缩为紧凑栏
- 已进入对话时，第一眼看到的是消息区和输入区，而不是宣传标题

---

## 3. 左侧历史栏优化

### 目标

让左侧栏更像真实聊天产品的历史管理区，而不是静态装饰栏。

### 当前问题

- 选中态识别不够强
- 标题是“原始输入截断”，可读性弱
- 缺少搜索入口
- 底部状态栏过于单薄

### 建议实现

### 3.1 选中态增强

当前选中态是：

- `border-primary/60`
- `bg-primary/[0.08]`

建议叠加 4 层：

1. 左侧 `2px` cyan 竖条
2. 更亮的背景色
3. 标题文字更亮
4. 时间文字提升一档对比度

建议改法：

- 在线程卡片内部增加一个绝对定位的左边条
- 仅在 `thread.id === activeThreadId` 时显示

这样即使整个页面已经有很多边框元素，当前对话也仍然足够清楚。

### 3.2 新增搜索框

建议在 `新建对话` 按钮下方增加一个搜索输入。

表现建议：

- 当 `threads.length < 6` 时可不显示
- 当 `threads.length >= 6` 时显示
- placeholder:
  - 中文：`搜索对话...`
  - 英文：`Search chats...`

实现建议：

- 复用 `app/components/ui/input.tsx`
- 不新增复杂搜索逻辑
- 只做本地前端过滤

建议新增状态：

```ts
const [threadQuery, setThreadQuery] = useState("")
const filteredThreads = useMemo(() => { ... }, [threads, threadQuery])
```

匹配字段建议：

- `thread.title`
- 未来如果有 `summary`，再补 `thread.summary`

### 3.3 标题策略分两步做

这是本轮最值得明确的地方。

#### V1：只改显示，不改数据库

新增一个显示层函数：

```ts
function deriveThreadDisplayTitle(thread: ChatThread, locale: string): string
```

优先级建议：

1. 若有显式 `summary`，优先展示
2. 否则对当前 `title` 做轻量语义化处理
3. 再不行回退到 `New Chat / 新对话`

V1 的目标不是“真正 AI 摘要”，而是让常见标题更自然。

例如：

- `tell me about jie` -> `关于 Jie 的介绍`
- `hi` -> `打招呼`
- `new chat` -> `新对话`

这一步只影响展示，不改持久化结构，成本最低。

#### V2：再考虑持久化摘要

如果后面希望：

- 跨设备一致
- 中英文更准确
- 标题真正来自消息语义

再做第二阶段：

- Prisma 增加 `summary` 或 `displayTitle`
- 前端和 API 一起持久化

这一步会涉及：

- `prisma/schema.prisma`
- `app/hooks/useChatThreads.ts`
- `app/api/ai/threads/[id]/messages/route.ts`
- 以及 migration

本轮不建议把它和 UI 一起硬绑。

### 3.4 底部状态栏增强

当前只有：

- `X 条对话`

建议改为：

- 中文：`X 条对话 · 自动保存`
- 英文：`X chats · Auto-saved`

这里不建议写“本地保存”，因为当前真实行为是：

- 服务端持久化优先
- localStorage 作为 fallback

“自动保存”更准确，也更符合用户心智。

### 3.5 移动端保持 drawer，不再额外加复杂结构

当前移动端 sidebar drawer 已经有基础实现。

这轮只需要：

- 让 header 与 drawer 的关系更清楚
- 让当前对话在 drawer 中的选中态更明显

不需要再重写移动端结构。

### 涉及文件

- `app/[locale]/ai/AIPlayground.tsx`
- `app/hooks/useChatThreads.ts`
- `app/messages/zh.json`
- `app/messages/en.json`
- 可选新增 `app/[locale]/ai/components/ThreadSidebar.tsx`

### 验收标准

- 当前对话在侧栏里一眼可辨
- 线程数较多时可以快速搜索
- 历史标题比“原始输入截断”更可读
- 底部栏看起来像状态区，而不是残留文案

---

## 4. 输入框区域优化

### 目标

把输入区从“表单控件”提升为“页面核心操作区”。

### 当前问题

- 文本框和按钮是并列关系，不像一个整体
- 按钮文案 `开始提问` 不适合进入多轮对话后继续使用
- 输入区 focus 感弱
- 长输入时空间适配不足
- 快捷操作提示缺失

### 建议实现

### 4.1 输入框和按钮合并成统一容器

保留当前 `Textarea` 和 `Button`，但改外层结构。

建议从：

```tsx
<form className="flex items-end gap-3">
  <Textarea />
  <Button />
</form>
```

改成：

```tsx
<form className="...">
  <div className="relative flex-1 border-2 ...">
    <Textarea className="border-0 ..." />
    <Button className="absolute bottom-3 right-3 ..." />
  </div>
</form>
```

这样输入区在视觉上会更像统一的 AI composer。

### 4.2 按钮文案改成双阶段

建议规则：

- 空线程首问：`开始提问`
- 已进入对话：`发送`
- 生成中：`思考中...` 或主按钮切为 `停止生成`

更推荐的最终规则：

- 默认：`发送`
- 首问时通过 surrounding copy 表达“开始”
- 正在生成时主操作切成 `停止生成`

原因：

- 多轮对话里一直看到“开始提问”会不自然
- AI 产品更强调当前动作，而不是首次引导

### 4.3 自适应高度

当前 `Textarea` 最小高度是固定的。

建议新增逻辑：

- 初始高度：`56px` 或 `64px`
- 最大高度：`160px`
- 超过最大后内部滚动

实现方式：

- 不需要第三方库
- 使用 `textareaRef.current.scrollHeight`
- 在 `input` 变化时动态设置高度

伪代码：

```ts
const resizeTextarea = () => {
  const el = textareaRef.current
  if (!el) return
  el.style.height = "0px"
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`
}
```

### 4.4 focus 态增强

当前 `Textarea` 有 `focus-visible:border-primary`，但整体感还是不够强。

建议增强到外层容器：

- `border-primary/70`
- `shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]`
- 深色主题下可以加非常轻微的 cyan 外扩

注意：

- 不要改成强玻璃感
- 不要引入过重 glow
- 只做“可感知焦点”，不做炫技

### 4.5 快捷操作提示

在 token 行旁边增加：

- 中文：`Enter 发送 · Shift+Enter 换行`
- 英文：`Enter to send · Shift+Enter for newline`

建议布局：

- 左侧：快捷提示
- 右侧：`~2.5k tokens · 风险低`

这样比单独展示 token 更像真实聊天产品。

### 4.6 状态条与取消操作整合

当前 slow / verySlow / connecting 文案在输入框上方单独显示，右侧是取消链接。

本轮建议保留这个模式，不做大改，只做两点微调：

1. 文案更像系统反馈，而不是错误提示
2. 当 `isBusy` 时，主按钮与顶部取消行为要一致

可选方案：

- 保留顶部 `取消`
- 或把主按钮在忙碌时切成 `停止生成`

本轮建议先保留顶部取消，减少改动面。

### 4.7 为推荐问题预留填充能力

输入框需要支持两种外部触发：

1. 推荐问题直接发送
2. 推荐问题填入输入框

因此 `ChatComposer` 建议新增可控入口：

```ts
onPrefillPrompt?: (prompt: string) => void
onSendPrompt?: (prompt: string) => void
```

更现实的做法是：

- 把 `input` 提升一层到 `ChatThreadView`
- 或给 `ChatComposer` 增加 `externalDraftKey / initialDraft`

为了避免过度改动，本轮更推荐：

- `ChatComposer` 内部暴露 `ref`
- `ChatLandingState` 点击 chip 后通过父层传值

### 涉及文件

- `app/[locale]/ai/AIPlayground.tsx`
- `app/components/ui/textarea.tsx`
- `app/components/ui/button.tsx`
- `app/messages/zh.json`
- `app/messages/en.json`

### 验收标准

- 输入区看起来是一个统一组件
- 长问题可以自然扩展
- 用户能明确知道发送和换行规则
- 已有对话时，按钮文案不再显得生硬

---

## 8. 背景网格优化

### 目标

保留 AI Lab 的实验室 / 像素科技气质，但降低阅读干扰。

### 当前问题

- 全局 `body` 网格已经存在
- `section-shell` 又叠了一层局部 panel grid
- 消息卡片背景不够实，网格会透进正文
- chat、input、sidebar 都是线性元素，叠加后显得偏繁

### 核心原则

这轮不要直接全局削弱整站的 `.panel-grid`。

原因：

- `.panel-grid` 被很多页面共用
- AI Lab 的阅读降噪需求不应该直接改动全站基调

### 建议实现

### 8.1 只为 AI 页面增加局部样式类

建议在 `app/globals.css` 增加局部 utility，例如：

- `.ai-chat-shell`
- `.ai-chat-pane`
- `.ai-sidebar-pane`
- `.ai-composer-pane`

目标：

- 局部覆盖 AI Lab，而不是修改所有 panel

### 8.2 中心阅读区加遮罩，而不是直接去网格

建议在 chat 主区后加一层轻遮罩：

```css
background:
  radial-gradient(
    circle at center,
    color-mix(in srgb, hsl(var(--background)) 94%, transparent),
    color-mix(in srgb, hsl(var(--background)) 72%, transparent)
  );
```

效果：

- 中间阅读区更安静
- 页面边缘仍保留科技氛围

### 8.3 消息卡片提高底色实度

建议调整：

- assistant bubble：从 `bg-background/60` 提高到 `bg-background/82~88`
- user bubble：从 `bg-primary/[0.06]` 提高到 `bg-primary/[0.10~0.12]`

这样文字会更清晰，网格不会在正文下面一直闪存在感。

### 8.4 输入区底板更安静

当前输入区下方仍能感到很多背景纹理。

建议：

- 输入区外层增加更实的深色底板
- 让 `Textarea` 自身背景尽量纯净

目标不是去风格，而是让输入动作更可靠。

### 8.5 历史栏网格比主聊天区稍明显

因为历史栏信息密度低、阅读成本低，可以允许比 chat 主区稍微多一点纹理。

也就是说：

- chat 主区：最安静
- 输入区：更安静
- sidebar：适中
- 页面外围：最保留风格

### 涉及文件

- `app/globals.css`
- `app/[locale]/ai/AIPlayground.tsx`

### 验收标准

- AI 页仍然是像素 / 实验室气质
- 消息阅读明显更轻松
- 输入区不再被背景纹理抢注意力
- 不影响整站其他页面的 panel 风格

---

## 9. 推荐提问优化

### 目标

降低第一次使用的门槛，让访客第一眼就知道“这个 AI 能回答什么”。

### 当前问题

当前只有 placeholder 在隐性提示能力，但它不够主动。

### 建议实现

### 9.1 推荐问题只在空状态强展示

第一阶段推荐方案：

- 空状态主区域强展示
- 进入对话后改成较轻的二级入口

不要一开始就在对话态里塞太多 chips，否则会再次分散聊天区注意力。

### 9.2 推荐问题的数据结构

建议新增：

- `app/[locale]/ai/recommendedPrompts.ts`

推荐结构：

```ts
export type SuggestedPrompt = {
  id: string
  label: string
  prompt: string
  mode: "send" | "fill"
  audience?: "recruiter" | "engineer" | "client" | "general"
}
```

这样可以支持：

- 简短 chip 直接发送
- 长模板先填入输入框
- 后面根据访客类型分组

### 9.3 初版建议问题集

中文：

- `他的技术栈是什么？`
- `介绍一个代表项目`
- `他适合什么岗位？`
- `他的前端优势是什么？`
- `用英文介绍 Jie`

英文：

- `What is his tech stack?`
- `Show me a representative project`
- `What roles fit Jie best?`
- `What are his frontend strengths?`
- `Introduce Jie in English`

### 9.4 交互模式

建议规则：

- 短问题：点击即发送
- 长模板：点击填入输入框

这是最符合作品集助手场景的折中方案。

### 9.5 对话态的轻量推荐

进入对话后不需要保留一整块推荐区。

可选两种较轻方案：

#### 方案 A

在输入框上方显示一行 `继续了解：`

例如：

- `项目经验`
- `技术栈`
- `工作方式`
- `英文简介`

#### 方案 B

在第一条 assistant 欢迎消息中带推荐按钮

本轮优先推荐 `方案 A`，因为实现更轻，也不需要改消息生成链路。

### 9.6 预留上下文推荐，但本轮不硬做

理想状态下，推荐问题应随上下文变化。

例如：

- 问过 `Tell me about Jie` 之后，推荐变成 `看项目 / 看技术栈 / 生成英文简介`

但这会让推荐逻辑和消息状态耦合更深。

本轮建议只做：

- 空状态静态推荐
- 对话态轻量静态推荐

上下文感知推荐留到第二阶段。

### 涉及文件

- `app/[locale]/ai/recommendedPrompts.ts`
- `app/[locale]/ai/AIPlayground.tsx`
- `app/messages/zh.json`
- `app/messages/en.json`
- 可选新增 `app/[locale]/ai/components/RecommendedPromptChips.tsx`

### 验收标准

- 首次进入页面的用户能快速理解可提问范围
- 至少一部分用户会直接通过推荐问题发起第一轮提问
- 推荐问题不会在进入对话后继续压住主聊天区

---

## 建议的文件改动清单

## 必改文件

- `app/[locale]/ai/AIPlayground.tsx`
- `app/messages/zh.json`
- `app/messages/en.json`
- `app/globals.css`

## 建议新增文件

- `app/[locale]/ai/recommendedPrompts.ts`
- `app/[locale]/ai/components/CompactChatHeader.tsx`
- `app/[locale]/ai/components/ChatLandingState.tsx`
- `app/[locale]/ai/components/ThreadSidebar.tsx`
- `app/[locale]/ai/components/RecommendedPromptChips.tsx`

## 暂时不改或延后改

- `prisma/schema.prisma`
- `app/api/ai/threads/[id]/messages/route.ts`
- `app/api/ai/chat/route.ts`
- `app/hooks/useWorkspaceSync.ts`

说明：

- 这些文件并不是无关，而是当前不是本轮 UI 提升的阻塞点
- 除非要做“线程摘要持久化 V2”，否则不需要动 schema 和 API

---

## 推荐的 PR 切分

## PR 1：Chat-first 层级与空状态

内容：

- 增加 `hasStartedConversation`
- 顶部 header 双态切换
- 新增空状态 landing
- 接入推荐问题 chips
- 完成首问路径优化

目标：

- 先解决“第一眼看不出聊天是主角”的问题

## PR 2：输入区与左侧栏产品化

内容：

- composer 结构重构
- 自适应高度
- 快捷提示
- 侧栏搜索
- 选中态增强
- display-only 线程标题优化
- 底部状态栏增强

目标：

- 提高可持续使用感

## PR 3：网格降噪与细节 polish

内容：

- AI 页局部样式类
- chat 主区遮罩
- 消息卡片底色优化
- 输入区底板优化
- 历史栏 / chat / workspace 三者的纹理分层

目标：

- 在保留风格的前提下提升阅读体验

---

## 风险与权衡

## 1. 不要把空状态做得过重

空状态要引导，但不能重新变回一页 landing page。

控制原则：

- 内容有重点
- chips 数量克制
- 输入框始终是可见主操作

## 2. 不要为了“标题摘要”引入过早的数据迁移

线程标题优化是有价值的，但本轮先做 display-only 版本更稳。

## 3. 不要全局改弱 `.panel-grid`

这会影响整站的像素系统一致性。

AI Lab 的降噪应优先通过局部样式解决。

## 4. 推荐问题不要在对话态过度常驻

否则会再次和消息流抢层级。

---

## 验收清单

完成这轮后，至少应满足：

- 用户首次进入 AI Lab 时，能立即理解这个 AI 可以问什么
- 用户发送第一条消息后，顶部大标题会收缩成紧凑栏
- 主视觉焦点从“宣传标题”切换到“消息内容 + 输入区”
- 左侧历史栏的当前选中态更清晰
- 历史栏支持基础搜索
- 输入区具备更强的一体化感和更清晰的交互提示
- 背景网格仍然保留风格，但不会明显干扰正文阅读
- 推荐问题能提高首次提问效率，但不会破坏进入对话后的主层级

---

## 推荐执行顺序

实际实施时，建议按照下面顺序推进：

1. 先调整聊天区层级，让对话内容成为主角
2. 再优化输入框，让提问动作更自然
3. 加推荐提问，提高首次使用转化
4. 优化左侧历史栏，让它更像可持续使用的产品功能
5. 最后微调背景网格，提升阅读体验

如果按“最值得优先做”的影响排序：

1. 聊天区层级
2. 左侧历史栏
3. 推荐提问

---

## 结论

这轮不需要推倒 AI Lab，也不需要先重写 agent。

真正高收益的工作是：

- 把 `chat-first` 的结构彻底做实
- 把空状态变成会引导提问的入口
- 把侧栏和输入区做成更像产品的控件
- 把风格从“炫围”收束到“服务阅读和提问”

只要把这 5 个方向按阶段推进，当前 AI Lab 会从“已经有气质的实验页”，升级成“真正可用、可探索、可持续对话的作品集助手”。
