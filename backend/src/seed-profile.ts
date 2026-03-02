import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultProfile = {
    id: 'main',
    name: "Yousef Alsherief",
    nameAr: "يوسف الشريف",
    headline: "Full Stack Engineer & AI Enthusiast",
    headlineAr: "مهندس فول ستاك ومتحمس للذكاء الاصطناعي",
    bio: "I build high-performance web applications with modern technologies. Passionate about AI, embedded systems, and delivering real value through code.",
    bioAr: "أبني تطبيقات ويب عالية الأداء باستخدام أحدث التقنيات. شغفي في الذكاء الاصطناعي والأنظمة المدمجة وتقديم قيمة حقيقية من خلال البرمجة.",
    heroBio: "From server assembly to AI-powered applications — delivering end-to-end solutions across the entire technology stack with precision and scale.",
    heroBioAr: "من تجميع الخوادم إلى تطبيقات الذكاء الاصطناعي — أقدم حلولاً متكاملة عبر كامل مكدس التكنولوجيا بدقة وقابلية للتوسع.",
    heroBioCyan: "server assembly",
    heroBioViolet: "AI-powered applications",
    heroRoles: [
        "Full-Stack Developer",
        "AI Engineer",
        "Cloud Architect",
        "Computer Engineer",
        "System Administrator",
    ],
    location: "Alexandria, Egypt",
    locationAr: "الإسكندرية، مصر",
    availability: "Available for freelance work",
    availabilityAr: "متاح للعمل الحر",
    email: "yousefmahmoudsaber@gmail.com",
    phone: "+201097585951",
    yearsExp: 5,
    projectsCount: 30,
    technologiesCount: 20,
    countriesCount: 3,
    social: {
        github: "https://github.com/KINGMAN8888",
        linkedin: "https://linkedin.com/in/youssefalsherief",
        twitter: "",
        website: "",
        telegram: "https://t.me/KINGMAN_JOU",
        facebook: "https://facebook.com/kingsmanjou",
        instagram: "https://instagram.com/kingman_jou",
        whatsapp: "https://wa.me/201097585951",
    }
};

async function seedProfile() {
    console.log('Seeding profile...');
    await prisma.profile.upsert({
        where: { id: 'main' },
        update: defaultProfile,
        create: defaultProfile,
    });
    console.log('Profile seeded successfully with heroRoles, heroBioCyan, heroBioViolet.');
}

seedProfile()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
