import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Youssef AlSherief — Tech Hybrid Portfolio</title>
        <meta name="description" content="Youssef AlSherief — Computer Engineer & Full-Stack Developer combining hardware engineering with AI-powered software solutions." />
        <meta property="og:title" content="Youssef AlSherief — Tech Hybrid Portfolio" />
        <meta property="og:description" content="Computer Engineer and Full-Stack Developer combining hardware engineering with AI-powered software solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/CVP.png" />
      </Helmet>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Experience />
      <Projects />
      <Education />
      <Skills />
      <Blog />
      <Contact />
    </main>
  );
};

export default Index;
