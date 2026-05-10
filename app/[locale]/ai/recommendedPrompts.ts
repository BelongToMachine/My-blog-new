export type SuggestedPromptMode = "send" | "fill"

export interface SuggestedPrompt {
  id: string
  label: string
  prompt: string
  mode: SuggestedPromptMode
}

const zhPrompts: SuggestedPrompt[] = [
  {
    id: "tech-stack",
    label: "他的技术栈是什么？",
    prompt: "请介绍 Jie 的技术栈，并说明他最擅长的方向。",
    mode: "send",
  },
  {
    id: "representative-project",
    label: "介绍一个代表项目",
    prompt: "请介绍 Jie 的一个代表项目，并说明这个项目体现了哪些能力。",
    mode: "send",
  },
  {
    id: "role-fit",
    label: "他适合什么岗位？",
    prompt: "如果从招聘角度看，Jie 适合哪些岗位？请说明理由。",
    mode: "send",
  },
  {
    id: "frontend-strengths",
    label: "他的前端优势是什么？",
    prompt: "请总结 Jie 的前端优势，并说明这些优势在真实项目里通常体现在哪些方面。",
    mode: "send",
  },
  {
    id: "english-intro",
    label: "用英文介绍 Jie",
    prompt: "Please introduce Jie in English for a recruiter, with a concise and professional tone.",
    mode: "send",
  },
]

const enPrompts: SuggestedPrompt[] = [
  {
    id: "tech-stack",
    label: "What is his tech stack?",
    prompt: "What is Jie's tech stack, and which areas is he strongest in?",
    mode: "send",
  },
  {
    id: "representative-project",
    label: "Show me a representative project",
    prompt: "Walk me through one representative project Jie built and explain what it shows about his skills.",
    mode: "send",
  },
  {
    id: "role-fit",
    label: "What roles fit Jie best?",
    prompt: "From a hiring perspective, what kinds of roles fit Jie best, and why?",
    mode: "send",
  },
  {
    id: "frontend-strengths",
    label: "What are his frontend strengths?",
    prompt: "Summarize Jie's frontend strengths and explain how they tend to show up in real product work.",
    mode: "send",
  },
  {
    id: "english-intro",
    label: "Introduce Jie in English",
    prompt: "Introduce Jie in English for a recruiter in a concise, professional way.",
    mode: "send",
  },
]

export function getSuggestedPrompts(locale: string): SuggestedPrompt[] {
  return locale.startsWith("zh") ? zhPrompts : enPrompts
}
