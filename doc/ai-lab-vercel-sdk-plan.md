# AI Lab Vercel AI SDK Plan

## Goal

Build the AI Lab on top of Vercel AI SDK with a single agent architecture that can evolve into generative UI, while keeping backend cost and operational complexity low.

## Progress Update

### 2026-04-27

Completed in phase 1:

- Installed `ai`, `@ai-sdk/react`, and `@ai-sdk/openai`
- Added a MiniMax provider wrapper at `lib/ai/minimax.ts`
- Added a single portfolio agent at `lib/ai/portfolio-agent.ts`
- Added a new streamed chat route at `app/api/ai/chat/route.ts`
- Replaced the placeholder AI Lab UI with a real `useChat`-based chat flow in `app/[locale]/ai/AIPlayground.tsx`
- Kept the old `app/api/usecase/route.ts` untouched for rollback safety

Verified:

- ESLint passed for the new AI Lab files
- TypeScript passed with `bunx tsc --noEmit`
- The agent can answer through MiniMax in a single-step flow
- `<think>` output is now extracted into reasoning metadata instead of leaking into the visible chat text

Current limitations:

- No persistence yet
- No image upload path in the new Vercel AI SDK flow yet
- No generative UI tools yet
- No sandboxed code rendering yet
- Full `next build` is still blocked by an unrelated existing `/api/users` database connectivity error

## Principles

- Start with one agent, not multi-agent orchestration.
- Prefer streaming text and structured UI payloads over executing AI-generated code.
- Keep model context short and stable to reduce token cost.
- Avoid database writes in the first phase unless they directly improve user experience.
- Defer sandboxed code execution until a later phase.

## Architecture

### Frontend

- `app/[locale]/ai/AIPlayground.tsx`
- Uses `useChat` from `@ai-sdk/react`
- Sends messages to a dedicated `/api/ai/chat` route
- Renders streamed assistant output from `message.parts`

### Backend

- `app/api/ai/chat/route.ts`
- Uses `ToolLoopAgent` and `createAgentUIStreamResponse` from `ai`
- Uses MiniMax through an OpenAI-compatible provider
- Returns a streamed UI message response

### Model Provider

- MiniMax, via OpenAI-compatible endpoint
- Default phase-1 model: `MiniMax-M2.5` or the current configured MiniMax text model
- Environment variables:
  - `MINIMAX_API_KEY`
  - `MINIMAX_BASE_URL`
  - `MINIMAX_MODEL`

## Phase Breakdown

### Phase 1: Streaming Single-Agent Chat

Scope:

- Replace the placeholder AI Lab UI with a functional streamed chat
- Migrate from direct `openai` SDK calls in the existing route to Vercel AI SDK
- Use one `ToolLoopAgent` with no active tools yet
- Keep chat state client-side only
- No persistence, no screenshots, no generative UI blocks yet

Why:

- Lowest backend cost
- Minimal operational risk
- Creates the right foundation for later tool use and generative UI

Deliverables:

- AI SDK dependencies installed
- `lib/ai/minimax.ts`
- `lib/ai/portfolio-agent.ts`
- `app/api/ai/chat/route.ts`
- Updated `AIPlayground.tsx`

### Phase 2: Structured Generative UI

Scope:

- Add lightweight tools that return structured payloads instead of code
- Render those payloads with fixed React components

Initial tools:

- `get_profile_summary`
- `list_projects`
- `search_articles`
- `build_ui_block`

Initial UI block types:

- `profile-card`
- `project-grid`
- `article-summary`
- `timeline`
- `comparison-table`

Why:

- Feels like generative UI without unsafe execution
- Preserves the site's pixel-first visual language
- Much cheaper and more robust than code generation

### Phase 3: Session Persistence and Cost Controls

Scope:

- Add `ChatThread` and `ChatMessage` tables
- Save user and assistant turns
- Summarize long history instead of replaying everything
- Add basic rate limiting and logging

Why:

- Better UX for returning users
- More predictable context size and token spend

### Phase 4: Artifact / Code Preview Mode

Scope:

- Separate route for AI-generated code artifacts
- Sandbox-based execution only
- iframe-based preview
- strict package and runtime limits

Why:

- Supports true code-driven UI generation without compromising the main app

## Resource-Saving Decisions

- Use a single agent
- Default to one-step responses in phase 1
- Avoid persistence in phase 1
- Avoid long context windows unless needed
- Avoid external retrieval and web search in early phases
- Avoid sandbox execution until phase 4
- Reuse a stable system prompt to benefit prompt caching

## Implementation Notes

- Keep the existing `app/api/usecase/route.ts` temporarily for compatibility and rollback safety.
- Build the new AI Lab flow under `/api/ai/chat`.
- Keep the agent instructions tightly scoped to Jie, the portfolio, and the site's content.
- Do not expose raw chain-of-thought or provider-specific reasoning text by default.

## Success Criteria

Phase 1 is complete when:

- Users can send a message from AI Lab
- Assistant responses stream into the UI
- The model follows the portfolio assistant persona
- The route works entirely through Vercel AI SDK
- No database writes are required for the chat to function
