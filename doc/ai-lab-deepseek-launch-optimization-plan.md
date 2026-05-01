# AI Lab 上线优化计划（MiniMax First）

## 目标

在不重写整套基础设施的前提下，把当前 AI Lab 优化到一个适合公开上线的状态：

- 部署环境：Vercel Hobby
- 模型策略：当前阶段优先使用现有 `MiniMax` 订阅，仍按省 token 原则设计
- 产品目标：宁可慢一点，也不要“没反应”或直接崩
- 架构边界：继续保持当前 `Vercel AI SDK + 单 agent + thread chat runtime` 主线

当前执行原则：

- 先基于现有 `MiniMax` 实现把 AI Lab 做稳
- 不为“将来可能切 DeepSeek”提前重写大量代码
- 只提前抽出 provider 层，给后续迁移留接口

这份方案默认面向你当前代码现状，而不是从零设计。

---

## 当前代码基线

基于现有实现，AI Lab 已经具备这些基础：

- `app/api/ai/chat/route.ts`
  - 已有一个非常轻量的服务端限流入口
  - 已有 `MAX_CONTEXT_MESSAGES = 12` 的消息裁剪
- `lib/ai/rate-limit.ts`
  - 目前还是单机内存 `Map` 版限流
  - 适合本地开发，不适合 Vercel 多实例 / 冷启动场景
- `app/context/GlobalChatRuntimeContext.tsx`
  - 已有全局持久 `Chat` registry
- `app/hooks/useThreadChat.ts`
  - 已有 thread 级别 chat 订阅
  - 已有约 `300ms` 的消息持久化节流
- `app/hooks/useChatThreads.ts`
  - 已有 thread 本地持久化与 API fallback
- `lib/ai/portfolio-agent.ts`
  - 已是单 agent 架构
  - 已经约束 `build_ui_block` 只在结构化输出时调用
- `app/[locale]/ai/AIPlayground.tsx`
  - 已有真实流式 chat UI
  - 已有 `isBusy`、`loading`、`stop` 这类基础状态承接能力

结论：

- 你现在不需要推倒重做
- 重点应该放在“把当前链路做硬、做稳、做省”

---

## 平台约束与迁移前提

截至 `2026-05-01`，当前阶段更需要关注这些平台约束：

- Vercel Hobby 的 Node.js Functions 默认 / 最大时长都是 `300s`，默认 / 最大内存都是 `2 GB`
- Vercel Edge 需要在 `25s` 内开始发送响应，才能继续长时间 streaming
- Upstash Ratelimit 是 HTTP-based，明确面向 Vercel / serverless
- Vercel AI Gateway 支持 all plans、BYOK、budgets、monitoring、fallbacks，且 token 无 markup

这些约束决定了：

- 首版不要押注 Edge
- 首版不要开放超长上下文
- 首版不要依赖“平台会帮我自动挡住所有成本风险”

后续如果你在 `MiniMax` 订阅到期后切到 `DeepSeek`，本文后半段的限流、并发、摘要化、上下文裁剪策略仍然成立，只需要替换 provider 层。

---

## 总体建议

当前阶段最合适的主线是：

`MiniMax-M2.5` 作为当前默认模型，`thinking` 默认关闭或至少不向用户暴露，保留单 agent，服务端做强约束限流 + 上下文裁剪 + 单会话并发锁，前端补齐慢响应 / 排队 / 超时 / 取消状态。

不要一开始就上：

- 多 agent orchestration
- 任意代码执行 sandbox
- 持久队列系统
- 每轮都自动跑摘要
- 重型 tokenizer 或昂贵的服务端统计

---

## 建议默认值

首版建议把门槛收得更紧一些：

