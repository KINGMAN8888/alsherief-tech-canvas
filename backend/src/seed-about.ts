import { PrismaClient } from "@prisma/client";
import aboutDataEn from "../../frontend/src/i18n/locales/en.json";
import aboutDataAr from "../../frontend/src/i18n/locales/ar.json";

const prisma = new PrismaClient();

const serviceDesign = [
    {
        icon: "Code2",
        color: "from-cyan-500 to-blue-500",
        glow: "rgba(6,182,212,0.22)",
        borderHover: "rgba(6,182,212,0.30)",
    },
    {
        icon: "Smartphone",
        color: "from-blue-500 to-violet-500",
        glow: "rgba(59,130,246,0.22)",
        borderHover: "rgba(59,130,246,0.30)",
    },
    {
        icon: "Network",
        color: "from-violet-500 to-purple-500",
        glow: "rgba(139,92,246,0.22)",
        borderHover: "rgba(139,92,246,0.30)",
    },
    {
        icon: "Cloud",
        color: "from-cyan-400 to-teal-500",
        glow: "rgba(20,184,166,0.22)",
        borderHover: "rgba(20,184,166,0.30)",
    },
    {
        icon: "ShieldCheck",
        color: "from-emerald-500 to-cyan-500",
        glow: "rgba(16,185,129,0.22)",
        borderHover: "rgba(16,185,129,0.30)",
    },
    {
        icon: "Megaphone",
        color: "from-pink-500 to-violet-500",
        glow: "rgba(236,72,153,0.22)",
        borderHover: "rgba(236,72,153,0.30)",
    },
    {
        icon: "Headphones",
        color: "from-amber-500 to-orange-500",
        glow: "rgba(245,158,11,0.22)",
        borderHover: "rgba(245,158,11,0.30)",
    },
] as const;


async function main() {
    console.log("Seeding About and Services data...");

    // Seed About
    const aboutEn = aboutDataEn.about;
    const aboutAr = aboutDataAr.about;
    const servicesEnInfo = aboutDataEn.services;
    const servicesArInfo = aboutDataAr.services;

    await prisma.about.upsert({
        where: { id: "main" },
        update: {},
        create: {
            id: "main",
            label: aboutEn.label,
            labelAr: aboutAr.label,
            title: aboutEn.title,
            titleAr: aboutAr.title,
            subtitle: aboutEn.subtitle,
            subtitleAr: aboutAr.subtitle,
            bio1: aboutEn.bio1,
            bio1Ar: aboutAr.bio1,
            bio2: aboutEn.bio2,
            bio2Ar: aboutAr.bio2,
            bio3: aboutEn.bio3,
            bio3Ar: aboutAr.bio3,
            bio4: aboutEn.bio4,
            bio4Ar: aboutAr.bio4,
            servicesLabel: servicesEnInfo.label,
            servicesLabelAr: servicesArInfo.label,
            servicesTitle: servicesEnInfo.title,
            servicesTitleAr: servicesArInfo.title,
            servicesSubtitle: servicesEnInfo.subtitle,
            servicesSubtitleAr: servicesArInfo.subtitle,
        }
    });
    console.log("Seeded About data");

    // Seed Services
    await prisma.service.deleteMany({}); // Wipe out existing to prevent duplicates during seed

    const servicesEn = aboutDataEn.services.items;
    const servicesAr = aboutDataAr.services.items;

    for (let i = 0; i < servicesEn.length; i++) {
        const itemEn = servicesEn[i];
        const itemAr = servicesAr[i];
        const design = serviceDesign[i];

        await prisma.service.create({
            data: {
                title: itemEn.title,
                titleAr: itemAr?.title,
                badge: itemEn.badge,
                badgeAr: itemAr?.badge,
                description: itemEn.description,
                descriptionAr: itemAr?.description,
                icon: design.icon,
                color: design.color,
                glow: design.glow,
                borderHover: design.borderHover,
                order: i,
            }
        });
    }

    console.log("Seeded Services data");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
