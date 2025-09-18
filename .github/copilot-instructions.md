# WellBeing Platform - AI Coding Agent Instructions

## Project Overview

WellBeing is a mental health platform built with **Next.js 14 (App Router)**, **TypeScript**, **Drizzle ORM**, **MySQL**, and **NextAuth.js**. The application enables mood tracking, journaling, therapist appointments, and wellness resources with a focus on user privacy and data persistence.

## Architecture & Key Patterns

### Database Layer (Drizzle ORM + MySQL)

- **Schema**: `lib/db/schema.ts` - Central type definitions using Drizzle's MySQL core
- **Connection**: `lib/db/index.ts` - MUST include `mode: 'default'` in drizzle config (not PlanetScale)
- **Type safety**: Use exported types (e.g., `User`, `NewUser`, `MoodEntry`) from schema
- **Commands**: `npm run db:generate` → `npm run db:push` for schema changes

### Authentication Flow

- **NextAuth.js** with credentials provider in `lib/auth.ts`
- Session strategy: JWT (not database sessions)
- User ID passed via `session.user.id` (string) - convert to `parseInt()` for database operations
- Protected routes: Check `getServerSession(authOptions)` in API routes
- Login redirect: Custom page at `/login` (not default NextAuth page)

### API Route Patterns

Follow this exact structure for all new API routes:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Convert session.user.id to integer for database
  const userId = parseInt(session.user.id);
  // ... rest of implementation
}
```

### Component Architecture

- **Server Components**: Pages in `app/` directory (default)
- **Client Components**: Interactive components in `components/` marked with `'use client'`
- **Data Flow**: Server components fetch data → pass as props → client components handle interactivity
- **Provider Pattern**: `AuthProvider` wraps entire app in `layout.tsx`

### Mood Tracking System

- **5-point scale**: `very_happy`, `happy`, `neutral`, `sad`, `very_sad` (stored as enum)
- **Score mapping**: Very Happy=5, Happy=4, Neutral=3, Sad=2, Very Sad=1
- **Emoji mapping**: Use `getMoodEmoji()` pattern from `MoodTrackingPage.tsx`
- **API endpoint**: `/api/mood` (POST only) - creates new entries

### Data Relationships

Key foreign key relationships in schema:

- `moodEntries.userId` → `users.userId`
- `journals.userId` → `users.userId`
- `appointments.userId` → `users.userId`
- `appointments.therapistId` → `therapists.therapistId`

## Development Workflows

### Database Schema Changes

1. Edit `lib/db/schema.ts`
2. Run `npm run db:generate`
3. Run `npm run db:push`
4. Update TypeScript types as needed

### Adding New Features

1. **API Route**: Create in `app/api/[feature]/route.ts` with authentication
2. **Database Operations**: Use Drizzle syntax with proper foreign keys
3. **Client Component**: Handle form submission and state management
4. **Server Component**: Fetch data and pass to client component as props

### Styling Conventions

- **Tailwind CSS** with custom design system
- **Color palette**: Blue (primary), Green (positive), Orange/Red (negative), Gray (neutral)
- **Responsive**: Mobile-first with `sm:`, `lg:` breakpoints
- **Cards**: Use `bg-white rounded-xl shadow-sm border border-gray-100` pattern

## Environment Setup

Required environment variables in `.env.local`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wellbeing
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Common Patterns & Gotchas

### Database Connection

- Always use `{ mode: 'default' }` in drizzle config (not PlanetScale mode)
- Connection pooling configured with `connectionLimit: 10`

### Session Handling

- Server-side: `await getServerSession(authOptions)`
- Client-side: `useSession()` from NextAuth
- User ID conversion: `parseInt(session.user.id)` for database operations

### Form Submissions

- Use `router.refresh()` after successful API calls to revalidate server components
- Handle loading states with `isSubmitting` pattern
- Always validate required fields before submission

### Component Props

- Pass database entities as props from server components to client components
- Use TypeScript interfaces for prop definitions
- Prefer props over client-side API calls for initial data

When adding new features, follow these established patterns for consistency with the existing codebase. Reference `components/MoodTrackingPage.tsx` and `app/api/mood/route.ts` as canonical examples.
