# Nexus AI — Autonomous Customer Resolution Platform

> An enterprise-grade AI agent that resolves customer issues in real time via voice and text — handling refunds, password resets, CRM updates, and escalations autonomously.

---

## Overview

Nexus AI is a full-stack SaaS platform that combines the power of OpenAI's GPT-4o Audio model with a clean, modern interface to deliver instant customer support automation. It reduces resolution time, eliminates manual agent workload, and keeps your CRM updated — all without human intervention.

---

## Features

### AI Support Agent
- **Voice Mode** — Speak naturally; the agent transcribes, processes, and responds with audio in real time
- **Text Mode** — Chat interface with live streaming responses (SSE)
- **Quick Actions** — One-tap suggestions for common requests (refunds, password resets, escalations, account updates)
- **Auto Action Detection** — Agent automatically detects and logs actions taken during conversations

### CRM Portal
- **Live Dashboard** — Real-time KPI cards: customers, open tickets, escalated, resolved, AI actions
- **Agent Activity Feed** — Live table of all actions taken by the AI agent
- **Action Breakdown** — Visual pie chart of action type distribution
- **Customer Management** — Full customer list with ticket status badges
- **Mock Action Trigger** — Simulate AI actions manually for testing

### Authentication
- **User Login & Registration** — Secure session-based authentication with Passport.js
- **Password Hashing** — Passwords hashed with bcryptjs (12 rounds)
- **Protected Routes** — CRM portal requires login; unauthenticated users are redirected to `/login`
- **Session Persistence** — Sessions stored in PostgreSQL via connect-pg-simple
- **Logout** — One-click sign out from the CRM portal header

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI |
| Animations | Framer Motion |
| Data Fetching | TanStack Query v5 |
| Routing | Wouter |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | PostgreSQL (Drizzle ORM) |
| AI | OpenAI GPT-4o Audio, GPT-4o Mini Transcribe |
| Streaming | Server-Sent Events (SSE) |
| Audio | FFmpeg (WebM/MP4 → WAV conversion) |

---

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout.tsx          # Sidebar + main shell
│   │   │   ├── waveform.tsx        # Animated audio waveform
│   │   │   └── ui/                 # shadcn UI components
│   │   ├── pages/
│   │   │   ├── customer-support.tsx  # AI voice & text interface
│   │   │   └── crm-portal.tsx        # Analytics & CRM dashboard
│   │   ├── hooks/
│   │   │   ├── use-crm.ts          # CRM data hooks
│   │   │   └── use-voice.ts        # Conversation hooks
│   │   └── replit_integrations/
│   │       └── audio/              # Voice recording & streaming
├── server/
│   ├── index.ts                    # Express app entry
│   ├── routes.ts                   # API routes (CRM, stats)
│   ├── storage.ts                  # Database interface
│   ├── db.ts                       # Drizzle DB connection
│   └── replit_integrations/
│       ├── audio/                  # Voice chat routes & OpenAI calls
│       └── chat/                   # Conversation history manager
├── shared/
│   └── schema.ts                   # Drizzle schema + Zod types
└── README.md
```

---

## Database Schema

```ts
// Customers
customers: { id, name, email, phone }

// Support Tickets
tickets: { id, customerId, title, status: "open" | "resolved" | "escalated" }

// Agent Actions (auto-logged by AI)
agent_actions: { id, ticketId, actionType, details, createdAt }
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/customers` | List all customers |
| `GET` | `/api/tickets` | List all tickets |
| `GET` | `/api/actions` | List agent actions |
| `GET` | `/api/stats` | Dashboard stats summary |
| `POST` | `/api/actions` | Trigger a manual action |
| `POST` | `/api/conversations` | Create a new session |
| `GET` | `/api/conversations` | List all sessions |
| `POST` | `/api/conversations/:id/messages` | Voice message (audio → response) |
| `POST` | `/api/conversations/:id/text-messages` | Text message (SSE stream) |

---

## AI Agent Capabilities

The Nexus agent (powered by GPT-4o Audio) is prompted to autonomously handle:

| Action | Trigger Phrase Detected | Logged As |
|---|---|---|
| Issue Refund | "I've processed that refund" | `refund` |
| Password Reset | "I've initiated a password reset" | `password_reset` |
| Escalate to Human | "I'm escalating this issue" | `escalate` |
| Update CRM Record | "I've updated your account" | `update_crm` |

---

## Design System

- **Font** — Inter (body), Fira Code (mono)
- **Primary Color** — `#3B82F6` (Blue-500)
- **Secondary Color** — `#8B5CF6` (Violet-500)
- **Background** — `hsl(240, 10%, 3.9%)` — near black
- **Cards** — `hsl(240, 6%, 7%)` with `rgba(255,255,255,0.065)` borders
- **Style** — Premium dark SaaS, glassmorphism panels, smooth Framer Motion animations

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key (with Audio model access)

### Setup

```bash
# Install dependencies
npm install

# Set environment variables
DATABASE_URL=your_postgres_url
OPENAI_API_KEY=your_openai_key

# Start development server
npm run dev
```

The app runs on **port 5000** and serves both the frontend (Vite) and backend (Express) from the same process.

---

## Notes

- **Payment Integration** — Razorpay integration planned. Requires `Key ID` and `Key Secret` from [dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys)
- **Voice requires** — A browser with microphone access and a valid OpenAI API key with GPT-4o Audio enabled
- **FFmpeg** — Must be available in the server environment for audio format conversion

---

## License

MIT — Free to use, modify, and distribute.
