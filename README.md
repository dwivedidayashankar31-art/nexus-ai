# Nexus AI — Autonomous Customer Resolution Platform

Nexus AI is a full-stack SaaS platform that uses OpenAI GPT-4o to autonomously resolve customer support queries via voice and text. It includes a CRM dashboard, session-based authentication, and a fully functional settings panel.

---

## Features

### AI Support Agent
- Real-time voice and text conversations powered by **OpenAI GPT-4o Audio**
- Streaming responses via Server-Sent Events (SSE)
- Automatic actions: issue refunds, reset passwords, cancel orders, escalate tickets
- Conversation history with timestamps

### CRM Dashboard
- Live statistics: total customers, open tickets, escalations, resolved cases
- Customer directory with ticket management
- Agent action log
- Protected route — requires login

### Authentication
- Secure session-based login with **Passport.js** and **bcrypt**
- Username rules: 3–20 characters, alphanumeric only
- Password rules: min 6 characters, must contain letters and numbers
- Register / Login / Logout flows
- Show/hide password toggle with real-time validation rules

### Settings Panel (Fully Functional)
- **Account** — view username, role, session status; change password (real API)
- **Appearance** — Dark / Light / System theme (persisted across reloads)
- **Language** — English, Hindi, Spanish, French (preference saved)
- **Notifications** — Email alerts, AI action alerts, escalation alerts (toggles saved)
- **AI Preferences** — Voice mode, auto-log, streaming, response style (all saved)
- **About** — Platform, version, stack info
- **Contact Us** — Phone (+91 74896 55562) and Email (dwivedidayashankar31@gmail.com) with clickable links

### Pricing Page
- Starter, Professional, and Enterprise plans
- Payment integration placeholder (Razorpay — coming soon)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL with Drizzle ORM |
| Auth | Passport.js (LocalStrategy), bcryptjs, express-session |
| AI | OpenAI GPT-4o Audio (Realtime API) |
| Routing | Wouter |
| State | TanStack Query (React Query v5) |
| UI Components | shadcn/ui |

---

## Project Structure

```
nexus-ai/
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # AI Support, CRM, Pricing, Settings, Login
│       ├── components/      # Layout (sidebar), UI components
│       └── hooks/           # useAuth, useSettings
├── server/                  # Express backend
│   ├── auth.ts              # Passport.js + session auth + password change API
│   ├── routes.ts            # API routes (conversations, stats, CRM)
│   ├── storage.ts           # Database interface (Drizzle ORM)
│   └── index.ts             # Server entry point
├── shared/
│   └── schema.ts            # Drizzle schema + Zod types
└── replit.md                # Project notes
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- OpenAI API key

### Environment Variables

```env
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_session_secret
OPENAI_API_KEY=your_openai_api_key
```

### Install & Run

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5000` — frontend and backend served on the same port.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Create new account |
| POST | `/api/login` | Sign in |
| POST | `/api/logout` | Sign out |
| GET | `/api/me` | Get current user |
| POST | `/api/change-password` | Update password (auth required) |
| GET | `/api/conversations` | List AI conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/stats` | CRM statistics |
| GET | `/api/customers` | Customer list |
| GET | `/api/tickets` | Support tickets |

---

## Contact

- **Phone / WhatsApp:** +91 74896 55562
- **Email:** dwivedidayashankar31@gmail.com

---

## License

MIT License — feel free to use and modify.
