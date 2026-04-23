# Home Page Responsive Design Plan

> Target: `app/[locale]/page.tsx` → `PostSummary` / `BlogSummary` / `LatestBlogs` / `BlogChart`

---

## 1. Breakpoints

沿用项目已有的 Tailwind 断点，无需新增自定义断点。

| 名称 | 断点 | 对应设备 |
|------|------|----------|
| `sm` | 640px | 大屏手机 |
| `md` | 768px | **Mobile / Tablet 分界** |
| `lg` | 1024px | **Tablet / Desktop 分界** |
| `xl` | 1280px | 大屏桌面 |

- **Mobile**: `< md` (即默认到 `md:` 之前)
- **Tablet**: `md:` 到 `< lg`
- **Desktop**: `lg:` 及以上

---

## 2. Current Code Gap Analysis

| 模块 | 当前行为 | 目标状态 | 优先级 |
|------|----------|----------|--------|
| **PostSummary 整体布局** | `< lg` 已是 `flex-col` 单栏 | ✅ 符合 Tablet/Mobile 单栏要求 | — |
| **Stats 卡片列数** | `< sm` 单列 / `sm ~ lg` **2 列** / `>= lg` 3 列 | Tablet 需 **3 列** | P0 |
| **LatestBlogs 卡片内部** | `< md` 上下结构 / `>= md` 左右结构 | ✅ Mobile 已是上下结构 | — |
| **Chart 图表方向** | 始终是 recharts **竖向** BarChart | Mobile 需改为 **横向** BarChart | P0 |
| **Header 字号** | `pixel-heading` 使用 `clamp` | Mobile 断行 + 微调字号 | P1 |
| **模块顺序** | Stats → Chart → Logs (Desktop: Stats+Chart 左 / Logs 右) | Tablet: Stats → Logs → Chart | P1 |

---

## 3. Tablet (768px – 1023px)

### 3.1 整体布局

```
[ Header ]
[ Stats ][ Stats ][ Stats ]
[ Recent Logs        (full width) ]
[ Chart              (full width) ]
```

**改动点**:
- `PostSummary` 在 `< lg` 保持 `flex-col`，但需确认 **Recent Logs 排在 Chart 上方**（当前 `PostSummary` 中 `BlogChart` 在 `LatestBlogs` 前面，因为 HTML 结构是 `flex-col` 顺序决定）。
- 若当前顺序是 Stats → Chart → Logs，在 Tablet 下需要调整：Logs 应该在 Chart 前面。

### 3.2 Stats 卡片 — 3 列

当前 `BlogSummary.tsx`:
```tsx
<RetroStatCard className="... basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-0 lg:flex-1" />
```

**问题**: `sm:` 开始是 2 列，Tablet(`md:`) 仍是 2 列。

**修改**:
```tsx
<div className="flex min-w-0 flex-wrap gap-2 sm:gap-3 md:gap-4">
  <RetroStatCard
    className="min-h-[9rem] min-w-0 basis-full sm:basis-[calc(50%-0.375rem)] md:basis-[calc(33.333%-0.667rem)] lg:basis-0 lg:flex-1"
    ...
  />
  {/* ... 其余两张卡片同样修改 ... */}
</div>
```

或更简洁:
```tsx
<div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 sm:gap-3 md:gap-4">
  <RetroStatCard className="min-h-[9rem] min-w-0" ... />
</div>
```

**卡片内部**:
- `RetroStatCard` 当前已有响应式 padding/字号，Tablet 上无需额外改动。
- 高度保持 `min-h-[9rem]`（约 144px），视觉上与 desktop 接近。

### 3.3 Recent Logs — 全宽

当前 `LatestBlogs.tsx` 在 `< md` 已是全宽，在 `md:` 以上与父容器等宽。
Tablet 只需确保作为独立模块占满一行即可，当前代码已满足。

**微调**:
- `RetroPanel` header 在 `md:` 的 padding 已是 `px-5`，保持。
- 博客卡片内部：标题 `font-pixel text-sm md:text-base`，Tablet 上为 `text-base`。

### 3.4 Chart — 全宽

当前 `ChartInner.tsx` 是竖向 BarChart，`ResponsiveContainer width="100%" height={300}`。

Tablet 上继续用竖向柱状图，但建议:
- 横轴标签缩短: `WEB DEVELOPMENT` → `WEB DEV`
- 刻度文字保持 11px
- 柱宽 `barSize` 从 48 适当缩小到 40（或让 recharts 自适应）

