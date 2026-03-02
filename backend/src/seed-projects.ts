import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
    {
        slug: "pc-master",
        emoji: "🖥️",
        tech: ["MERN Stack", "JWT Auth", "AI Integration"],
        link: "https://pc-master-files.onrender.com",
        github: "https://github.com/KINGMAN8888/PC-Master",
        image: "https://opengraph.githubassets.com/1/KINGMAN8888/PC-Master",
        color: "from-cyan-500 to-blue-500",
    },
    {
        slug: "smart-answer-ai",
        emoji: "🤖",
        tech: ["Python", "Telegram API", "NLP"],
        link: "https://t.me/SmartAnswerAi_bot",
        github: "https://github.com/KINGMAN8888/SmartAnswer",
        image: "https://opengraph.githubassets.com/1/KINGMAN8888/SmartAnswer",
        color: "from-violet-500 to-purple-500",
    },
    {
        slug: "dom-dash-do",
        emoji: "✅",
        tech: ["React", "TypeScript", "Tailwind CSS", "Local Storage"],
        link: "https://dom-dash-do.lovable.app/",
        github: "https://github.com/KINGMAN8888/dom-dash-do",
        image: "https://opengraph.githubassets.com/1/KINGMAN8888/dom-dash-do",
        color: "from-emerald-500 to-cyan-500",
    },
    {
        slug: "al-tawasul",
        emoji: "🌐",
        tech: ["Docker", "Prisma", "VPS Hosting"],
        github: "https://github.com/KINGMAN8888/al-tawasul-al-alami",
        image: "https://opengraph.githubassets.com/1/KINGMAN8888/al-tawasul-al-alami",
        color: "from-blue-500 to-indigo-500",
    },
    {
        slug: "python-hub",
        emoji: "🐍",
        tech: ["Python", "Web", "Payments"],
        github: "https://github.com/KINGMAN8888/python-hub",
        image: "https://opengraph.githubassets.com/1/KINGMAN8888/python-hub",
        color: "from-amber-500 to-orange-500",
    }
];

async function seed() {
    console.log('Seeding projects...');
    for (const p of projects) {
        await prisma.project.upsert({
            where: { slug: p.slug },
            update: p,
            create: p,
        });
    }
    console.log('Seeding complete.');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
