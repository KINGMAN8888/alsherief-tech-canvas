import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NeuralBackground from "@/components/NeuralBackground";
import About from "@/components/About";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

// Standard imports instead of lazy loading to ensure all section IDs are present for native hash scrolling
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

const Index = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const loc = locale ?? "en";
  const canonicalUrl = `https://youssefalsherief.tech/${loc}`;

  // Structured Data (JSON-LD) for better SEO discoverability
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Youssef AlSherief",
    "url": "https://youssefalsherief.tech",
    "jobTitle": "Devops Engineer & Backend Developer",
    "sameAs": [
      "https://github.com/KINGMAN8888",
      "https://www.linkedin.com/in/youssef-al-sherief-966567156/",
      "https://x.com/YousefSaberjou"
    ]
  };

  return (
    <main className="relative min-h-screen bg-transparent">

      {/* ── GLOBAL ANIMATED NEURAL NETWORK BACKGROUND ── */}
      <NeuralBackground />

      {/* ── GLOBAL BACKGROUND LAYERS (matches Hero aesthetic) ── */}
      <div className="fixed inset-0 -z-10 hero-hex-grid opacity-[0.18] pointer-events-none" />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-20 left-[10%] h-[700px] w-[700px] rounded-full bg-cyan-500/[0.045] blur-[200px]" />
        <div className="absolute top-1/3 right-[5%] h-[600px] w-[600px] rounded-full bg-violet-600/[0.04] blur-[180px]" />
        <div className="absolute top-2/3 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/[0.035] blur-[160px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-cyan-400/[0.03] blur-[140px]" />
      </div>

      <CustomCursor />
      <Helmet>
        <title>{t("pages.homeTitle")}</title>
        <meta name="description" content={t("pages.homeDescription")} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Youssef AlSherief — Portfolio" />
        <meta property="og:title" content={t("pages.homeTitle")} />
        <meta property="og:description" content={t("pages.homeDescription")} />
        <meta property="og:image" content="https://youssefalsherief.tech/assets/opengraph.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Youssef AlSherief — Tech Hybrid Portfolio" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@YousefSaberjou" />
        <meta name="twitter:creator" content="@YousefSaberjou" />
        <meta name="twitter:title" content={t("pages.homeTitle")} />
        <meta name="twitter:description" content={t("pages.homeDescription")} />
        <meta name="twitter:image" content="https://youssefalsherief.tech/assets/opengraph.png" />
        <meta name="twitter:image:alt" content="Youssef AlSherief — Tech Hybrid Portfolio" />
      </Helmet>

      <Navbar />
      <Hero />
      <About />
      <Services />
      <Experience />
      <Projects />
      <Education />
      <Certifications />
      <Skills />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;

