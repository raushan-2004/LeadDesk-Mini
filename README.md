# LeadDesk Mini

> A lightweight, production-ready lead-capture and management platform built for digital design and engineering agencies.

**🔗 Live Demo:** [https://lead-desk-mini-rosy.vercel.app/](https://lead-desk-mini-rosy.vercel.app/)

---

## Overview

LeadDesk Mini provides a **public-facing project inquiry form** for prospective clients and a **secure admin dashboard** for managing and tracking those leads through the pipeline. It is built on Next.js 16 (App Router), backed by MongoDB Atlas, and deployed on Vercel.

---

## Live Demo

| Page | URL |
|------|-----|
| 🌐 Landing Page | [https://lead-desk-mini-rosy.vercel.app/](https://lead-desk-mini-rosy.vercel.app/) |
| 🔐 Admin Login | [https://lead-desk-mini-rosy.vercel.app/login](https://lead-desk-mini-rosy.vercel.app/login) |
| 📊 Admin Dashboard | [https://lead-desk-mini-rosy.vercel.app/admin](https://lead-desk-mini-rosy.vercel.app/admin) *(requires login)* |

### Test Admin Credentials

```
Email:    admin@leaddesk.com
Password: testpassword999
```

> **Note:** The admin dashboard is protected by Auth.js v5 JWT sessions. You must sign in at `/login` before accessing `/admin`.

---

## Features

### 🌍 Public Landing Page & Lead Capture
- **Agency Presentation** — Modern, minimal layout outlining studio capabilities, values, and collaboration processes
- **Interactive Inquiry Form** — Captures **Name**, **Email**, **Budget Range**, and **Project Message**
- **Dual Validation** — Client-side React Hook Form + Zod, and independent server-side Zod validation
- **Responsive** — Designed for mobile (360 px), tablet (768 px), and desktop (1440 px)

### 🔐 Authentication
- Credential-based login via **Auth.js v5** (NextAuth)
- **JWT sessions** — stateless, no separate session database required
- Protected routes enforced via **Next.js Middleware**
- Bootstrap admin account with the `npm run create-admin` script

### 📊 Admin Dashboard (`/admin`)
- **Lead Table** — Real-time database inquiries sorted newest-first; semantic table on desktop, cards on mobile
- **Global Stats** — Live counts for Total, New, Contacted, and Closed leads
- **Search & Filter** — Case-insensitive text search by name/email; filter by status
- **Status Management** — Click the ⋮ context menu on any lead to change its status (`NEW → CONTACTED → CLOSED`)
- **Message Inspector** — Inline clamp-and-expand to read long messages without leaving the page
- **Mailto Links** — Click any email to open your mail client directly

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Authentication | Auth.js v5 (NextAuth) — Credentials + JWT |
| Database | MongoDB Atlas + Mongoose |
| Form Handling | React Hook Form |
| Validation | Zod + @hookform/resolvers |
| Deployment | Vercel |

---

## Architecture

```
Browser (React Hook Form + Zod client schema)
   │
   ↓  HTTPS
Next.js Middleware  ──── auth check ──── /admin, /api/leads (GET/PATCH)
   │                                          │
   │                                    Auth.js v5 (JWT)
   ↓
Next.js API Route Handlers
  POST /api/leads         — public, no auth
  GET  /api/leads         — requires ADMIN session
  PATCH /api/leads/[id]/status — requires ADMIN session
   │
   ↓  Zod server validation + Mongoose ORM
MongoDB Atlas (Cloud database)
```

---

## Data Models

### Lead

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| `name` | `String` | Required, 2–80 chars | — |
| `email` | `String` | Required, valid email, lowercase | — |
| `budget` | `String` | Enum: `UNDER_1K` · `BETWEEN_1K_5K` · `BETWEEN_5K_10K` · `ABOVE_10K` · `NOT_SURE` | — |
| `message` | `String` | Required, 10–2000 chars | — |
| `status` | `String` | Enum: `NEW` · `CONTACTED` · `CLOSED` | `NEW` |
| `createdAt` | `Date` | Auto-generated | — |
| `updatedAt` | `Date` | Auto-generated | — |

### AdminUser

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | `String` | Required |
| `email` | `String` | Required, unique, lowercase |
| `passwordHash` | `String` | bcrypt hash (`select: false`) |
| `role` | `String` | Enum: `ADMIN` |

---

## API Reference

### POST `/api/leads` — Submit a lead *(public)*

```json
// Request body
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "budget": "BETWEEN_5K_10K",
  "message": "We need assistance building a custom payment pipeline."
}
```

```json
// 201 Created
{
  "success": true,
  "data": {
    "_id": "6a635c2e1474d0e8d99b68dc",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "budget": "BETWEEN_5K_10K",
    "message": "We need assistance building a custom payment pipeline.",
    "status": "NEW",
    "createdAt": "2026-07-24T12:35:58.161Z",
    "updatedAt": "2026-07-24T12:35:58.161Z"
  }
}
```

### GET `/api/leads` — Retrieve leads *(requires auth)*

| Query Param | Type | Description |
|-------------|------|-------------|
| `search` | string | Case-insensitive match on name or email |
| `status` | string | Filter: `NEW` · `CONTACTED` · `CLOSED` |

```json
// 200 OK
{ "success": true, "data": [ ... ] }
```

### PATCH `/api/leads/[id]/status` — Update status *(requires auth)*

```json
// Request body
{ "status": "CONTACTED" }

// 200 OK
{ "success": true, "data": { "_id": "...", "status": "CONTACTED", ... } }
```

---

## Local Development

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/leaddesk-mini.git
cd leaddesk-mini
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB connection string — include the database name
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/leaddesk

# Admin bootstrap credentials (used only by the create-admin script)
ADMIN_EMAIL=admin@leaddesk.com
ADMIN_PASSWORD=your_secure_password

# Auth.js secret — generate with: openssl rand -hex 32
AUTH_SECRET=your_auth_secret_here
```

### 3. Seed the Admin Account

```bash
npm run create-admin
```

This script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`, hashes the password with bcrypt, and inserts the admin user into MongoDB. Re-running it deletes and recreates the admin record to keep credentials in sync.

### 4. Start the Development Server

```bash
npm run dev
```

| Page | URL |
|------|-----|
| Landing page | [http://localhost:3000](http://localhost:3000) |
| Admin login | [http://localhost:3000/login](http://localhost:3000/login) |
| Admin dashboard | [http://localhost:3000/admin](http://localhost:3000/admin) |

Sign in with the credentials you set in `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

---

## Deployment (Vercel + MongoDB Atlas)

### MongoDB Atlas Setup
1. Create a cluster and database (e.g. `leaddesk`).
2. Under **Network Access**, add `0.0.0.0/0` to allow Vercel Serverless connections.
3. Create a **Database User** with read/write access.
4. Copy the connection string and append your database name: `...mongodb.net/leaddesk`.

### Vercel Setup
1. Import the repository into Vercel.
2. Set **Framework Preset** → `Next.js`.
3. Add the following **Environment Variables** under Project Settings:

   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `ADMIN_EMAIL` | Admin email |
   | `ADMIN_PASSWORD` | Admin password |
   | `AUTH_SECRET` | 32-byte hex secret |

4. Deploy. After the first deployment, run the bootstrap script locally pointing at the production Atlas URI to seed the admin account.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public landing page
│   ├── login/page.tsx        # Admin login page
│   ├── admin/page.tsx        # Admin dashboard (protected)
│   └── api/
│       ├── leads/route.ts    # POST (public) + GET (auth)
│       └── leads/[id]/status/route.ts  # PATCH (auth)
├── components/
│   ├── admin/                # Dashboard UI components
│   ├── auth/                 # LoginForm
│   ├── forms/                # Lead capture form
│   └── landing/              # Landing page sections
├── lib/
│   ├── db.ts                 # MongoDB connection manager
│   └── validations/          # Zod schemas
├── models/
│   ├── Lead.ts               # Lead Mongoose model
│   └── AdminUser.ts          # AdminUser Mongoose model
├── auth.ts                   # Auth.js v5 configuration
└── middleware.ts             # Route protection middleware
scripts/
└── create-admin.ts           # Admin bootstrap script
```

---

## Task Context

This project was built as part of the qualification assignment for the **Digital Heroes Full Stack Developer** training program.

---

## AI Usage

AI-assisted development tools were used during planning, implementation review, and debugging. All generated suggestions were reviewed, tested, and adapted to the project's architecture, validation requirements, API design, and UI behaviour before being included.
