# ANILEGEON — Premium Anime Streaming Platform

A production-ready, full-stack anime streaming platform built with React, Express.js, and Supabase.

## Tech Stack

### Frontend
- React.js (Vite) + TypeScript
- TailwindCSS
- Framer Motion
- React Router
- Zustand (State Management)
- Axios

### Backend
- Node.js + Express.js + TypeScript
- JWT Authentication
- Role-based Authorization
- Multer (File Uploads)
- MVC Architecture

### Database
- Supabase (PostgreSQL)
- Supabase Storage (Images & Videos)

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Supabase account

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories and fill in your credentials.

### 3. Setup Database

Run the SQL migration script from `database/migration.sql` in your Supabase SQL editor.

### 4. Start Development (Two Servers)

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 5. Unified Run (Production Mode)

To run both frontend and backend on a single port (5000):

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

### ⚡ Secret Features

- **Hidden Admin Login**: Type `pono0908` anywhere on the site to open the secret admin login modal.
- **Default password**: `admin123`

### 6. Create Admin User

Register a normal user, then update their role to 'admin' in the Supabase dashboard:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Project Structure

```
ANILEGEON/
├── frontend/          # React + Vite frontend
├── backend/           # Express.js API server
├── database/          # SQL migration scripts
├── docs/              # Documentation
├── .env.example
├── docker-compose.yml
└── README.md
```

## License

MIT
