/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    const adminPassword = process.env.ADMIN_SEED_PASSWORD
    if (!adminPassword) {
        throw new Error('ADMIN_SEED_PASSWORD environment variable is required to run the seed')
    }

    const hashed = await bcrypt.hash(adminPassword, 12)

    await prisma.user.upsert({
        where: { email: 'admin@youssefalsherief.tech' },
        update: { password: hashed },
        create: {
            email: 'admin@youssefalsherief.tech',
            name: 'Youssef Al-Sherief',
            password: hashed,
            role: 'admin',
        },
    })

    // Basic project
    // Projects are seeded separately by `src/seed-projects.ts`.
    // Keep this seed focused on the admin user to avoid schema mismatch issues.
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        throw e
    })