- 模型：`MiniMax-M2.5`
- thinking：默认关闭
- 单次输入软上限：`~12k tokens`
- 单次输入硬上限：`~16k tokens`
- 模型输出上限：`800-1200 tokens`
- 单条用户输入字符上限：`4000-6000`
- 原文历史：最近 `4-6` 轮
- 摘要触发阈值：超过 `4` 轮或上下文估算超过 `8k-10k tokens`
- 每 thread 并发：`1`
- 每 IP 并发：`2`
- 每 IP 限流：`10 req / 5 min`
- 每 session 限流：`20 req / day`
- 上游超时：`30s`
- route `maxDuration`：`45s`

这些数值不是“理论最优”，而是“当前 MiniMax 订阅期内更稳妥、且后续切 DeepSeek 也不用推翻”的上线初值。

---

## 方案分阶段

## Phase 1. 上线必做

这一阶段只做“必要且高收益”的优化。

### 1. 模型接入改成可切换 provider

目标：

- 保持当前 `MiniMax` 实现继续工作
- 只抽出一层 provider abstraction，方便以后平滑切到 `DeepSeek`
- 保留一个 fallback provider 开关，避免上线首周完全被单一供应商绑死

建议新增：

- `lib/ai/providers.ts`

建议做法：

- 把 `lib/ai/minimax.ts` 提炼成 provider factory 风格
- 由统一入口根据环境变量选择 provider
- `DeepSeek` 适配层先不急着写；等你真的准备切换时再补 `lib/ai/deepseek.ts`

建议环境变量：

- `AI_PROVIDER=minimax`
- `MINIMAX_API_KEY=...`
- `MINIMAX_MODEL=MiniMax-M2.5`
- `AI_THINKING_ENABLED=false`

这样你可以：

- 当前阶段完全继续沿用 MiniMax
- 以后订阅过期时，再把 `AI_PROVIDER` 切到 `deepseek`
- 不必在今天为了未来迁移，提前引入多余复杂度

### 2. 把当前内存限流替换成真正可部署版本

当前 `lib/ai/rate-limit.ts` 是内存 `Map`，上线后有三个问题：

- 冷启动丢状态
- 多实例之间不共享
- 无法做真正的 IP / session / 并发门槛

建议替换为：

- `Upstash Ratelimit + Redis`

建议拆成三层：

1. `IP` 限流
2. `session/thread` 限流
3. `in-flight concurrency lock`

建议新增：

- `lib/ai/rate-limit.server.ts`
- `lib/ai/concurrency-lock.server.ts`

建议策略：

- `IP: 10 req / 5 min`
- `session: 20 req / day`
- `thread: 同时仅 1 个生成中`
- `IP: 同时最多 2 个生成中`

关键点：

- 限流不要只按“请求次数”
- 改成按“估算 token 成本”做 weighted credits 更合理

例如：

- 普通短提问：`1 credit`
- 长段粘贴：`3 credits`
- 明显超长输入：`5 credits` 或直接拒绝

### 2.5 被打时的应急开关

除了应用层限流，建议准备一个“平台级紧急按钮”：

- 默认关闭 `Attack Challenge Mode`
- 一旦出现明显刷量、恶意并发或异常地区流量，手动开启

这样做的意义是：

- 先在边缘层挡掉大部分浏览器流量
- 被 challenge 挡住的请求不计入 Vercel usage
- 你不用先改代码再救火

建议把这个动作写进运维 checklist：

1. 开启 `Attack Challenge Mode`
2. 检查最近 `429/503` 是否异常升高
3. 临时把前端文案切成“AI 服务繁忙，请稍后再试”
4. 必要时把 `AI_PROVIDER` 切回 fallback

### 3. 在 route 层加硬门槛，而不是只裁剪消息数组

当前 `app/api/ai/chat/route.ts` 只做了：

- rate limit
- 保留最近 12 条消息

这还不够。

建议补上：

- Zod 校验 request body
- 校验 `messages` 数量
- 校验最后一条必须是 user message
- 校验单条输入字符数
- 校验总文本大小
- 校验 thread/session id 是否存在

建议新增：

