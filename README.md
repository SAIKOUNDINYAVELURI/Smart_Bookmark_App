# Smart Bookmark App

A modern, real-time bookmark manager built using Next.js (App Router) and Supabase with Google OAuth authentication. Deployed on Vercel.

## Live Demo

**Live URL:** https://your-vercel-url.vercel.app

**GitHub Repository:** https://github.com/yourusername/smart-bookmark

## Overview

Smart Bookmark is a secure and real-time bookmark management application. Users can authenticate using Google OAuth, create bookmarks, delete bookmarks, and search through them instantly. Each user's data is isolated using Supabase Row Level Security (RLS).

## Features

### Authentication
- Google OAuth login using Supabase Auth
- Secure session handling
- Protected routes (redirects unauthenticated users)

### Bookmark Management
- Add bookmarks (title and URL)
- Delete bookmarks
- User-specific bookmark isolation

### Real-Time Updates
- Instant UI updates using Supabase Realtime
- Cross-tab synchronization

### Search
- Client-side real-time filtering by bookmark title

### UI
- Built with Tailwind CSS v4
- Responsive layout
- Animated background using Vanta.js
- Custom animated buttons

## Tech Stack

**Frontend:** Next.js (App Router), React, Tailwind CSS v4

**Backend:** Supabase (Auth, Postgres, Realtime)

**Deployment:** Vercel

## Project Structure

```
app/
    login/
    dashboard/
    layout.tsx
    page.tsx
components/
    VantaBackground.tsx
lib/
    supabase.ts
public/
    favicon.ico
```

## Database Schema

**Table: bookmarks**

| Column | Type |
|--------|------|
| id | uuid (PK) |
| title | text |
| url | text |
| user_id | uuid |
| created_at | timestamp |

Row Level Security is enabled with policy: `auth.uid() = user_id`

## Real-Time Implementation

Supabase Realtime subscription ensures instant UI updates without page refresh.

## Search Implementation

Client-side filtering by bookmark title (case-insensitive).

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Configure in Vercel: Project → Settings → Environment Variables

## Local Development

```bash
git clone https://github.com/yourusername/smart-bookmark.git
cd smart-bookmark
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Start server:
```bash
npm run dev
```

Open http://localhost:3000

## Deployment

1. Push to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Update Supabase Auth settings with your Vercel domain
5. Redeploy

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Environment variables not recognized | Added variables in Vercel settings and redeployed |
| Google OAuth redirect mismatch | Configured correct production URL in Supabase |
| Realtime not updating | Enabled Realtime for bookmarks table with user_id filter |
| Vanta.js component conflicts | Moved animation logic into dedicated client component |

## Future Improvements

- Edit bookmark functionality
- Sorting (A-Z, newest, oldest)
- Tag-based categorization
- Pagination for large datasets
- Server-side search
- Analytics dashboard

## Key Takeaways

This project demonstrates OAuth authentication, secure database design with RLS, real-time architecture, and production deployment workflows.