---

## 4. Mobile (< 768px)

### 4.1 整体布局

```
[ Header              (断行) ]
[ Stats Card          (单列堆叠) ]
[ Stats Card          (单列堆叠) ]
[ Stats Card          (单列堆叠) ]
[ Recent Logs  2 ITEMS ]
[ Blog Card           (上下结构) ]
[ Blog Card           (上下结构) ]
[ Chart               (横向条形图) ]
```

### 4.2 Header 区域

当前 `SectionHeading`:
```tsx
<h2 className="pixel-heading max-w-4xl text-balance">{title}</h2>
```

`pixel-heading` 使用 `clamp(1.5rem, 4vw, 3rem)`。Mobile 上最小为 1.5rem (24px)。

**建议调整**:
- Mobile 主标题允许断行为 2 行（`text-balance` 已自动处理）。
- 若需要更显眼的 Mobile 标题，可在 `SectionHeading` 增加 mobile 专用字号:
  ```tsx
  <h2 className="font-pixel text-[1.75rem] leading-[1.1] tracking-[0.04em] uppercase text-foreground md:text-[clamp(1.5rem,4vw,3rem)]">
  ```
- 副标题宽度在 Mobile 上占满即可，当前 `max-w-2xl` + `text-balance` 已足够。

### 4.3 Stats 卡片 — 单列堆叠

当前 `BlogSummary.tsx` 在默认（Mobile）状态下 `basis-full`，已是单列。

**建议微调**:
- `min-h-[9rem]` 在 Mobile 上可降到 `min-h-[7.5rem]` (120px) 以节省纵向空间。
- `RetroStatCard` 内部 label 在 Mobile 上是 `text-[8px]`，可以提升到 `text-[9px]` 保证可读性。
- 数值字号当前 Mobile: `text-xl` (20px)，可提升到 `text-2xl` (24px) 或保持。

### 4.4 Recent Logs — 上下结构

当前 `LatestBlogs.tsx`:
```tsx
<div className="... flex-col ... md:flex-row md:items-center md:justify-between">
```

Mobile 上已是 `flex-col`（上下结构）。

**微调建议**:
- 博客卡片 padding: `px-4 py-4` 在 Mobile 上可降到 `px-3.5 py-3.5`。
- 标题 `text-sm` (14px) 在 Mobile 上可提升到 `text-[15px]` 或保持 `text-sm`。
- MDX badge 和 date badge 在 Mobile 上保持不换行（当前 `flex-wrap` + `gap-3` 已处理）。

### 4.5 Chart — 改为横向条形图

这是 **Mobile 下最关键的视觉改动**。当前 `ChartInner.tsx` 使用 recharts `BarChart`（竖向）。

**方案**: 在 Mobile 下切换为 `BarChart` 的 `layout="vertical"` 模式。

具体实现:
```tsx
const isMobile = useMediaQuery("(max-width: 767px)") // 或读取窗口宽度

<ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
  <BarChart
    data={data}
    layout={isMobile ? "vertical" : "horizontal"}
    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
  >
    {isMobile ? (
      <>
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          width={80}
          tick={{ fontSize: 10, fontFamily: "var(--font-pixel)" }}
        />
      </>
    ) : (
      <>
        <XAxis dataKey="label" tick={<PixelXTick />} ... />
        <YAxis tick={<PixelYTick />} ... />
      </>
    )}
    <Bar dataKey="value" barSize={isMobile ? 20 : 48} ... />
  </BarChart>
</ResponsiveContainer>
```

**标签映射**（在 Mobile 下缩短）:
```ts
const mobileLabels = {
  webDev: "WEB DEV",
  tech: "TECH",
  nonTech: "NON-TECH",
}
```

**视觉规范**:
- Mobile Chart 模块高度: `200px` 左右
- 横向条形宽度: `barSize={20}`
- 标签 font-size: 10px
- 保留 `PixelBarShape` 的像素块风格（只是旋转 90 度，recharts 会自动处理）

---

## 5. 统一视觉规范

### 5.1 色彩

延续 desktop，不改动主题色。所有颜色从 CSS 变量读取。

