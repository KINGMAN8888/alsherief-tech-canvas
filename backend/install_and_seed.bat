@echo off
npm install
npx prisma generate
npx tsx src/seed-projects.ts
