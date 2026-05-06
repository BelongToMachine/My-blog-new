# Hero AI CTA 实现文档

## 目标

在首页 Hero 区域（About Me 板块）增加一个简约、瞩目的 CTA 入口，引导用户跳转到 AI Lab 页面，与 AI 对话来了解 Jie。

## 现状分析

Hero 组件 (`app/components/Hero.tsx`) 当前包含：
- TerminalPill 标签组（frontend log / next.js / ai notes）
- 打字机动画（"Heya I'm Jie / a web developer"）
- 一句话介绍
- CodeBlocker 代码展示块
- 头像图片

**缺失**：没有任何交互入口或页面跳转 CTA。

AI 聊天页面在 `/[locale]/ai`（通过 next-intl 自动映射为 `/zh/ai` 或 `/en/ai`），目前仅能从顶部导航栏和 footer 进入。

## 设计方案

### 视觉定位

小而精，不抢主体内容的视觉焦点：
- 放在 `shortIntro` 段落**下方**、代码块**上方**
- 阅读流："我是 Jie，前端开发者" → "向 AI 了解我 →" → "代码档案"

### 视觉风格

| 属性 | 值 | 理由 |
|------|----|------|
| 尺寸 | `text-[11px]` | 比正文小，比 TerminalPill 稍大，低调但可读 |
| 字体 | `font-pixel` | 项目签名式像素字体 |
| 字距 | `tracking-[0.22em]` | 宽字距，大气感 |
| 边框 | `border-2` + `border-primary/35` | 和 TerminalPill 同风格，hover 加深 |
| 背景 | `bg-primary/[0.04]` | 极淡的底色，hover 加深到 `[0.09]` |
| 圆角 | 无（`rounded-none`） | 项目整体直角像素风格 |
| 箭头 | `→` Unicode | 比 lucide 图标更像素感，group-hover 右移 |
| 宽度 | `w-fit`（内容自适应） | 不撑满，保持紧凑 |

### 动效

```
initial:  opacity 0, translateY 8px
animate:  opacity 1, translateY 0
transition: duration 0.45s, delay 0.35s
```
Delay 0.35s 确保在打字机动画出现后再入场，形成自然的 stagger 节奏。

### 文案

| 语言 | 文案 |
|------|------|
| 英文 | `Ask my AI about me →` |
| 中文 | `向 AI 了解我 →` |

## 文件修改清单

### 1. `app/components/Hero.tsx`

**新增 import：**
```tsx
import { Link } from "@/app/i18n/navigation"
```

**插入位置：**
在 `shortIntro` 段落（`<p className="font-pixel mb-4 ...">`）闭合标签之后，`{SHOW_FLOATING_ASSISTANT ...}` 之前。

**插入代码：**
```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.45, delay: 0.35 }}
  className="mb-5"
>
  <Link
    href="/ai"
    className="group inline-flex items-center gap-2 border-2 border-primary/35 bg-primary/[0.04] px-3.5 py-2 font-pixel text-[11px] uppercase tracking-[0.22em] text-primary transition-all duration-200 hover:border-primary/70 hover:bg-primary/[0.09] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
  >
    <span>{t("aiCtaLabel")}</span>
    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
      →
    </span>
  </Link>
</motion.div>
```

**为什么用 `<Link>` 而不是 `<a>`：**
`@/app/i18n/navigation` 中的 `Link` 是 next-intl 封装的组件，会自动处理 locale 前缀。`href="/ai"` 会正确解析为 `/zh/ai` 或 `/en/ai`，无需手动拼接。

### 2. `app/messages/en.json`

在 `"hero"` 对象内新增：
```json
"aiCtaLabel": "Ask my AI about me"
```

完整 `"hero"` 对象示例：
```json
"hero": {
  "greeting": "Heya I'm",
  "name": "Jie",
  "imageAlt": "Jie is standing firm",
  "typeSequence": ["Jie", "a web developer"],
  "shortIntro": "Frontend developer specializing in robust web architecture and the deep integration of LLMs to build practical AI Agents.",
  "code": "const coder = {\n  name: \"Jie\",\n  role: [\"Front-end developer\"],\n  skill: [\"React\", \"Next.js\"],\n  location: \"Hangzhou, China\",\n  problemSolver: true,\n  welcomeMessage: () => {\n    return \"Happy to meet you!\"\n  }\n}",
  "aiCtaLabel": "Ask my AI about me"
}
```

### 3. `app/messages/zh.json`

在 `"hero"` 对象内新增：
```json
"aiCtaLabel": "向 AI 了解我"
```

## 备选方案回顾（已排除）

| 方案 | 排除原因 |
|------|---------|
| 重新启用 FloatingPixelAssistant 机械猫作为点击入口 | 代码中 `SHOW_FLOATING_ASSISTANT = false`，且有 TODO 标注"revisit if we decide to keep a mascot"，属于实验性装饰元素，不宜承载功能性入口 |
| AI 聊天做成弹窗/overlay | 现有 AI 页面包含侧边栏、工作区面板、token 估算等复杂 UI，弹窗无法容纳 |
| 对话气泡（带小尾巴 tail） | 圆角尾巴与项目整体直角像素风格冲突 |
| 把 CTA 放在 TerminalPill 标签组旁边 | 标签是装饰性元信息，CTA 是功能性入口，混在一起会互相干扰 |
| 用 lucide 图标（如 Sparkles 或 MessageCircle） | 11px 尺寸下图标会糊，纯文字 + 箭头更干净、更像素感 |

## 本地验证步骤

1. 启动开发服务器：
   ```bash
   bun dev
   ```

2. 打开中文首页：
   ```
   http://localhost:3000/zh
   ```

3. 确认 CTA 出现位置：
   - 在 "一句话介绍" 下方
   - 在 CodeBlocker 代码块上方
   - 尺寸紧凑，不撑满宽度

4. 交互验证：
   - **Hover**：边框颜色从 `primary/35` 加深到 `primary/70`，背景从 `[0.04]` 加深到 `[0.09]`，箭头右移 `0.5px`
   - **点击**：跳转至 `http://localhost:3000/zh/ai`
   - **Tab 聚焦**：显示 `focus-visible:ring-2 focus-visible:ring-primary/50`

5. 切换英文验证：
   ```
   http://localhost:3000/en
   ```
   确认显示 "Ask my AI about me →"

6. 移动端验证：
   - 缩小窗口到 375px 宽度
   - 确认 CTA 宽度自适应，不溢出

## 部署

验证通过后，按项目常规流程提交：
```bash
git add app/components/Hero.tsx app/messages/en.json app/messages/zh.json
git commit -m "feat(hero): add AI chat CTA to introduce section

Add a compact pixel-styled link below the hero short intro that
navigates to the AI Lab page. Includes i18n for both zh and en."
git push
```

Vercel 会自动构建并部署 preview，Production 提升按需操作。
