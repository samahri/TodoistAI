# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Todoist AI is a Next.js 15 application featuring an AI-powered chatbot assistant for task management. The frontend was initially generated from Figma Make and uses shadcn/ui components.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Type check without emitting files
pnpm type-check
```

## Architecture

### Next.js App Router Structure

- **`src/app/`** - Next.js 15 App Router directory
  - `layout.tsx` - Root layout that imports global styles
  - `page.tsx` - Home page that renders the main `App` component
  - `globals.css` - Tailwind CSS v4 imports and CSS custom properties for theming

- **`src/App.tsx`** - Main application component marked with `'use client'` directive
  - Renders the ChatBot component centered on the page
  - Uses Tailwind CSS for styling

- **`src/components/`** - Application components
  - `ChatBot.tsx` - Main chat interface with message state management
  - `ChatMessage.tsx` - Individual message display component
  - `ChatInput.tsx` - Message input field with send functionality
  - `TypingIndicator.tsx` - Visual typing indicator
  - **`ui/`** - shadcn/ui component library (50+ reusable components)
  - **`figma/`** - Figma Make specific components

### State & Data Flow

The chatbot uses React hooks for state management:
- `useState` for messages array and typing state
- `useEffect` for auto-scrolling to latest messages
- Mock responses from `src/utils/mockResponses.ts` (placeholder for real AI integration)

### Styling System

**Tailwind CSS v4** with custom theming:
- Uses `@import "tailwindcss"` syntax (v4 convention)
- PostCSS plugin: `@tailwindcss/postcss` (configured in `postcss.config.mjs`)
- CSS variables in `globals.css` define light/dark theme colors
- Utility classes: `cn()` helper combines `clsx` and `tailwind-merge`
- Component variants: Uses `class-variance-authority` (cva)

**Important**: Do NOT use old Tailwind v3 syntax like `@tailwind base/components/utilities` directives.

## TypeScript Configuration

- Path alias: `@/*` maps to `src/*`
- Strict mode enabled
- `allowImportingTsExtensions: true` - allows importing `.tsx` files with extensions
- Target: ES2017

## Package Management (pnpm)

- **`.npmrc`** contains approved build scripts for security
- Approved packages: `sharp`, `unrs-resolver`, `@tailwindcss/oxide`
- To approve new build scripts: `pnpm approve-builds`

## Key Dependencies

- **UI Framework**: Next.js 15, React 18
- **Styling**: Tailwind CSS v4, @tailwindcss/postcss
- **Component Library**: shadcn/ui (based on Radix UI primitives)
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Important Notes for Development

### Adding shadcn/ui Components

All UI components in `src/components/ui/` are from shadcn/ui. They import Radix UI primitives without version numbers in the import paths:

```typescript
// Correct
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Incorrect (will cause module not found errors)
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";
```

If you encounter import errors with version numbers, use this command to fix them:
```bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec perl -pi -e 's/from\s+"([^"]+)@[\d.]+"/from "$1"/g' {} +
```

### Client vs Server Components

- All interactive components using hooks must have `'use client'` directive
- `src/App.tsx` is a client component (contains ChatBot with state)
- `src/app/layout.tsx` and `src/app/page.tsx` are server components by default

### Clearing Next.js Cache

If you encounter persistent build errors after fixing code:
```bash
rm -rf .next && pnpm dev
```

## Future AI Integration

Currently uses mock responses from `src/utils/mockResponses.ts`. To integrate real AI:
1. Replace `getRandomResponse()` with actual API calls
2. Add environment variables for API keys in `.env.local`
3. Consider implementing streaming responses for better UX
