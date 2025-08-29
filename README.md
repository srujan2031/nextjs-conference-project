[README_conference_management_system.md](https://github.com/user-attachments/files/22035430/README_conference_management_system.md)
# Conference Management System (Next.js + MySQL)

A full-stack web application to organize academic/industry conferences — manage **conferences**, **call for papers**, **submissions & reviews**, **session schedules**, **mentoring sessions**, and **live chat**.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![React](https://img.shields.io/badge/React-18-61dafb) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![MySQL](https://img.shields.io/badge/MySQL-mysql-orange) ![License: MIT](https://img.shields.io/badge/License-MIT-green)

> Deployed example: `https://cxe1504.uta.cloud/`  
> Local admin (seed): **Email:** `admin@gmail.com` · **Password:** `admin`

---

## ✨ Features

- **Conferences**: Create, list, update, delete conferences with CFP rules & important dates.
- **Call for Papers**: Public page that groups conferences by type and shows CFP details.
- **Paper Submissions**: Authors submit papers and metadata; reviewers can update decisions & feedback.
- **Schedule / Agenda**: Manage talks (title, speaker, abstract, biography, time).
- **Mentoring**: Create mentoring sessions and allow users to register.
- **Chat**: Lightweight chat per conference.
- **Users**: Basic user management (admin, mentor, attendee).
- **Responsive UI** with TailwindCSS.

---

## 🗂 Tech Stack

- **Frontend/Server**: Next.js 14 (App Router) + React 18
- **Styling**: TailwindCSS
- **API**: Next.js Route Handlers under `app/api/*/route.tsx`
- **DB**: MySQL/MariaDB via `mysql2/promise`
- **Client libs**: `axios`, `socket.io-client`, `jquery`
- **Environment**: `.env.local` (DB credentials)

---

## 📦 Project Structure

```
<repo-root>/
├─ conference_management.sql           # MySQL schema + seed data
├─ next - working copy/next - working copy/
│  ├─ app/                             # Next.js (App Router) pages + API routes
│  │  ├─ api/
│  │  │  ├─ conferences/route.tsx      # CRUD for conferences
│  │  │  ├─ schedule/route.tsx         # CRUD for sessions
│  │  │  ├─ submitPaper/route.tsx      # CRUD for paper submissions
│  │  │  ├─ users/route.tsx            # user management
│  │  │  └─ chats/route.tsx            # chat
│  │  ├─ callForPaper/page.tsx         # CFP page
│  │  ├─ joinVirtualConference/page.tsx# sessions + chat
│  │  ├─ mentorship/page.tsx           # mentoring sessions
│  │  ├─ contactus/page.tsx
│  │  ├─ login/page.tsx
│  │  └─ layout.tsx
│  ├─ public/                          # static assets (images, PDFs)
│  ├─ package.json
│  ├─ tailwind.config.ts
│  ├─ tsconfig.json
│  └─ .env.local                       # DB env vars (not committed)
└─ README.md (this file)
```

---

## 🛠️ Local Setup

### 1) Prerequisites
- Node.js 18+
- MySQL/MariaDB (XAMPP is fine)

### 2) Database
Create a database (e.g., `conference_management`) and import the schema:

```bash
mysql -u <USER> -p <DB_NAME> < conference_management.sql
```

### 3) Configure Environment
Create/edit `.env.local`:

```dotenv
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=conference_management
# DB_PORT is hardcoded to '3325' in routes – update if needed
```

### 4) Install & Run
```bash
cd "next - working copy/next - working copy"
npm install
npm run dev
# App: http://localhost:3000
# Admin login: admin@gmail.com / admin
```

---

## 📚 API Overview

- **Conferences**: `/api/conferences` → CRUD  
- **Schedule**: `/api/schedule` → CRUD  
- **Paper Submissions**: `/api/submitPaper` → CRUD + review updates  
- **Users**: `/api/users` → CRUD  
- **Chat**: `/api/chats` → GET/POST  
- **Mentoring**: `/api/mentoring` → CRUD  

---

## 🔐 Security Notes

- Passwords currently stored as plaintext → hash with bcrypt/argon2.  
- Add authentication/authorization (NextAuth/JWT).  
- Validate inputs server-side.  
- Use DB connection pooling.  

---

## 📄 License

MIT License
