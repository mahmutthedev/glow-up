# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack (Next.js 15.5.2)
- `npm run build` - Build production bundle with Turbopack  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database (development)
- `npx prisma studio` - Open Prisma Studio database browser
- `npx prisma migrate dev` - Create and apply new migration (development)
- `npx prisma migrate deploy` - Apply migrations in production

### UI Components
- `npx shadcn@latest add <component-name>` - Add new shadcn/ui components
- Components are configured for "new-york" style with CSS variables

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4 with Google OAuth and Prisma adapter
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **Icons**: Lucide React
- **AI Integration**: OpenRouter API (Google Gemini 2.5 Flash) for image generation

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth.js authentication
│   │   ├── credits/                # User credits management
│   │   └── generate/              # AI image generation endpoint
│   ├── layout.tsx                 # Root layout with providers
│   └── page.tsx                   # Main application page
├── components/
│   ├── auth-button.tsx            # Authentication UI component
│   ├── profile-picture-pro.tsx    # Main application component
│   ├── providers.tsx              # Next.js providers wrapper
│   └── ui/                        # shadcn/ui components
└── lib/
    ├── auth.ts                    # NextAuth configuration
    └── prisma.ts                  # Prisma client instance
```

### Database Schema

#### Authentication (NextAuth.js standard)
- `User` - User accounts with app-specific `credits` field (default 3)
- `Account` - OAuth provider accounts  
- `Session` - User sessions
- `VerificationToken` - Email verification

#### Application Data
- `Photo` - Stores original uploads and generated profile pictures
  - Links to `User` via `userId`
  - Stores `originalUrl` and array of `generatedUrls`

### Authentication Flow
1. Google OAuth via NextAuth.js
2. Database sessions (not JWT)
3. Prisma adapter handles user/session storage
4. New users get 3 free credits
5. Session includes user ID via custom callback

### AI Image Generation
- **Service**: OpenRouter API with Google Gemini 2.5 Flash model  
- **Process**: Uploads base64 image → 10 predefined prompts → Returns generated profile pictures
- **Credits**: 1 credit per generation (10 images)
- **Prompts**: Lifestyle scenarios (rooftop bar, hiking, cooking, etc.) with physique customization

### Key Environment Variables
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET` - NextAuth.js config
- `OPENROUTER_API_KEY` - AI image generation

### Component Architecture
- **ProfilePicturePro**: Main component with step-by-step UI (upload → customize → generate)
- **AuthButton**: Handles sign-in/sign-out with session management
- **Providers**: Wraps app with NextAuth SessionProvider
- All components use Tailwind + shadcn/ui design system

### State Management
- NextAuth sessions for user state
- Component-level React state for UI interactions
- Database persistence via Prisma for credits and photos