| Token | 用途 |
|-------|------|
| `hsl(var(--background))` | 深紫黑背景 |
| `hsl(var(--border))` | 低饱和紫边框 |
| `hsl(var(--primary))` | 霓虹青蓝高亮 |
| `hsl(var(--signal-amber))` | 黄色 WIP |
| `hsl(var(--muted-foreground))` | 灰紫 Closed / 次要文字 |
| `hsl(var(--foreground))` | 浅灰白正文 |

### 5.2 圆角

保持硬边矩形风格:
- 全局 `border-radius: 0rem`（`--radius: 0rem`）
- 卡片、badge、panel 均不使用圆角

### 5.3 边框

| 元素 | 粗细 |
|------|------|
| 外框 (`pixel-panel`) | 3px |
| 分隔线 | 1px |
| badge 边框 | 2px |

### 5.4 阴影

不使用现代大投影，仅保留边缘硬阴影:
```css
box-shadow: var(--shadow-elevated); /* 6px 6px 0 rgba(0,0,0,0.34) in dark */
```

### 5.5 字体层级

#### Desktop (>= 1024px)
| 层级 | 类名 / 尺寸 |
|------|------------|
| H1 (Hero) | `display-title` / `clamp(2.4rem, 6vw, 5.5rem)` |
| Section Title | `pixel-heading` / `clamp(1.5rem, 4vw, 3rem)` |
| Stat Number | `text-3xl` / 30px |
| Body | `text-base` / 16px |
| Meta / Badge | `text-[10px]` ~ `text-xs` |

#### Tablet (768–1023px)
| 层级 | 建议尺寸 |
|------|----------|
| H1 | 保持 `clamp` 自动缩放 |
| Section Title | `clamp` 自动到约 36px |
| Stat Number | `text-2xl` / `text-3xl` (当前已有响应式) |
| Body | `text-sm` ~ `text-base` |
| Meta | `text-[9px]` ~ `text-xs` |

#### Mobile (< 768px)
| 层级 | 建议尺寸 |
|------|----------|
| H1 | `text-[1.75rem]` (28px) 或保持 `clamp` 下限 24px |
| Section Title | `text-[1.5rem]` ~ `text-[1.75rem]` |
| Stat Number | `text-xl` ~ `text-2xl` |
| Body | `text-sm` / 14px |
| Meta | `text-[8px]` ~ `text-xs` |

---

## 6. 交互与约束

1. **禁止横向滚动**: 所有模块均使用 `min-w-0` + `break-words` / `text-balance`。
2. **长标题优先换行**: 使用 `text-balance` 或 `break-words`，不压缩字号。
3. **Badge / Date 在 Mobile 允许换行**: 当前 `LatestBlogs` 的 meta 区使用 `flex-wrap gap-3` 已满足。
4. **Chart 在 Mobile 允许换向**: 竖向 → 横向，保证标签可读。
5. **模块顺序保持**:
   - Header
   - Stats Overview
   - Latest Content
   - Chart

---

## 7. 实施优先级

| 优先级 | 任务 | 涉及文件 |
|--------|------|----------|
| P0 | Stats 卡片 Tablet 3 列修复 | `app/BlogSummary.tsx` |
| P0 | Chart Mobile 横向条形图 | `app/components/ChartInner.tsx` |
| P1 | PostSummary 模块顺序调整 (Tablet Logs 在 Chart 前) | `app/PostSummary.tsx` |
| P1 | Header Mobile 断行 + 字号微调 | `app/components/system/SectionHeading.tsx` |
| P2 | Stats 卡片 Mobile 紧凑化 | `app/components/system/RetroStatCard.tsx` |
| P2 | LatestBlogs Mobile 卡片 padding 微调 | `app/LatestBlogs.tsx` |

---

## 8. 快速验证 Checklist

- [ ] Tablet (768px ~ 1023px): 3 张 stats 卡片横向并排，无挤压换行
- [ ] Tablet: Recent Logs 全宽，博客卡片左右结构
- [ ] Tablet: Chart 全宽，横轴标签显示为 `WEB DEV` 等短文案
- [ ] Mobile (< 768px): Stats 卡片单列堆叠，纵向阅读无压力
- [ ] Mobile: Recent Logs 博客卡片上下结构（标题在上，badge+date 在下）
- [ ] Mobile: Chart 为横向条形图，标签左对齐，数值右对齐
- [ ] 所有断点下无横向滚动条
- [ ] 像素风字体在所有尺寸下清晰可读
- [ ] 深色主题下所有颜色正常
