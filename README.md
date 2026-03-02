<div align="center">
  <h1>🚀 Al Sherief Tech Canvas</h1>
  <p><strong>Professional, High-Performance, Bilingual Portfolio & SaaS Platform</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## Overview

**Al Sherief Tech Canvas** is a modern, enterprise-grade personal portfolio platform built with scalability and performance in mind. It features a custom **Node.js/Express backend API**, a **PostgreSQL database**, and a highly interactive **React frontend** — fully containerized using **Docker**.

---

## ✨ Features

- 🌐 **Bilingual Support** — Full RTL/LTR for English and Arabic
- 🔐 **JWT Authentication** — Custom admin dashboard with secure login
- 📊 **Dynamic Portfolio** — CRUD for Projects, Skills, Certifications from admin panel
- 🎨 **Premium UI/UX** — Tailwind CSS, Framer Motion, shadcn/ui, glassmorphism, dark mode
- 🐳 **Fully Dockerized** — One command to spin up the entire stack
- 📱 **Fully Responsive** — Desktop, tablet, and mobile optimized

---

## 🏗️ Architecture

```
alsherief-tech-canvas/
├── backend/          # Node.js + Express + Prisma API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── lib/
│   ├── Dockerfile.dev
│   └── package.json
└── docker-compose.yml
```

### Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 7, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, Axios, React Query |
| **Backend** | Node.js, Express.js, Prisma ORM, JWT, bcryptjs |
| **Database** | PostgreSQL 16 |
| **Infrastructure** | Docker, Docker Compose, Nginx (production) |

---

## 🛠️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### 1. Clone & Configure

```bash
git clone https://github.com/alsherief/alsherief-tech-canvas.git
cd alsherief-tech-canvas
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL="postgresql://admin:admin_password@db:5432/portfolio_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
```

### 2. Start the Stack

```bash
docker-compose up -d --build
```

### 3. Initialize Database

```bash
docker exec -it node_backend npx prisma migrate dev --name init
docker exec -it node_backend npx prisma db seed
```

### 4. Access

| Service | URL |
|---|---|
| Frontend | `http://localhost:8080/en` |
| Backend API | `http://localhost:5000/api/health` |

**Default Admin:** `admin@techcanvas.io` / `admin_password`

---

## 🌍 Deployment

Optimized for VPS hosting (Hostinger, DigitalOcean, AWS):

```bash
docker-compose -f docker-compose.prod.yml up -d --build
docker exec -it node_backend npx prisma migrate deploy
```

---

## 🛡️ Security

- Passwords encrypted with **bcrypt**
- API routes protected via **JWT** middleware
- Environment variables for all secrets
- Input validation on all API write operations

---

## 📝 License

Designed & Developed by [Youssef Al-Sherief](https://github.com/alsherief). All Rights Reserved.
