<div align="center">
  <img src="public/favicon.ico" alt="Tech Canvas Logo" width="80" height="80" />
  <h1>Al Sherief Tech Canvas</h1>
  <p>A Professional, High-Performance, Bilingual Portfolio & SaaS Platform</p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## 🚀 Overview

**Al Sherief Tech Canvas** is a modern, enterprise-grade personal portfolio and SaaS platform designed to showcase projects, skills, certifications, and professional experience. 

Built with scalability and performance in mind, it features a completely custom **Node.js/Express backend API**, a **PostgreSQL database**, and a highly interactive **React frontend**. The entire stack is fully containerized using **Docker** for seamless development and deployment.

---

## ✨ Features

- **🌐 Bilingual Support:** Full RTL/LTR support for both English and Arabic interfaces.
- **🔐 Secure Admin Dashboard:** Custom JWT-based authentication system to manage content dynamically.
- **📊 Dynamic Portfolio Management:** CRUD operations for Projects, Skills, Experience, and Certifications directly from the admin panel.
- **🎨 Premium UI/UX:** Built with Tailwind CSS, Framer Motion, and shadcn/ui for glassmorphism effects, smooth animations, and a rich dark mode.
- **🐳 Fully Dockerized:** `docker-compose` setup encompassing the frontend, backend API, and Postgres database.
- **📱 Fully Responsive:** Optimized for desktops, tablets, and mobile devices.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS
- **UI Components:** Radix UI, shadcn/ui
- **Animations:** Framer Motion
- **Data Fetching:** Axios, React Query (@tanstack/react-query)
- **Localization:** i18next

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Language:** TypeScript

### Infrastructure
- **Database:** PostgreSQL 16
- **Containerization:** Docker & Docker Compose
- **Proxy/Web Server (Production):** Nginx

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Node.js (v18+) & npm (if you wish to run services outside of Docker)

### 1. Clone the repository
```bash
git clone https://github.com/alsherief/alsherief-tech-canvas.git
cd alsherief-tech-canvas
```

### 2. Environment Setup
Create a `.env` file in the `backend` directory based on the configuration:
```bash
cp backend/.env.example backend/.env
```
Ensure the `.env` contains your database URL and JWT secret:
```env
DATABASE_URL="postgresql://admin:admin_password@db:5432/portfolio_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
```

### 3. Spin up the Stack using Docker
Start the PostgreSQL database, Node API, and React Frontend in detached mode:
```bash
docker-compose up -d --build
```

### 4. Database Setup & Seeding
Once the containers are running, generate the Prisma client, run migrations, and seed the initial admin user and sample data:
```bash
docker exec -it node_backend npx prisma migrate dev --name init
docker exec -it node_backend npx prisma db seed
```

### 5. Access the Application
- **Frontend (Public & Admin):** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api/health`

**Admin Login Credentials (from seed):**
- Email: `admin@techcanvas.io`
- Password: `admin_password`

---

## 🌍 Deployment (Production)

This project is optimized for deployment on VPS hosting (e.g., Hostinger, DigitalOcean, AWS).

1. Clone the repository on your server.
2. Configure your production `.env` files with secure passwords and secrets.
3. Run the production docker-compose file (make sure you have Nginx routing configured):
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
4. Run production migrations:
```bash
docker exec -it node_backend npx prisma migrate deploy
```

---

## 🛡️ Security

- Passwords are encrypted using **bcrypt**.
- API routes are protected via **JWT** middleware.
- Environment variables secure database credentials and signing keys.
- Input validation implemented for all administrative API write operations.

---

## 📝 License

Designed and Developed by [Youssef Al-Sherief](https://github.com/alsherief). All Rights Reserved.
