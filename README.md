# VMF Admin Panel

Internal administration dashboard for the **Veronica Maina Foundation**.

## Access

| Field    | Value                           |
|----------|---------------------------------|
| URL      | http://localhost:3001           |
| Email    | admin@vmf.co.ke                 |
| Password | VMF@Admin2026                   |

> **Note:** Change the credentials in `app/login/page.tsx` before deploying to production.

## Features

- **Dashboard** — Overview stats, recent projects and donations
- **Projects** — Add, edit, and manage foundation projects with status tracking
- **Contractors** — Manage contractors, their specialties, and project assignments
- **Donations** — Record and view all cash and in-kind donations

All data is stored in the browser's `localStorage` and persists across sessions.

## Running Locally

```bash
npm install
npm run dev        # runs on http://localhost:3001
```

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide React (icons)