- `lib/ai/chat-schema.ts`
- `lib/ai/context-window.ts`

route 建议升级为：

1. 解析并校验请求
2. 计算输入估算 token
3. 先走 weighted rate limit
4. 尝试拿 thread lock
5. 组装上下文窗口
6. 调模型
7. 在 `finally` 里释放 lock

### 4. 不要真的把 1M context 暴露给公开用户

无论当前是 `MiniMax`，还是以后切 `DeepSeek`，公开站点都不该真放开超长 context。

建议：

- UI 先做字符上限
- route 再做 token 估算上限
- 真正发给模型前再做一层上下文缩窗

建议上下文组装顺序：

1. 固定 system prompt
2. thread summary（如果有）
3. 最近 `4-6` 轮原文
4. 当前用户输入

不要继续把以下内容完整堆回历史：

- 巨长代码块
- 完整 artifact payload
- 大段 tool 输出
- reasoning / thinking 内容

### 5. 先把“无响应感”消掉

你当前最重要的用户体验目标不是“极快”，而是“慢的时候也专业”。

前端需要明确这几个状态：

- `正在连接模型...`
- `模型繁忙，正在等待响应...`
- `响应较慢，你可以继续等待或取消`
- `已超时，请重试`
- `请求过于频繁，请稍后再试`

建议在 `app/[locale]/ai/AIPlayground.tsx` 里补：

- `cancel` 按钮
- `slow request` 二级提示
- `429 / 503 / 504` 的差异化文案
- `Retry-After` 显示

不要出现：

- 点击发送后几秒完全没反馈
- 前端看起来像卡死
- 用户不知道是排队、超时还是被限流

### 6. route 运行时建议

首版建议明确走 Node.js runtime，而不是 Edge。

原因：

- 你当前链路已经是完整 agent + tool calling + streaming
- Node.js runtime 更稳，更适合后续接 Redis、日志、锁
- Edge 的 `25s` 首包要求对上游模型抖动更敏感

建议：

- route 设 `maxDuration = 45`
- 上游模型调用自己的 timeout 设 `30s`
- 超时后返回结构化错误，而不是挂着不动

---

## Phase 2. 对话摘要化

这是你提到的重点功能，但我建议做成“懒摘要”，不要每轮都跑。

### 为什么不建议每次对话结束都摘要

“每轮结束后都再调用一次轻量模型生成 50 字摘要”有三个问题：

- 额外再打一枪模型，本身也花 token
- 每轮都摘要会拖慢收尾
- 对短会话收益很低

更好的策略是：

- 只有当上下文真的开始变长时再摘要
- 摘要一次后，连续复用多轮

### 建议触发条件

满足任一条件时触发：

- 对话超过 `4` 轮
- 当前上下文估算超过 `8k-10k tokens`
- 最近 `2` 轮新增内容明显把旧历史推远

### 建议实现方式

建议新增 thread 级上下文字段：

```ts
type ThreadContextState = {
  summary?: string
  summarySourceMessageId?: string
  summaryUpdatedAt?: number
  recentWindowMessageIds: string[]
}
```

建议落点：

- 线程持久层先支持 `summary`
- 首版可先放在 `useChatThreads` 的 thread data 里
- 如果你已经把 threads 接到数据库，也可以在服务端保存

### 摘要内容规则

摘要不是聊天文案，而是“下轮继续推理所需的最小上下文”。

建议格式：

```txt
用户在询问 Jie 的项目与 AI Lab 实现细节。
已确认前端为 Next.js + Vercel AI SDK，当前为单 agent 架构。
最近重点在 chatbox、workspace、代码块渲染与生成式 UI。
```

建议限制：

- 中文 `50-120` 字
- 英文 `80-160` chars
- 只保留事实、偏好、已确定结论
- 不保留情绪化寒暄
- 不保留长代码
- 不保留完整 tool payload

### 摘要模型建议

