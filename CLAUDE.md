# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dify Conversation Web App template — a Next.js frontend for building chat interfaces powered by a Dify backend. The app communicates with Dify's API through server-side route handlers using the `dify-client` SDK, with SSE streaming for real-time chat responses.

## Commands

```bash
yarn dev          # Development server (localhost:3000)
yarn build        # Production build (output: standalone)
yarn start        # Start production server
yarn lint         # ESLint check
yarn fix          # Auto-fix ESLint errors
```

## Architecture

### Request Flow

```
Browser (Client Component)
  → service/index.ts (domain API functions)
    → service/base.ts (fetch utilities: get/post/put/del/ssePost)
      → app/api/**/route.ts (Next.js route handlers)
        → dify-client ChatClient (Dify backend API)
```

Chat messages use **SSE streaming**: `sendChatMessage()` → `ssePost()` → `handleStream()` which parses `data:` lines and dispatches to typed callbacks (`onData`, `onThought`, `onFile`, `onMessageEnd`, `onWorkflowStarted`, etc.).

### Key Directories

- **`app/api/`** — Server-side route handlers. Each uses `dify-client` ChatClient instantiated in `app/api/utils/common.ts`
- **`app/components/`** — React components. `base/` has reusable primitives (toast, icons, inputs, file uploader). Feature components in `chat/`, `workflow/`, `sidebar/`, etc.
- **`service/`** — Client-side API layer. `base.ts` provides HTTP utilities + SSE streaming. `index.ts` wraps domain-specific calls
- **`config/index.ts`** — App configuration (APP_ID, API_KEY, API_URL, APP_INFO, locale settings)
- **`types/`** — TypeScript definitions (`app.ts` for ChatItem/ConversationItem, `base.ts` for AppInfo)
- **`hooks/`** — Custom hooks (`use-conversation.ts` for localStorage conversation state, `use-breakpoints.ts`)
- **`i18n/`** — Internationalization (en, es, zh-Hans, ja, fr). Server uses cookie/header negotiation, client uses `react-i18next`

### Component Conventions

- **Server Components by default** — only add `'use client'` when the component needs interactivity, state, effects, or browser APIs
- **Tailwind-first styling** — colocate module CSS as `style.module.css` when needed
- **Toast notifications** via `app/components/base/toast` (not browser alerts)
- Path alias: `@/*` maps to project root

### State Management

- **Zustand + Immer** for global/chat state
- **React hooks** (useState, useContext) for component-level state
- **localStorage** for conversation ID persistence (`use-conversation.ts`)

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_APP_ID=      # Dify App ID (from app detail URL)
NEXT_PUBLIC_APP_KEY=     # API Key (from app's "API Access" page)
NEXT_PUBLIC_API_URL=     # e.g. https://api.dify.ai/v1
```

### i18n

- Server: `getLocaleOnServer()` from `i18n/server.ts` (reads cookie, falls back to Accept-Language)
- Client: `getLocaleOnClient()` / `setLocaleOnClient()` from `i18n/client.ts`
- Translation files: `i18n/lang/{namespace}.{locale}.ts` (namespaces: common, app, tools)

### API Service Pattern

Use domain functions from `service/index.ts` — not raw fetch. Request bodies go in `options.body` (auto-stringified). Query params go in `options.params` for GET requests. For SSE streaming, use `ssePost` with callback handlers.

## Tech Stack

- Next.js 15 (App Router, standalone output), React 19, TypeScript 5.9 (strict)
- Tailwind CSS 3, Sass, PostCSS
- dify-client SDK for Dify API communication
- i18next + react-i18next
- zustand + immer for state
- react-markdown + remark-gfm + rehype-katex for message rendering
- @headlessui/react, @remixicon/react for UI primitives
- ESLint with @antfu/eslint-config, Husky + lint-staged

## Docker

Multi-stage build with Node 22 Alpine. Output mode is `standalone`. Port 3000.
