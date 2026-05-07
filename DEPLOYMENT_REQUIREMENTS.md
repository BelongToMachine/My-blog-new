# 最小部署需求（AI Lab 上线版）

> 基于当前代码状态整理。以下列出的都是**项目实际运行所必需**的基础设施；package.json 中虽有其他依赖，但部分属于遗留代码未实际调用。

---

## 1. 部署平台

| 服务 | 用途 | 建议方案 |
|---|---|---|
| **Next.js Hosting** | 运行 Next.js 14 App Router、Serverless Functions、静态资源分发 | **Vercel Hobby**（当前目标平台） |

**约束与配置**
- Runtime: **Node.js**（明确使用 Node runtime，非 Edge）
- `maxDuration`: 45s（AI chat route 已配置）
- 需要支持 streaming response（Vercel Hobby 支持）
- 构建命令: `bun run build`
- Node 版本: 18+

---

## 2. 数据库（必需）

| 服务 | 用途 | 建议方案 |
|---|---|---|
| **PostgreSQL** | Prisma ORM 持久化存储 | Vercel Postgres / Neon / Supabase Postgres / Railway |

**数据模型**
- `ChatThread` / `ChatMessage` — AI Lab 对话持久化

**部署后必须执行**
```bash
bunx prisma migrate deploy
# 或首次部署时
bunx prisma migrate dev --name init
```

---

## 3. 缓存与限流（必需）

| 服务 | 用途 | 建议方案 |
|---|---|---|
| **Redis** | IP/Session 限流、并发锁、分布式状态 | **Upstash Redis**（HTTP-based，专为 serverless 设计） |

**限流策略（已编码实现）**
- IP 限流: 10 req / 5 min
- Session 限流: 20 req / day
- Weighted credits: 短输入 1 / 中输入 3 / 长输入 5
- Thread 并发锁: 每 thread 1 个 in-flight
- IP 并发锁: 每 IP 2 个 in-flight

---

## 4. AI 服务（必需）

| 服务 | 用途 | 配置方式 |
|---|---|---|
| **DeepSeek** | AI Lab 对话模型（固定使用 v4 flash） | 环境变量 `DEEPSEEK_API_KEY` |

**模型配置**
- 固定模型: `deepseek-v4-flash`
- Thinking: 默认关闭 (`AI_THINKING_ENABLED=false`)
- 输出上限: ~1000 tokens
- 上下文: 最近 12 条消息 + 懒摘要

**注意**: 不需要自建 AI 推理服务器，也不需要配置 `AI_PROVIDER` 或 MiniMax 环境变量。

---

---

## 6. 静态资源

| 类型 | 存放位置 | 是否需要外部存储 |
|---|---|---|
| 图片、字体、简历 PDF | `public/` 目录 | **否**（Vercel 自动托管并 CDN 分发） |

项目**没有**图片上传功能，因此不需要 S3 / Cloudinary / Vercel Blob 等对象存储。

---

## 7. 完整环境变量清单

```bash
# ─── 数据库 ───
DATABASE_URL="postgresql://..."

# ─── AI Model ───
DEEPSEEK_API_KEY="..."
AI_THINKING_ENABLED="false"

# ─── Upstash Redis ───
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# ─── 可选 ───
# NEXT_PUBLIC_DEV_SECRET_TOKEN
# PRIVATE_BLOG_CONTENT_PATH
```

---

## 8. 不需要的基础设施

以下服务**package.json 中虽有依赖，但当前代码未实际调用**，因此不是部署必需：

| 依赖 | 说明 |
|---|---|
| **OpenAI SDK** | `openai` 已安装，但当前 AI Lab 使用 `@ai-sdk/openai` 的 OpenAI-compatible DeepSeek 接入 |
| **文件存储/S3** | 无图片上传或文件托管需求 |
| **队列系统** | 明确未使用（计划文档建议不上） |
| **CDN** | Vercel 自带全球 CDN，无需额外配置 |

---

## 9. 部署检查清单

- [ ] 创建 Vercel 项目，绑定代码仓库
- [ ] 创建 PostgreSQL 数据库并获取连接字符串
- [ ] 创建 Upstash Redis 实例并获取 REST URL + Token
- [ ] 注册 DeepSeek 并获取 API Key
- [ ] 在 Vercel 项目设置中填入上述所有环境变量
- [ ] 执行 `bunx prisma migrate deploy`
- [ ] 执行首次部署 `bun run build`
- [ ] 验证 `/api/ai/chat` 限流和并发锁正常工作
- [ ] 验证 AI Lab 对话流式响应正常

---

## 10. 月成本估算（Hobby 级别）

| 项目 | 预估成本 |
|---|---|
| Vercel Hobby | **免费** |
| Vercel Postgres (Hobby) | **免费**（或 Neon/Railway 免费 tier） |
| Upstash Redis | **免费 tier** 足够 |
| DeepSeek API | 按调用量付费 |

**结论**: 在 DeepSeek 调用量可控的前提下，**零额外基础设施月租**即可上线。