为省成本，建议：

- 优先复用当前主模型通道，也就是现有 `MiniMax`
- 强制关闭或隐藏 reasoning 暴露
- `maxOutputTokens` 压到很小，例如 `120-180`

理由：

- 当前代码已经接好了 `MiniMax`
- 摘要是内部能力，没必要为了它单独引入第二个 provider
- 只要输出足够短，摘要本身的额外消耗仍然可控

### 摘要生成时机

首版推荐：

- **在下一次用户请求进入 route 时，按需懒生成**

不推荐首版就做：

- 每次 assistant 结束后后台立即摘要

原因：

- 更省资源
- 更容易控延迟
- 更适合 Vercel Hobby

建议流程：

1. 用户发新消息
2. route 估算上下文
3. 如果超出阈值且旧摘要不可复用
4. 先调用一次轻量 summary 生成
5. 保存 summary
6. 用 `summary + 最近 4-6 轮 + 当前输入` 继续主调用

### 摘要与缓存的关系

无论后续你是否切到支持 prompt caching 的 provider，前缀稳定都很重要。

所以摘要化要注意：

- 不要每轮都改 summary
- 不要在 summary 前后插入随机字段
- system prompt 固定
- summary 文本风格稳定

正确目标不是“摘要越频繁越好”，而是：

- `prefix 尽量稳定`
- `旧历史尽量压缩`
- `summary 只在必要时更新`

---

## Phase 3. 前端 Token 估算提示

这个功能值得做，但首版应当追求“轻量近似”，不要追求精确 tokenizer。

### 建议目标

在输入框下方显示：

- 当前上下文约多少 tokens
- 本次请求大概落在哪个成本区间
- 是否接近上限

例如：

```txt
当前上下文 ~1,200 tokens | 预估本次成本偏低
```

或者：

```txt
当前上下文 ~8,400 tokens | 接近上限，建议开始新对话
```

### 首版不要做的事

不建议一上来：

- 在前端接精确 tokenizer 大包
- 追求和 provider 账单 100% 对齐
- 每次输入都请求一次服务端精确估算

原因：

- bundle 会变重
- 实际收益不高
- 不同 provider 的账单模型、本地订阅与缓存命中都会让真实价格浮动

### 推荐方案

首版用本地 heuristic estimate：

- `system prompt` 预算固定值
- `summary` 预算固定值
- 历史消息按字符数做近似换算
- 当前输入单独实时估算

建议新增：

- `lib/ai/token-estimate.ts`

示例接口：

```ts
type TokenEstimate = {
  estimatedPromptTokens: number
  estimatedOutputTokens: number
  estimatedTotalTokens: number
  risk: "low" | "medium" | "high"
}
```

### 估算展示策略

UI 上建议只显示“约”，不要假装精准：

- `~1.2k tokens`
- `~8.4k tokens`
- `接近上限`
- `本次成本偏低 / 中等 / 偏高`

如果你一定要显示金额，我建议：

- 当前阶段先不默认显示人民币金额
- 更推荐显示“低 / 中 / 高风险”而不是具体价格
- 如果后续真的要显示金额，再做 provider-aware 配置化换算

因为真实成本会受这些因素影响：

- 当前是否订阅制
- cache hit / miss
- thinking 是否开启
- 实际输出长度
- provider 后续调价或套餐变更

所以金额提示应该是：

- 用于“提醒用户克制输入”
- 不是用于“财务级准确计费”

### 推荐 UI 行为

输入框下方加一条低干扰信息条：

- 正常：`当前上下文 ~1.2k tokens`
- 接近阈值：`当前上下文 ~8.4k tokens，建议开始新对话`
- 超限前：`输入过长，请精简后再发送`

颜色建议：

- `low`: muted
- `medium`: amber
- `high`: destructive

---

## 推荐的文件级改造点

### 必改

