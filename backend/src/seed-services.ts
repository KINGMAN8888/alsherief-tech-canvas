import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SERVICES = [
    // ── 1. Full-Stack Web Development ──────────────────────────────────────────
    {
        icon: "Code2",
        color: "from-cyan-500 to-blue-500",
        glow: "rgba(6,182,212,0.22)",
        borderHover: "rgba(6,182,212,0.30)",
        badge: "MERN Stack",
        badgeAr: "MERN Stack",
        title: "Full-Stack Web Development",
        titleAr: "تطوير الويب Full-Stack",
        description:
            "End-to-end web applications architected for scale — from PostgreSQL schema design and Express.js REST APIs to pixel-perfect React frontends with TypeScript and Tailwind CSS.",
        descriptionAr:
            "تطبيقات ويب متكاملة مُصمَّمة للتوسع — من تصميم قواعد البيانات وواجهات API إلى واجهات React الأمامية المثالية باستخدام TypeScript وTailwind CSS.",
        order: 0,
    },

    // ── 2. Mobile App Development ──────────────────────────────────────────────
    {
        icon: "Smartphone",
        color: "from-blue-500 to-violet-500",
        glow: "rgba(59,130,246,0.22)",
        borderHover: "rgba(59,130,246,0.30)",
        badge: "Flutter & Dart",
        badgeAr: "Flutter & Dart",
        title: "Mobile App Development",
        titleAr: "تطوير تطبيقات الجوال",
        description:
            "Cross-platform iOS & Android applications built with Flutter — delivering native performance, smooth 60 fps animations, clean BLoC architecture, and seamless API integration.",
        descriptionAr:
            "تطبيقات iOS وAndroid متعددة المنصات بـ Flutter — أداء أصلي وحركات سلسة بـ 60 إطاراً/ثانية وبنية BLoC نظيفة وتكامل سلس مع الـ API.",
        order: 1,
    },

    // ── 3. Cloud & DevOps ──────────────────────────────────────────────────────
    {
        icon: "Cloud",
        color: "from-cyan-400 to-teal-500",
        glow: "rgba(20,184,166,0.22)",
        borderHover: "rgba(20,184,166,0.30)",
        badge: "AWS · Azure · Docker",
        badgeAr: "AWS · Azure · Docker",
        title: "Cloud & DevOps Engineering",
        titleAr: "هندسة السحابة وDevOps",
        description:
            "Cloud provisioning on AWS & Azure, Docker containerization, GitHub Actions CI/CD pipelines, Nginx reverse proxy, VPS hardening, and automated zero-downtime deployments.",
        descriptionAr:
            "توفير السحابة على AWS وAzure، وحاويات Docker، وأنابيب CI/CD بـ GitHub Actions، وNginx، وتأمين الخوادم، والنشر الآلي بدون انقطاع.",
        order: 2,
    },

    // ── 4. Network Infrastructure ──────────────────────────────────────────────
    {
        icon: "Network",
        color: "from-violet-500 to-purple-500",
        glow: "rgba(139,92,246,0.22)",
        borderHover: "rgba(139,92,246,0.30)",
        badge: "Enterprise Networking",
        badgeAr: "شبكات مؤسسية",
        title: "Network Infrastructure",
        titleAr: "البنية التحتية للشبكات",
        description:
            "Enterprise-grade network design and management — Cisco routing & switching (CCNA/CCNP level), VLAN segmentation, firewall policy, VPN setup, and on-site infrastructure deployment.",
        descriptionAr:
            "تصميم وإدارة شبكات على مستوى المؤسسات — توجيه وتبديل Cisco ومستوى CCNA/CCNP، وتقسيم VLAN، وسياسات الجدار الناري، وإعداد VPN، ونشر البنية التحتية في الموقع.",
        order: 3,
    },

    // ── 5. Cybersecurity ───────────────────────────────────────────────────────
    {
        icon: "ShieldCheck",
        color: "from-emerald-500 to-cyan-500",
        glow: "rgba(16,185,129,0.22)",
        borderHover: "rgba(16,185,129,0.30)",
        badge: "Ethical Hacking · Consulting",
        badgeAr: "اختبار اختراق · استشارات",
        title: "Cybersecurity Consulting",
        titleAr: "استشارات الأمن السيبراني",
        description:
            "Penetration testing, vulnerability assessments, security hardening, and layered defense strategies — keeping organizations compliant and their assets protected against modern threats.",
        descriptionAr:
            "اختبار الاختراق، وتقييم الثغرات، وتعزيز الأمان، واستراتيجيات الدفاع متعدد الطبقات — حماية المؤسسات وأصولها من التهديدات الحديثة.",
        order: 4,
    },

    // ── 6. AI & Automation ─────────────────────────────────────────────────────
    {
        icon: "BrainCircuit",
        color: "from-pink-500 to-violet-500",
        glow: "rgba(236,72,153,0.22)",
        borderHover: "rgba(236,72,153,0.30)",
        badge: "AI · Bots · Automation",
        badgeAr: "ذكاء اصطناعي · بوتات · أتمتة",
        title: "AI & Workflow Automation",
        titleAr: "الذكاء الاصطناعي وأتمتة سير العمل",
        description:
            "Intelligent Telegram & Discord bots, LLM-powered assistants, web scraping pipelines, n8n/Make workflow automation, and custom AI integrations tailored to your business processes.",
        descriptionAr:
            "بوتات Telegram وDiscord الذكية، ومساعدون مدعومون بنماذج اللغة الكبيرة، ومسارات استخراج البيانات، وأتمتة سير العمل بـ n8n/Make، وتكاملات AI مخصصة لعمليات عملك.",
        order: 5,
    },

    // ── 7. Digital Marketing & Branding ────────────────────────────────────────
    {
        icon: "Megaphone",
        color: "from-amber-500 to-orange-500",
        glow: "rgba(245,158,11,0.22)",
        borderHover: "rgba(245,158,11,0.30)",
        badge: "SEO · Brand Identity",
        badgeAr: "SEO · هوية العلامة التجارية",
        title: "Digital Marketing & Branding",
        titleAr: "التسويق الرقمي والعلامة التجارية",
        description:
            "Data-driven campaigns, SEO optimization, social media strategy, and full brand identity design — converting visitors into loyal customers and building lasting online presence.",
        descriptionAr:
            "حملات مبنية على البيانات، وتحسين SEO، واستراتيجية وسائل التواصل، وتصميم هوية علامة تجارية متكاملة — تحويل الزوار إلى عملاء مخلصين وبناء حضور رقمي راسخ.",
        order: 6,
    },

    // ── 8. IT Support & Hardware ───────────────────────────────────────────────
    {
        icon: "Cpu",
        color: "from-slate-400 to-slate-600",
        glow: "rgba(148,163,184,0.20)",
        borderHover: "rgba(148,163,184,0.28)",
        badge: "Hardware · IT Management",
        badgeAr: "أجهزة · إدارة IT",
        title: "IT Support & Hardware",
        titleAr: "الدعم التقني والأجهزة",
        description:
            "End-to-end IT department management, server assembly & RAID configuration, PCB microsoldering, enterprise helpdesk operations, and scheduled preventive maintenance programs.",
        descriptionAr:
            "إدارة متكاملة لقسم تكنولوجيا المعلومات، وتجميع الخوادم وإعداد RAID، ولحام دوائر PCB الدقيقة، وعمليات مكتب المساعدة المؤسسي، وبرامج الصيانة الوقائية الدورية.",
        order: 7,
    },
];

async function main() {
    console.log("🌱  Seeding services...");

    // Wipe existing services to avoid duplicates
    await prisma.service.deleteMany({});
    console.log("   ✓ Cleared existing services");

    // Ensure the About singleton exists (required by schema)
    await prisma.about.upsert({
        where: { id: "main" },
        update: {},
        create: { id: "main" },
    });

    // Insert all services
    for (const svc of SERVICES) {
        await prisma.service.create({ data: svc });
        console.log(`   ✓ Created: ${svc.title}`);
    }

    console.log(`\n✅  Done — ${SERVICES.length} services seeded successfully.`);
}

main()
    .catch((e) => {
        console.error("❌  Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
