export type SuggestedPromptMode = "send" | "fill" | "article-picker"

export interface SuggestedPrompt {
  id: string
  label: string
  prompt: string
  mode: SuggestedPromptMode
}

const zhPrompts: SuggestedPrompt[] = [
  {
    id: "portfolio-decisions",
    label: "介绍一篇 blog",
    prompt: "",
    mode: "article-picker",
  },
  {
    id: "ai-lab-build",
    label: "这个 AI Lab 是怎么做的？",
    prompt: "请拆解一下这个 AI Lab 的实现思路，包括聊天、工具调用和界面设计取舍。",
    mode: "send",
  },
  {
    id: "representative-project",
    label: "挑一个代表项目讲讲",
    prompt: "请挑一个最能代表 Jie 的项目，讲讲它解决了什么问题，以及为什么值得看。",
    mode: "send",
  },
  {
    id: "frontend-judgement",
    label: "他的前端取舍是什么？",
    prompt: "请总结 Jie 在前端实现上的取舍偏好，比如可维护性、交互细节、性能和工程结构。",
    mode: "send",
  },
  {
    id: "current-interests",
    label: "他最近在研究什么？",
    prompt: "请结合这个站点和 AI Lab，讲讲 Jie 最近更关注哪些技术方向，为什么。",
    mode: "send",
  },
]

const enPrompts: SuggestedPrompt[] = [
  {
    id: "portfolio-decisions",
    label: "Introduce a blog post",
    prompt: "",
    mode: "article-picker",
  },
  {
    id: "ai-lab-build",
    label: "How is this AI Lab built?",
    prompt: "Break down how this AI Lab works, including the chat flow, tool calling, and UI decisions.",
    mode: "send",
  },
  {
    id: "representative-project",
    label: "Show me a representative project",
    prompt: "Pick one project that best represents Jie and explain why it matters.",
    mode: "send",
  },
  {
    id: "frontend-judgement",
    label: "What are his frontend tradeoffs?",
    prompt: "Summarize Jie's frontend judgement and tradeoffs across maintainability, interaction quality, performance, and engineering structure.",
    mode: "send",
  },
  {
    id: "current-interests",
    label: "What is he exploring lately?",
    prompt: "Based on this site and the AI Lab, what technical directions does Jie seem most interested in lately, and why?",
    mode: "send",
  },
]

export function getSuggestedPrompts(locale: string): SuggestedPrompt[] {
  return locale.startsWith("zh") ? zhPrompts : enPrompts
}