- `app/api/ai/chat/route.ts`
  - 加 body 校验
  - 加 weighted rate limit
  - 加并发锁
  - 加超时
  - 加上下文组装逻辑
- `lib/ai/rate-limit.ts`
  - 替换为 Upstash 版或拆成 server-only 版本
- `lib/ai/portfolio-agent.ts`
  - provider 改为统一入口
  - 增加 summary-aware instructions 兼容
- `app/[locale]/ai/AIPlayground.tsx`
  - busy / slow / timeout / cancel / token estimate UI

### 建议新增

- `lib/ai/providers.ts`
- `lib/ai/chat-schema.ts`
- `lib/ai/context-window.ts`
- `lib/ai/token-estimate.ts`
- `lib/ai/concurrency-lock.server.ts`
- `lib/ai/thread-summary.server.ts`

### 若要保存摘要

- `app/hooks/useChatThreads.ts`
  - thread 数据结构补 `summary`
- `app/api/ai/threads/*`
  - 若服务端持久化开启，则补 summary 读写

---

## 实施顺序

建议按这个顺序做，不要并行乱开：

1. 保持当前 `MiniMax` 可用，并抽出 provider abstraction
2. 替换限流为 Upstash
3. 加并发锁与 route timeout
4. 加输入门槛与上下文组装器
5. 补前端 busy / slow / timeout / cancel 状态
6. 加对话摘要化
7. 加 token 估算提示
8. 最后再考虑 AI Gateway / DeepSeek 迁移 / admin 高配模型

这个顺序的原因是：

- 先解决“被打”和“爆 token”
- 再解决“用户体感”
- 最后才做锦上添花的可视化提示

---

## 暂不建议做

当前阶段先不要做这些：

- 多 agent
- 队列系统
- 任意代码执行
- 每轮自动摘要
- 精确账单级 token 计费 UI
- 为了未来迁移提前写大量 DeepSeek 专用逻辑

这些都不是你现在最缺的。

---

## Phase 4. 可选后续增强

这些不是首发必需，但适合在上线稳定后补：

- 接入 `Vercel AI Gateway` 做 budgets / monitoring / fallback
- `MiniMax` 订阅到期后再补 `lib/ai/deepseek.ts`
- 迁移到 `DeepSeek` 或其他更适合公开站点成本模型的 provider
- 记录每个 thread 的粗粒度 token / cost telemetry
- 做后台“高风险 session”封禁或 deny list
- 根据 provider 实际返回字段做缓存命中观察

如果你后面只想少写一些 provider 层运维代码，`AI Gateway + BYOK` 会是最自然的第二阶段。

---

## 最终推荐版本

如果现在就要上线，我建议你先做到这个版本：

- 默认模型：`MiniMax-M2.5`
- thinking：关闭，或至少保证不进入可见聊天历史
- 路由：Node runtime
- 限流：Upstash，按 IP + session + weighted credits
- 并发：每 thread 1 个 in-flight，每 IP 2 个 in-flight
- 上下文：最近 `4-6` 轮 + 懒摘要
- 输出：上限 `1000` 左右
- 前端：busy / slow / timeout / cancel / token risk 提示

这一版已经足够专业，而且和你现在“先用 MiniMax 做稳，后面订阅过期再切 DeepSeek”的节奏完全一致。

---

## 参考资料

- [Vercel Functions Limits](https://vercel.com/docs/functions/limitations)
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Vercel AI Gateway Pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Vercel Attack Challenge Mode](https://vercel.com/docs/vercel-firewall/attack-challenge-mode)
- [Upstash Ratelimit Overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)

后续切换到 DeepSeek 时可参考：

- [DeepSeek V4 Preview Release](https://api-docs.deepseek.com/news/news260424)
- [DeepSeek Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [DeepSeek Rate Limit](https://api-docs.deepseek.com/zh-cn/quick_start/rate_limit)
- [DeepSeek Context Caching](https://api-docs.deepseek.com/guides/kv_cache/)
