import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Index = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const loc = locale ?? "en";
  const canonicalUrl = `https://youssefalsherief.tech/${loc}`;

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{t("pages.homeTitle")}</title>
        <meta name="description" content={t("pages.homeDescription")} />
        <link rel="canonical" href={canonicalUrl} />

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
