import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const certifications = [
    {
        title: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        category: "Cloud Computing",
        image: "/assets/aws-certified.png"
    },
    {
        title: "Cisco Certified Network Associate (CCNA)",
        issuer: "Cisco",
        category: "Networking",
        image: "/assets/ccna-certified.png"
    },
    {
        title: "Google Cloud Professional DevOps Engineer",
        issuer: "Google Cloud",
        category: "DevOps",
        image: "/assets/gcp-certified.png"
    }
];

async function seedCertifications() {
    console.log('Seeding certifications...');

    await prisma.certification.deleteMany({});
    console.log('Cleared existing certifications.');

    for (const cert of certifications) {
        await prisma.certification.create({
            data: cert
        });
    }

    console.log('Certifications seeded successfully.');
}

seedCertifications()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
