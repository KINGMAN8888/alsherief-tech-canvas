import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const basicSkills = [
    {
        category: "Languages",
        sub: "Core Tech",
        items: ["TypeScript", "Python", "JavaScript", "Dart", "C++", "HTML", "CSS"],
    },
    {
        category: "Frontend Dev",
        sub: "UI/UX",
        items: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Framer Motion", "Flutter"],
    },
    {
        category: "Backend Dev",
        sub: "Server-side",
        items: ["Node.js", "Express", "NestJS", "Django", "FastAPI"],
    },
    {
        category: "DevOps & Cloud",
        sub: "Infrastructure",
        items: ["Docker", "Kubernetes", "AWS", "GitHub Actions", "Nginx", "Linux"],
    },
    {
        category: "Databases",
        sub: "Data Storage",
        items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Prisma"],
    },
    {
        category: "Tools & Testing",
        sub: "Workflow",
        items: ["Git", "Jest", "Postman", "Cypress", "Selenium", "n8n"],
    }
];

async function seedSkills() {
    console.log('Seeding skills...');

    // Clear existing skills to prevent duplicates during seeding
    await prisma.skill.deleteMany({});
    console.log('Cleared existing skills.');

    for (const skill of basicSkills) {
        await prisma.skill.create({
            data: skill
        });
    }

    console.log('Skills seeded successfully.');
}

seedSkills()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
